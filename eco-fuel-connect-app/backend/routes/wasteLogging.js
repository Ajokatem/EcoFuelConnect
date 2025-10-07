const express = require('express');
const WasteEntry = require('../models/WasteEntry');
const { auth, managerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Waste types configuration
const WASTE_TYPES = {
  food_scraps: { label: 'Food Scraps', category: 'wet_waste', avgYield: 0.5 },
  vegetable_peels: { label: 'Vegetable Peels', category: 'wet_waste', avgYield: 0.4 },
  fruit_waste: { label: 'Fruit Waste', category: 'wet_waste', avgYield: 0.4 },
  garden_waste: { label: 'Garden Waste', category: 'mixed', avgYield: 0.3 },
  paper_organic: { label: 'Organic Paper', category: 'dry_organic', avgYield: 0.2 },
  agricultural_residue: { label: 'Agricultural Residue', category: 'mixed', avgYield: 0.4 },
  animal_manure: { label: 'Animal Manure', category: 'wet_waste', avgYield: 0.6 },
  mixed_organic: { label: 'Mixed Organic', category: 'mixed', avgYield: 0.4 },
  other: { label: 'Other', category: 'mixed', avgYield: 0.3 }
};

const SUPPLIER_TYPES = [
  'household', 'restaurant', 'market', 'farm', 'school', 'hospital', 'other'
];

// @route   GET /api/waste-logging/waste-types
// @desc    Get available waste types
// @access  Public
router.get('/waste-types', (req, res) => {
  try {
    const wasteTypes = Object.entries(WASTE_TYPES).map(([key, value]) => ({
      value: key,
      label: value.label,
      category: value.category,
      estimatedYield: value.avgYield
    }));

    res.json({
      message: 'Waste types retrieved successfully',
      wasteTypes,
      supplierTypes: SUPPLIER_TYPES
    });
  } catch (error) {
    console.error('Waste types error:', error);
    res.status(500).json({
      message: 'Error retrieving waste types'
    });
  }
});

// @route   POST /api/waste-logging
// @desc    Create a new waste entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      supplierName,
      supplierType,
      supplierContact,
      wasteType,
      wasteCategory,
      quality = 'good',
      weight,
      unit = 'kg',
      collectionDate,
      collectionTime,
      collectionAddress,
      collectorName,
      collectorId,
      collectorContact,
      moistureContent,
      notes
    } = req.body;

    // Validation
    if (!supplierName || !supplierType || !wasteType || !weight || !collectionDate || !collectionAddress) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Validate waste type
    if (!WASTE_TYPES[wasteType]) {
      return res.status(400).json({
        message: 'Invalid waste type selected'
      });
    }

    // Validate supplier type
    if (!SUPPLIER_TYPES.includes(supplierType)) {
      return res.status(400).json({
        message: 'Invalid supplier type selected'
      });
    }

    // Parse collection address
    const addressParts = collectionAddress.split(',').map(part => part.trim());
    const parsedAddress = {
      address: collectionAddress,
      district: addressParts[1] || '',
      sector: addressParts[2] || ''
    };

    // Parse supplier contact if provided
    let supplierContactInfo = {};
    if (supplierContact) {
      const contactParts = supplierContact.split(',').map(part => part.trim());
      supplierContactInfo = {
        phone: contactParts[0] || supplierContact,
        email: contactParts[1] || '',
        address: contactParts[2] || ''
      };
    }

    // Create waste entry
    const wasteEntry = new WasteEntry({
      user: req.user.id,
      supplier: {
        name: supplierName,
        type: supplierType,
        contact: supplierContactInfo
      },
      wasteDetails: {
        type: wasteType,
        category: wasteCategory || WASTE_TYPES[wasteType].category,
        quality,
        moistureContent: moistureContent ? parseInt(moistureContent) : undefined
      },
      quantity: {
        weight: parseFloat(weight),
        unit
      },
      collectionInfo: {
        date: new Date(collectionDate),
        time: collectionTime || new Date().toTimeString().slice(0, 5),
        location: parsedAddress,
        collectedBy: {
          name: collectorName || req.user.firstName + ' ' + req.user.lastName,
          id: collectorId || req.user.id,
          contact: collectorContact || req.user.email
        }
      },
      notes: {
        supplier: notes
      }
    });

    await wasteEntry.save();

    // Populate user data for response
    await wasteEntry.populate('user', 'firstName lastName email');

    res.status(201).json({
      message: 'Waste entry created successfully',
      wasteEntry: {
        id: wasteEntry._id,
        entryId: wasteEntry.entryId,
        supplier: wasteEntry.supplier,
        wasteDetails: wasteEntry.wasteDetails,
        quantity: wasteEntry.quantity,
        collectionInfo: wasteEntry.collectionInfo,
        processing: wasteEntry.processing,
        environmental: wasteEntry.environmental,
        createdAt: wasteEntry.createdAt
      }
    });

  } catch (error) {
    console.error('Create waste entry error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Error creating waste entry'
    });
  }
});

// @route   GET /api/waste-logging
// @desc    Get user's waste entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      wasteType,
      supplierType,
      quality,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { user: req.user.id, isActive: true };
    
    if (wasteType) query['wasteDetails.type'] = wasteType;
    if (supplierType) query['supplier.type'] = supplierType;
    if (quality) query['wasteDetails.quality'] = quality;
    if (status) query['processing.status'] = status;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [wasteEntries, totalCount] = await Promise.all([
      WasteEntry.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email')
        .select('-quality_check -notes.processor'),
      WasteEntry.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      message: 'Waste entries retrieved successfully',
      wasteEntries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get waste entries error:', error);
    res.status(500).json({
      message: 'Error retrieving waste entries'
    });
  }
});

// @route   GET /api/waste-logging/:id
// @desc    Get specific waste entry
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const wasteEntry = await WasteEntry.findById(req.params.id)
      .populate('user', 'firstName lastName email phone');

    if (!wasteEntry) {
      return res.status(404).json({
        message: 'Waste entry not found'
      });
    }

    // Check if user owns the entry or is admin/manager
    if (wasteEntry.user._id.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. You can only view your own waste entries.'
      });
    }

    res.json({
      message: 'Waste entry retrieved successfully',
      wasteEntry
    });

  } catch (error) {
    console.error('Get waste entry error:', error);
    res.status(500).json({
      message: 'Error retrieving waste entry'
    });
  }
});

// @route   PUT /api/waste-logging/:id
// @desc    Update waste entry (by user - limited fields)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const wasteEntry = await WasteEntry.findById(req.params.id);

    if (!wasteEntry) {
      return res.status(404).json({
        message: 'Waste entry not found'
      });
    }

    // Check ownership
    if (wasteEntry.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own waste entries.'
      });
    }

    // Only allow updates if entry is still in collected status
    if (wasteEntry.processing.status !== 'collected') {
      return res.status(400).json({
        message: 'Cannot update waste entry. It has already been processed.'
      });
    }

    const {
      supplierContact,
      quality,
      moistureContent,
      collectionTime,
      notes
    } = req.body;

    // Update allowed fields
    const updateData = {};
    if (supplierContact) {
      const contactParts = supplierContact.split(',').map(part => part.trim());
      updateData['supplier.contact'] = {
        phone: contactParts[0] || supplierContact,
        email: contactParts[1] || '',
        address: contactParts[2] || ''
      };
    }
    if (quality) updateData['wasteDetails.quality'] = quality;
    if (moistureContent !== undefined) updateData['wasteDetails.moistureContent'] = parseInt(moistureContent);
    if (collectionTime) updateData['collectionInfo.time'] = collectionTime;
    if (notes !== undefined) updateData['notes.supplier'] = notes;

    const updatedEntry = await WasteEntry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    res.json({
      message: 'Waste entry updated successfully',
      wasteEntry: updatedEntry
    });

  } catch (error) {
    console.error('Update waste entry error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Error updating waste entry'
    });
  }
});

// @route   DELETE /api/waste-logging/:id
// @desc    Delete waste entry (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const wasteEntry = await WasteEntry.findById(req.params.id);

    if (!wasteEntry) {
      return res.status(404).json({
        message: 'Waste entry not found'
      });
    }

    // Check ownership
    if (wasteEntry.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own waste entries.'
      });
    }

    // Only allow deletion if entry is still in collected status
    if (wasteEntry.processing.status !== 'collected') {
      return res.status(400).json({
        message: 'Cannot delete waste entry. It has already been processed.'
      });
    }

    // Soft delete
    wasteEntry.isActive = false;
    await wasteEntry.save();

    res.json({
      message: 'Waste entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete waste entry error:', error);
    res.status(500).json({
      message: 'Error deleting waste entry'
    });
  }
});

// @route   GET /api/waste-logging/stats/summary
// @desc    Get waste logging statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { timeframe } = req.query;
    
    const stats = await WasteEntry.getStats(req.user.id, timeframe);
    const summary = stats[0] || {
      totalEntries: 0,
      totalWeight: 0,
      totalBiogasProduced: 0,
      totalCarbonReduced: 0,
      totalPayments: 0,
      avgWeight: 0,
      supplierCount: 0
    };

    // Get waste type distribution
    const wasteDistribution = await WasteEntry.aggregate([
      { 
        $match: { 
          user: req.user._id,
          isActive: true 
        } 
      },
      {
        $group: {
          _id: '$wasteDetails.type',
          count: { $sum: 1 },
          totalWeight: { $sum: '$quantity.weight' }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);

    res.json({
      message: 'Waste logging statistics retrieved successfully',
      stats: {
        ...summary,
        wasteDistribution: wasteDistribution.map(item => ({
          type: item._id,
          label: WASTE_TYPES[item._id]?.label || item._id,
          count: item.count,
          weight: item.totalWeight
        }))
      }
    });

  } catch (error) {
    console.error('Waste logging stats error:', error);
    res.status(500).json({
      message: 'Error retrieving waste logging statistics'
    });
  }
});

// @route   GET /api/waste-logging/:id/biogas-potential
// @desc    Calculate biogas potential for waste entry
// @access  Private
router.get('/:id/biogas-potential', auth, async (req, res) => {
  try {
    const wasteEntry = await WasteEntry.findById(req.params.id);

    if (!wasteEntry) {
      return res.status(404).json({
        message: 'Waste entry not found'
      });
    }

    // Check ownership or admin access
    if (wasteEntry.user.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    const biogasPotential = wasteEntry.calculateBiogasPotential();

    res.json({
      message: 'Biogas potential calculated successfully',
      biogasPotential: {
        estimatedYield: Math.round(biogasPotential * 100) / 100,
        unit: 'cubic meters',
        wasteWeight: wasteEntry.quantity.weight,
        wasteType: wasteEntry.wasteDetails.type,
        quality: wasteEntry.wasteDetails.quality
      }
    });

  } catch (error) {
    console.error('Biogas potential calculation error:', error);
    res.status(500).json({
      message: 'Error calculating biogas potential'
    });
  }
});

// Admin/Manager routes

// @route   GET /api/waste-logging/admin/all
// @desc    Get all waste entries (Admin/Manager)
// @access  Private (Admin/Manager)
router.get('/admin/all', auth, managerOrAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      wasteType,
      supplierType,
      status,
      userId,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (wasteType) query['wasteDetails.type'] = wasteType;
    if (supplierType) query['supplier.type'] = supplierType;
    if (status) query['processing.status'] = status;
    if (userId) query.user = userId;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [wasteEntries, totalCount] = await Promise.all([
      WasteEntry.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'firstName lastName email phone organization'),
      WasteEntry.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      message: 'All waste entries retrieved successfully',
      wasteEntries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get all waste entries error:', error);
    res.status(500).json({
      message: 'Error retrieving waste entries'
    });
  }
});

// @route   PUT /api/waste-logging/admin/:id/processing
// @desc    Update waste processing status (Admin/Manager)
// @access  Private (Admin/Manager)
router.put('/admin/:id/processing', auth, managerOrAdmin, async (req, res) => {
  try {
    const {
      status,
      facilityName,
      facilityLocation,
      biogasProduced,
      fertilizerAmount,
      compostAmount,
      processingNotes
    } = req.body;

    if (!status) {
      return res.status(400).json({
        message: 'Processing status is required'
      });
    }

    const validStatuses = ['collected', 'in_transit', 'received', 'processing', 'processed', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid processing status'
      });
    }

    const wasteEntry = await WasteEntry.findById(req.params.id);

    if (!wasteEntry) {
      return res.status(404).json({
        message: 'Waste entry not found'
      });
    }

    // Update processing information
    const updateData = {
      'processing.status': status
    };

    if (facilityName) updateData['processing.facility.name'] = facilityName;
    if (facilityLocation) updateData['processing.facility.location'] = facilityLocation;
    if (biogasProduced) updateData['processing.biogasProduced.amount'] = parseFloat(biogasProduced);
    if (fertilizerAmount) updateData['processing.byProducts.fertilizer.amount'] = parseFloat(fertilizerAmount);
    if (compostAmount) updateData['processing.byProducts.compost.amount'] = parseFloat(compostAmount);
    if (processingNotes) updateData['notes.processor'] = processingNotes;

    if (['processed', 'completed'].includes(status)) {
      updateData['processing.processedDate'] = new Date();
    }

    const updatedEntry = await WasteEntry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    res.json({
      message: `Waste processing updated to ${status} successfully`,
      wasteEntry: updatedEntry
    });

  } catch (error) {
    console.error('Update waste processing error:', error);
    res.status(500).json({
      message: 'Error updating waste processing'
    });
  }
});

module.exports = router;