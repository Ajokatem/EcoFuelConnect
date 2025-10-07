const express = require('express');
const FuelRequest = require('../models/FuelRequest');
const { auth, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Fuel types configuration
const FUEL_TYPES = {
  biogas: {
    name: 'Biogas',
    pricePerUnit: 0.8,
    unit: 'cubic meter',
    description: 'Clean burning gas for cooking and heating'
  },
  biomethane: {
    name: 'Biomethane',
    pricePerUnit: 1.2,
    unit: 'liter',
    description: 'Refined biogas suitable for vehicles'
  },
  bioethanol: {
    name: 'Bioethanol',
    pricePerUnit: 1.5,
    unit: 'liter',
    description: 'Alcohol-based fuel for vehicles'
  },
  bio_diesel: {
    name: 'Bio-Diesel',
    pricePerUnit: 1.8,
    unit: 'liter',
    description: 'Diesel alternative from organic sources'
  }
};

// @route   GET /api/fuel-requests/fuel-types
// @desc    Get available fuel types
// @access  Public
router.get('/fuel-types', (req, res) => {
  try {
    const fuelTypes = Object.entries(FUEL_TYPES).map(([key, value]) => ({
      value: key,
      label: value.name,
      price: value.pricePerUnit,
      unit: value.unit,
      description: value.description
    }));

    res.json({
      message: 'Fuel types retrieved successfully',
      fuelTypes
    });
  } catch (error) {
    console.error('Fuel types error:', error);
    res.status(500).json({
      message: 'Error retrieving fuel types'
    });
  }
});

// @route   POST /api/fuel-requests
// @desc    Create a new fuel request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      fuelType,
      quantity,
      deliveryAddress,
      preferredDeliveryDate,
      urgency = 'normal',
      purpose,
      contactNumber,
      additionalNotes
    } = req.body;

    // Validation
    if (!fuelType || !quantity || !deliveryAddress || !preferredDeliveryDate || !purpose || !contactNumber) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Validate fuel type
    if (!FUEL_TYPES[fuelType]) {
      return res.status(400).json({
        message: 'Invalid fuel type selected'
      });
    }

    // Validate delivery date
    const deliveryDate = new Date(preferredDeliveryDate);
    if (deliveryDate <= new Date()) {
      return res.status(400).json({
        message: 'Delivery date must be in the future'
      });
    }

    // Parse delivery address
    const addressParts = deliveryAddress.split(',').map(part => part.trim());
    const parsedAddress = {
      street: addressParts[0] || deliveryAddress,
      city: addressParts[1] || '',
      state: addressParts[2] || '',
      zipCode: addressParts[3] || ''
    };

    // Create fuel request
    const fuelRequest = new FuelRequest({
      user: req.user.id,
      fuelType,
      fuelDetails: FUEL_TYPES[fuelType],
      quantity: parseFloat(quantity),
      deliveryAddress: parsedAddress,
      contactInfo: {
        phone: contactNumber,
        email: req.user.email
      },
      preferredDeliveryDate: deliveryDate,
      urgency,
      purpose,
      additionalNotes
    });

    await fuelRequest.save();

    // Populate user data for response
    await fuelRequest.populate('user', 'firstName lastName email');

    res.status(201).json({
      message: 'Fuel request created successfully',
      fuelRequest: {
        id: fuelRequest._id,
        requestId: fuelRequest.requestId,
        fuelType: fuelRequest.fuelType,
        fuelDetails: fuelRequest.fuelDetails,
        quantity: fuelRequest.quantity,
        totalCost: fuelRequest.totalCost,
        deliveryAddress: fuelRequest.deliveryAddress,
        preferredDeliveryDate: fuelRequest.preferredDeliveryDate,
        urgency: fuelRequest.urgency,
        status: fuelRequest.status,
        createdAt: fuelRequest.createdAt
      }
    });

  } catch (error) {
    console.error('Create fuel request error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Error creating fuel request'
    });
  }
});

// @route   GET /api/fuel-requests
// @desc    Get user's fuel requests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      fuelType,
      urgency,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.user.id, isActive: true };
    
    if (status) query.status = status;
    if (fuelType) query.fuelType = fuelType;
    if (urgency) query.urgency = urgency;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [fuelRequests, totalCount] = await Promise.all([
      FuelRequest.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email')
        .select('-statusHistory -payment.transactionId'),
      FuelRequest.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      message: 'Fuel requests retrieved successfully',
      fuelRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get fuel requests error:', error);
    res.status(500).json({
      message: 'Error retrieving fuel requests'
    });
  }
});

// @route   GET /api/fuel-requests/:id
// @desc    Get specific fuel request
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const fuelRequest = await FuelRequest.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('statusHistory.updatedBy', 'firstName lastName');

    if (!fuelRequest) {
      return res.status(404).json({
        message: 'Fuel request not found'
      });
    }

    // Check if user owns the request or is admin/manager
    if (fuelRequest.user._id.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own fuel requests.'
      });
    }

    res.json({
      message: 'Fuel request retrieved successfully',
      fuelRequest
    });

  } catch (error) {
    console.error('Get fuel request error:', error);
    res.status(500).json({
      message: 'Error retrieving fuel request'
    });
  }
});

// @route   PUT /api/fuel-requests/:id
// @desc    Update fuel request (by user - limited fields)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const fuelRequest = await FuelRequest.findById(req.params.id);

    if (!fuelRequest) {
      return res.status(404).json({
        message: 'Fuel request not found'
      });
    }

    // Check ownership
    if (fuelRequest.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own fuel requests.'
      });
    }

    // Only allow updates if request is still pending
    if (fuelRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Cannot update fuel request. It has already been processed.'
      });
    }

    const {
      deliveryAddress,
      preferredDeliveryDate,
      urgency,
      contactNumber,
      additionalNotes
    } = req.body;

    // Update allowed fields
    const updateData = {};
    if (deliveryAddress) {
      const addressParts = deliveryAddress.split(',').map(part => part.trim());
      updateData.deliveryAddress = {
        street: addressParts[0] || deliveryAddress,
        city: addressParts[1] || '',
        state: addressParts[2] || '',
        zipCode: addressParts[3] || ''
      };
    }
    if (preferredDeliveryDate) {
      const deliveryDate = new Date(preferredDeliveryDate);
      if (deliveryDate <= new Date()) {
        return res.status(400).json({
          message: 'Delivery date must be in the future'
        });
      }
      updateData.preferredDeliveryDate = deliveryDate;
    }
    if (urgency) updateData.urgency = urgency;
    if (contactNumber) updateData['contactInfo.phone'] = contactNumber;
    if (additionalNotes !== undefined) updateData.additionalNotes = additionalNotes;

    const updatedRequest = await FuelRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    res.json({
      message: 'Fuel request updated successfully',
      fuelRequest: updatedRequest
    });

  } catch (error) {
    console.error('Update fuel request error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Error updating fuel request'
    });
  }
});

// @route   DELETE /api/fuel-requests/:id
// @desc    Cancel fuel request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const fuelRequest = await FuelRequest.findById(req.params.id);

    if (!fuelRequest) {
      return res.status(404).json({
        message: 'Fuel request not found'
      });
    }

    // Check ownership
    if (fuelRequest.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied. You can only cancel your own fuel requests.'
      });
    }

    // Check if request can be cancelled
    if (!fuelRequest.canBeCancelled()) {
      return res.status(400).json({
        message: 'Cannot cancel fuel request. It is already being processed or delivered.'
      });
    }

    // Update status to cancelled
    await fuelRequest.updateStatus('cancelled', req.user.id, 'Cancelled by user');

    res.json({
      message: 'Fuel request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel fuel request error:', error);
    res.status(500).json({
      message: 'Error cancelling fuel request'
    });
  }
});

// @route   GET /api/fuel-requests/stats/summary
// @desc    Get fuel request statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = await FuelRequest.getStats(req.user.id);
    const summary = stats[0] || {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      processing: 0,
      delivered: 0,
      totalValue: 0,
      avgOrderValue: 0
    };

    res.json({
      message: 'Fuel request statistics retrieved successfully',
      stats: summary
    });

  } catch (error) {
    console.error('Fuel request stats error:', error);
    res.status(500).json({
      message: 'Error retrieving fuel request statistics'
    });
  }
});

// Admin/Manager routes

// @route   GET /api/fuel-requests/admin/all
// @desc    Get all fuel requests (Admin/Manager)
// @access  Private (Admin/Manager)
router.get('/admin/all', auth, managerOrAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      fuelType,
      urgency,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (status) query.status = status;
    if (fuelType) query.fuelType = fuelType;
    if (urgency) query.urgency = urgency;
    if (userId) query.user = userId;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [fuelRequests, totalCount] = await Promise.all([
      FuelRequest.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email phone organization')
        .populate('statusHistory.updatedBy', 'firstName lastName'),
      FuelRequest.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      message: 'All fuel requests retrieved successfully',
      fuelRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get all fuel requests error:', error);
    res.status(500).json({
      message: 'Error retrieving fuel requests'
    });
  }
});

// @route   PUT /api/fuel-requests/admin/:id/status
// @desc    Update fuel request status (Admin/Manager)
// @access  Private (Admin/Manager)
router.put('/admin/:id/status', auth, managerOrAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'approved', 'processing', 'in_transit', 'delivered', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status provided'
      });
    }

    const fuelRequest = await FuelRequest.findById(req.params.id);

    if (!fuelRequest) {
      return res.status(404).json({
        message: 'Fuel request not found'
      });
    }

    // Update status
    await fuelRequest.updateStatus(status, req.user.id, notes);

    // Update approval info if approved
    if (status === 'approved') {
      fuelRequest.approval = {
        approvedBy: req.user.id,
        approvedAt: new Date()
      };
      await fuelRequest.save();
    }

    // Update rejection reason if rejected
    if (status === 'rejected') {
      fuelRequest.approval = {
        rejectionReason: notes || 'Request rejected'
      };
      await fuelRequest.save();
    }

    await fuelRequest.populate('user', 'firstName lastName email');

    res.json({
      message: `Fuel request ${status} successfully`,
      fuelRequest
    });

  } catch (error) {
    console.error('Update fuel request status error:', error);
    res.status(500).json({
      message: 'Error updating fuel request status'
    });
  }
});

module.exports = router;