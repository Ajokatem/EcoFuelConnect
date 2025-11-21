const express = require('express');
const router = express.Router();
const FuelRequest = require('../models/FuelRequest');
const { auth, adminOnly, schoolOnly } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security middleware
router.use(helmet());

// Rate limiting
const fuelRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});

router.use(fuelRequestLimiter);

// Create new fuel request
router.post('/', [
  auth,
  body('fuelType').notEmpty().withMessage('Fuel type is required'),
  body('quantityRequested').isFloat({ min: 1 }).withMessage('Requested quantity must be a positive number'),
  body('preferredDeliveryDate').isISO8601().withMessage('Valid delivery date is required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      fuelType,
      quantityRequested,
      unit,
      deliveryAddress,
      preferredDeliveryDate,
      priority,
      notes,
      contactPerson,
      contactPhone,
      producerId
    } = req.body;
    
    const schoolId = req.user.id;

      // Generate requestId if not present
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      const requestId = `FR-${timestamp}-${random}`;

      const fuelRequest = await FuelRequest.create({
        schoolId,
        producerId,
        fuelType,
        quantityRequested: parseFloat(quantityRequested),
        unit,
        deliveryAddress,
        preferredDeliveryDate: new Date(preferredDeliveryDate),
        priority: priority || 'medium',
        notes,
        contactPerson,
        contactPhone,
        requestId,
        status: 'pending',
        requestDate: new Date()
      });

      // Notify school (confirmation of request)
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: schoolId,
        type: 'fuel_request',
        title: 'Fuel Request Submitted',
        message: `Your fuel request for ${fuelType} (${quantityRequested} ${unit}) has been submitted and is pending approval.`,
        read: false,
        isRead: false,
        relatedId: fuelRequest.id
      });
      // Notify producer
      if (producerId) {
        const User = require('../models/User');
        const school = await User.findByPk(schoolId);
        const schoolName = school ? `${school.firstName} ${school.lastName} (${school.organization || 'School'})` : `School ID ${schoolId}`;
        
        await Notification.create({
          userId: producerId,
          type: 'fuel_request',
          title: 'New Fuel Request Received',
          message: `You have received a new fuel request from ${schoolName} for ${fuelType} (${quantityRequested} ${unit}). Please review and approve or decline.`,
          read: false,
          isRead: false,
          relatedId: fuelRequest.id
        });
        // Send email to producer
        try {
          const { sendMail } = require('../utils/mailer');
          const producer = await User.findByPk(producerId);
          if (producer && producer.email) {
            await sendMail({
              to: producer.email,
              subject: 'New Fuel Request Received',
              text: `You have received a new fuel request from ${school ? (school.organization || school.firstName + ' ' + school.lastName) : 'a school'} for ${fuelType} (${quantityRequested} ${unit}). Please review and approve or decline.`,
              html: `<p>You have received a new fuel request from <strong>${school ? (school.organization || school.firstName + ' ' + school.lastName) : 'a school'}</strong> for <strong>${fuelType} (${quantityRequested} ${unit})</strong>.<br>Please review and approve or decline in the dashboard.</p>`
            });
          }
        } catch (err) {
          // Log but don't block
          console.error('Error sending fuel request email:', err.message);
        }
      }

      res.status(201).json({ 
        success: true,
        message: 'Fuel request created successfully', 
        request: fuelRequest,
        toast: {
          type: 'success',
          title: 'Request Submitted!',
          message: `Your fuel request for ${fuelType} (${quantityRequested} ${unit}) has been submitted successfully.`
        }
      });
  } catch (error) {
    console.error('Error creating fuel request:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create fuel request', 
      details: error.message,
      toast: {
        type: 'error',
        title: 'Request Failed',
        message: 'Unable to submit your fuel request. Please try again.'
      }
    });
  }
});

// Get fuel requests with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let where = {};
    if (req.user.role === 'school') {
      where.schoolId = req.user.id;
    } else if (req.user.role === 'supplier') {
      where.assignedSupplierId = req.user.id;
    }
    
    if (status && typeof status === 'string') {
      where.status = status.trim();
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
      const User = require('../models/User');
      const requests = await FuelRequest.findAll({
        where,
        order: [['requestDate', 'DESC']],
        limit: parseInt(limit),
        offset,
        include: [
          { model: User, as: 'school', attributes: ['id', 'firstName', 'lastName', 'organization', 'email'] },
          { model: User, as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization', 'email'] }
        ]
      });

    const total = await FuelRequest.count({ where });
    // Add 'dateRequested' field for frontend compatibility
    const requestsWithDate = requests.map(r => {
      const obj = r.toJSON();
      obj.dateRequested = obj.createdAt;
      return obj;
    });
    res.json({ 
      success: true,
      requests: requestsWithDate,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching fuel requests:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific fuel request
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await FuelRequest.findByPk(req.params.id, {
      include: [
        { model: require('../models/User'), as: 'school', attributes: ['id', 'firstName', 'lastName', 'organization', 'email', 'phone'] },
        { model: require('../models/User'), as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization', 'email', 'phone'] }
      ]
    });

    if (!request) {
      return res.status(404).json({ success: false, error: 'Fuel request not found' });
    }

    // Check permissions
    if (req.user.role === 'school' && request.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, request });
  } catch (error) {
    console.error('Error fetching fuel request:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update fuel request status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const request = await FuelRequest.findByPk(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, error: 'Fuel request not found' });
    }

    await request.update({
      status,
      notes: notes || request.notes,
      updatedAt: new Date()
    });

    // Notify school for any status change
    const Notification = require('../models/Notification');
    let notifTitle = 'Fuel Request Update';
    let notifMsg = `Your fuel request has been ${status}.`;
    if (status === 'approved') {
      notifTitle = 'Fuel Request Approved';
      notifMsg = 'Your fuel request has been approved by the producer.';
    } else if (status === 'declined') {
      notifTitle = 'Fuel Request Declined';
      notifMsg = 'Your fuel request has been declined by the producer.';
    } else if (status === 'delivered') {
      notifTitle = 'Fuel Request Delivered';
      notifMsg = 'Your fuel request has been delivered.';
    }
    await Notification.create({
      userId: request.schoolId,
      type: 'fuel_request',
      title: notifTitle,
      message: notifMsg,
      read: false,
      relatedId: request.id
    });

    res.json({ 
      success: true,
      message: `Status updated to ${status}`, 
      request 
    });
  } catch (error) {
    console.error('Error updating fuel request status:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign supplier to fuel request (admin only)
router.patch('/:id/assign', auth, adminOnly, async (req, res) => {
  try {
    const { supplierId } = req.body;
    const request = await FuelRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Fuel request not found' });
    }

    request.assignedSupplierId = supplierId;
    request.status = 'assigned';

    request.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      updatedBy: req.user.userId,
      notes: `Assigned to supplier: ${supplierId}`
    });

    await request.save();
    res.json({ message: 'Supplier assigned successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/fuel-requests/:id/approve - Approve/Reject fuel request
router.post('/:id/approve', auth, async (req, res) => {
  try {
    const { approved, rejectionReason } = req.body;
    const fuelRequest = await FuelRequest.findByPk(req.params.id);
    
    if (!fuelRequest) {
      return res.status(404).json({ success: false, message: 'Fuel request not found' });
    }
    
    // Only producers and admins can approve
    if (req.user.role !== 'admin' && req.user.role !== 'producer') {
      return res.status(403).json({ success: false, message: 'Only producers can approve/reject fuel requests' });
    }
    
    const Notification = require('../models/Notification');
    
    if (approved) {
      fuelRequest.status = 'approved';
      fuelRequest.approvedBy = req.user.id;
      fuelRequest.approvedAt = new Date();
      await fuelRequest.save();
      
      // Notify school
      await Notification.create({
        userId: fuelRequest.schoolId,
        type: 'fuel_request',
        title: 'Fuel Request Approved',
        message: `Your fuel request for ${fuelRequest.fuelType} (${fuelRequest.quantityRequested} ${fuelRequest.unit}) has been approved!`,
        read: false,
        isRead: false,
        relatedId: fuelRequest.id
      });
      
      // Update producer's notification
      await Notification.create({
        userId: req.user.id,
        type: 'fuel_request',
        title: 'Fuel Request Approved',
        message: `You have approved the fuel request for ${fuelRequest.fuelType} (${fuelRequest.quantityRequested} ${fuelRequest.unit}).`,
        read: false,
        isRead: false,
        relatedId: fuelRequest.id
      });
    } else {
      fuelRequest.status = 'rejected';
      fuelRequest.rejectionReason = rejectionReason || 'No reason provided';
      await fuelRequest.save();
      
      // Notify school
      await Notification.create({
        userId: fuelRequest.schoolId,
        type: 'fuel_request',
        title: 'Fuel Request Rejected',
        message: `Your fuel request was rejected. Reason: ${rejectionReason || 'No reason provided'}`,
        read: false,
        isRead: false,
        relatedId: fuelRequest.id
      });
      
      // Update producer's notification
      await Notification.create({
        userId: req.user.id,
        type: 'fuel_request',
        title: 'Fuel Request Rejected',
        message: `You have rejected the fuel request for ${fuelRequest.fuelType} (${fuelRequest.quantityRequested} ${fuelRequest.unit}).`,
        read: false,
        isRead: false,
        relatedId: fuelRequest.id
      });
    }

    res.json({
      success: true,
      message: approved ? 'Fuel request approved' : 'Fuel request rejected'
    });
  } catch (error) {
    console.error('Error approving fuel request:', error);
    res.status(500).json({ success: false, message: 'Error processing fuel request' });
  }
});

module.exports = router;
