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
  body('requestedQuantity').isFloat({ min: 1 }).withMessage('Requested quantity must be a positive number'),
  body('deliveryDate').isISO8601().withMessage('Valid delivery date is required'),
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
      requestedQuantity,
      deliveryDate,
      deliveryAddress,
      priority,
      contactPerson,
      contactPhone,
      notes
    } = req.body;

    const fuelRequest = await FuelRequest.create({
      userId: req.user.id,
      schoolName: req.user.organization || `${req.user.firstName} ${req.user.lastName}`,
      fuelType,
      requestedQuantity: parseFloat(requestedQuantity),
      priority: priority || 'medium',
      deliveryDate: new Date(deliveryDate),
      deliveryAddress,
      contactPerson: contactPerson || `${req.user.firstName} ${req.user.lastName}`,
      contactPhone: contactPhone || req.user.phone,
      notes,
      status: 'pending',
      requestDate: new Date()
    });

    res.status(201).json({ 
      success: true,
      message: 'Fuel request created successfully', 
      request: fuelRequest 
    });
  } catch (error) {
    console.error('Error creating fuel request:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create fuel request', 
      details: error.message 
    });
  }
});

// Get fuel requests with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let where = {};
    if (req.user.role === 'school') {
      where.userId = req.user.id;
    } else if (req.user.role === 'supplier') {
      where.assignedSupplierId = req.user.id;
    }
    
    if (status && typeof status === 'string') {
      where.status = status.trim();
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const requests = await FuelRequest.findAll({
      where,
      order: [['requestDate', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        { model: require('../models/User'), as: 'user', attributes: ['id', 'firstName', 'lastName', 'organization', 'email'] }
      ]
    });

    const total = await FuelRequest.count({ where });
    res.json({ 
      success: true,
      requests, 
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
        { model: require('../models/User'), as: 'user', attributes: ['id', 'firstName', 'lastName', 'organization', 'email', 'phone'] }
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

module.exports = router;
