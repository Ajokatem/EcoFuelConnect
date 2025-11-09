const express = require('express');
const router = express.Router();
const WasteEntry = require('../models/WasteEntry');
const User = require('../models/User');
const { auth, managerOrAdmin } = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security middleware
router.use(helmet());

// Rate limiting
const wasteLoggingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});

router.use(wasteLoggingLimiter);

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

// GET /api/waste-logging/waste-types - Get available waste types
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

// GET /api/waste-logging - Get waste entries with filtering
router.get('/', auth, async (req, res) => {
  try {
    const {
      supplier,
      producer,
      wasteType,
      wasteSource,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;
    // Build Sequelize where clause with proper sanitization
    let where = {};
    if (req.user.role === 'supplier') {
      where.supplierId = parseInt(req.user.id);
    } else if (req.user.role === 'producer') {
      where.producerId = parseInt(req.user.id);
    }
    if (supplier && !isNaN(parseInt(supplier))) where.supplierId = parseInt(supplier);
    if (producer && !isNaN(parseInt(producer))) where.producerId = parseInt(producer);
    if (wasteType && typeof wasteType === 'string') where.wasteType = wasteType.trim();
    if (wasteSource && typeof wasteSource === 'string') where.wasteSource = wasteSource.trim();
    if (status && typeof status === 'string') where.status = status.trim();
    if (startDate || endDate) {
      where.collectionTimestamp = {};
      if (startDate) where.collectionTimestamp[Op.gte] = new Date(startDate);
      if (endDate) where.collectionTimestamp[Op.lte] = new Date(endDate);
    }
    // Fetch entries with associations
    const { Op } = require('sequelize');
    const wasteEntries = await WasteEntry.findAll({
      where,
      include: [
        { model: User, as: 'supplier', attributes: ['id', 'firstName', 'lastName', 'organization', 'role'] },
        { model: User, as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization', 'role'] },
        { model: User, as: 'verifiedBy', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['collectionTimestamp', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });
    const total = await WasteEntry.count({ where });
    res.json({
      success: true,
      wasteEntries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      stats: await WasteEntry.getWasteStatistics(where)
    });
  } catch (error) {
    console.error('Error fetching waste entries:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching waste entries' });
  }
});

// GET /api/waste-logging/statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let matchQuery = {};
    if (req.user.role === 'supplier') {
      matchQuery.supplier = req.user._id;
    } else if (req.user.role === 'producer') {
      matchQuery.producer = req.user._id;
    }
    
    if (startDate || endDate) {
      matchQuery.collectionTimestamp = {};
      if (startDate) matchQuery.collectionTimestamp.$gte = new Date(startDate);
      if (endDate) matchQuery.collectionTimestamp.$lte = new Date(endDate);
    }
    
    // Get basic statistics
    const basicStats = await WasteEntry.getWasteStatistics(matchQuery);
    
    // Get trends over time
    const groupFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$collectionTimestamp' } },
      week: { $dateToString: { format: '%Y-%U', date: '$collectionTimestamp' } },
      month: { $dateToString: { format: '%Y-%m', date: '$collectionTimestamp' } }
    };
    
    const trends = await WasteEntry.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupFormat[groupBy],
          totalWaste: { $sum: '$estimatedWeight' },
          entryCount: { $sum: 1 },
          avgQuality: { $avg: { $cond: [
            { $eq: ['$qualityGrade', 'excellent'] }, 4,
            { $cond: [
              { $eq: ['$qualityGrade', 'good'] }, 3,
              { $cond: [
                { $eq: ['$qualityGrade', 'fair'] }, 2, 1
              ]}
            ]}
          ]}},
          wasteByType: {
            $push: {
              type: '$wasteType',
              weight: '$estimatedWeight'
            }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    // Get waste type distribution
    const wasteTypeDistribution = await WasteEntry.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$wasteType',
          totalWeight: { $sum: '$estimatedWeight' },
          count: { $sum: 1 },
          avgWeight: { $avg: '$estimatedWeight' }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);
    
    // Get source analysis
    const sourceAnalysis = await WasteEntry.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$wasteSource',
          totalWeight: { $sum: '$estimatedWeight' },
          count: { $sum: 1 },
          avgQuality: { $avg: { $cond: [
            { $eq: ['$qualityGrade', 'excellent'] }, 4,
            { $cond: [
              { $eq: ['$qualityGrade', 'good'] }, 3,
              { $cond: [
                { $eq: ['$qualityGrade', 'fair'] }, 2, 1
              ]}
            ]}
          ]}}
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);
    
    res.json({
      basicStats,
      trends,
      wasteTypeDistribution,
      sourceAnalysis
    });
  } catch (error) {
    console.error('Error fetching waste statistics:', error);
    res.status(500).json({ message: 'Error fetching waste statistics' });
  }
});

// GET /api/waste-logging/:id - Get single waste entry
router.get('/:id', [
  auth,
  param('id').isInt().withMessage('ID must be a valid integer')
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
    const wasteEntry = await WasteEntry.findByPk(req.params.id, {
      include: [
        { model: User, as: 'supplier', attributes: ['id', 'firstName', 'lastName', 'organization', 'role', 'contact'] },
        { model: User, as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization', 'role', 'plantCapacity'] },
        { model: User, as: 'verifiedBy', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!wasteEntry) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        wasteEntry.supplierId !== req.user.id && 
        wasteEntry.producerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, wasteEntry });
  } catch (error) {
    console.error('Error fetching waste entry:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching waste entry' });
  }
});

// POST /api/waste-logging - Create new waste entry
router.post('/', [
  auth,
  body('producerId').isInt().withMessage('Producer ID must be a valid integer'),
  body('wasteType').isIn(Object.keys(WASTE_TYPES)).withMessage('Invalid waste type'),
  body('wasteSource').isIn(SUPPLIER_TYPES).withMessage('Invalid waste source'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be a positive number'),
  body('unit').isIn(['kg', 'tons', 'bags', 'cubic_meters']).withMessage('Invalid unit'),
  body('qualityGrade').optional().isIn(['poor', 'fair', 'good', 'excellent']).withMessage('Invalid quality grade'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
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
      producerId,
      wasteType,
      wasteSource,
      sourceLocation,
      quantity,
      unit,
      qualityGrade,
      moistureContent,
      temperature,
      pH,
      images,
      weighbridgePhoto,
      receiptNumber,
      verificationMethod,
      collectionTimestamp,
      notes,
      supplierNotes,
      gpsAccuracy
    } = req.body;

    // Validate supplier role
    if (req.user.role !== 'supplier' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only suppliers can create waste entries' });
    }

    // Validate producer exists and is active (accept supplier or producer role)
    const producerUser = await User.findByPk(parseInt(producerId));
    if (!producerUser || (producerUser.role !== 'producer' && producerUser.role !== 'supplier') || producerUser.isActive === false) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive producer (must be supplier or producer role)' });
    }

    // Calculate estimatedWeight before saving
    let estimatedWeight = quantity;
    switch (unit) {
      case 'kg':
        estimatedWeight = quantity;
        break;
      case 'tons':
        estimatedWeight = quantity * 1000;
        break;
      case 'bags':
        estimatedWeight = quantity * 20;
        break;
      case 'cubic_meters':
        estimatedWeight = quantity * 500;
        break;
      default:
        estimatedWeight = quantity;
    }

    // Create new waste entry using Sequelize
    const wasteEntry = await WasteEntry.create({
      supplierId: req.user.id,
      producerId,
      wasteType,
      wasteSource,
      sourceLocation: req.body.location ? req.body.location : (sourceLocation || {}),
      quantity,
      unit,
      estimatedWeight,
      qualityGrade,
      moistureContent,
      temperature,
      pH,
      images: images || [],
      weighbridgePhoto,
      receiptNumber,
      verificationMethod,
      collectionTimestamp: collectionTimestamp || new Date(),
      geoTimestamp: {
        recordedAt: new Date(),
        accuracy: gpsAccuracy
      },
      notes,
      supplierNotes,
      status: 'pending'
    });

    // Fetch with associations for response
    const createdEntry = await WasteEntry.findByPk(wasteEntry.id, {
      include: [
        { model: User, as: 'supplier', attributes: ['id', 'firstName', 'lastName', 'organization', 'role'] },
        { model: User, as: 'producer', attributes: ['id', 'firstName', 'lastName', 'organization', 'role'] }
      ]
    });

    // Notify admin(s) about new waste entry
    const Notification = require('../models/Notification');
    const adminUsers = await User.findAll({ where: { role: 'admin', isActive: true } });
    const notificationPromises = adminUsers.map(admin => Notification.create({
      userId: admin.id,
      type: 'waste_entry',
      title: 'Waste Entry Logged',
      message: `New waste entry logged by ${req.user.firstName} ${req.user.lastName}. Waste type: ${createdEntry.wasteType}, Quantity: ${createdEntry.quantity} ${createdEntry.unit}.`,
      isRead: false
    }));
    // Notify the producer
    if (createdEntry.producer && createdEntry.producer.id) {
      notificationPromises.push(Notification.create({
        userId: createdEntry.producer.id,
        type: 'waste_entry',
        title: 'New Waste Entry Received',
        message: `You have received a new waste entry from ${req.user.firstName} ${req.user.lastName}. Waste type: ${createdEntry.wasteType}, Quantity: ${createdEntry.quantity} ${createdEntry.unit}.`,
        isRead: false,
        wasteEntryId: createdEntry.id
      }));
    }
    // Notify the supplier (confirmation of logging)
    notificationPromises.push(Notification.create({
      userId: req.user.id,
      type: 'waste_entry',
      title: 'Waste Entry Submitted',
      message: `Your waste entry for producer ${createdEntry.producer.firstName} ${createdEntry.producer.lastName} has been submitted and is pending approval.`,
      isRead: false,
      wasteEntryId: createdEntry.id
    }));
    // Add notification for supplier: Waste logged and pending
    notificationPromises.push(Notification.create({
      userId: req.user.id,
      type: 'waste_entry',
      title: 'Waste Pending',
      message: `Your waste entry for ${createdEntry.wasteType} is pending and awaiting producer confirmation.`,
      isRead: false,
      wasteEntryId: createdEntry.id
    }));
    await Promise.all(notificationPromises);

    // GAMIFIED COIN REWARD SYSTEM
    const db = require('../config/database').sequelize;
    
    // Calculate coins based on waste quantity and quality
    let coinsEarned = Math.floor(estimatedWeight * 0.5); // Base: 0.5 coins per kg
    
    // Quality multiplier
    const qualityMultipliers = {
      'excellent': 1.5,
      'good': 1.2,
      'fair': 1.0,
      'poor': 0.8
    };
    coinsEarned = Math.floor(coinsEarned * (qualityMultipliers[qualityGrade] || 1.0));
    
    // Update or create user coins record
    const [userCoins] = await db.query(`
      INSERT INTO user_coins (userId, totalCoins, lifetimeCoins, lastEarned, createdAt, updatedAt)
      VALUES (?, ?, ?, NOW(), NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
        totalCoins = totalCoins + ?,
        lifetimeCoins = lifetimeCoins + ?,
        lastEarned = NOW(),
        updatedAt = NOW()
    `, [req.user.id, coinsEarned, coinsEarned, coinsEarned, coinsEarned]);
    
    // Log coin transaction
    await db.query(`
      INSERT INTO coin_transactions (userId, amount, type, description, wasteEntryId, createdAt)
      VALUES (?, ?, 'earned', ?, ?, NOW())
    `, [req.user.id, coinsEarned, `Earned ${coinsEarned} coins for logging ${estimatedWeight}kg of ${wasteType}`, createdEntry.id]);
    
    // Get updated coin balance
    const [coinBalance] = await db.query(`
      SELECT totalCoins, lifetimeCoins FROM user_coins WHERE userId = ?
    `, [req.user.id]);
    
    // Notify user about coins earned
    await Notification.create({
      userId: req.user.id,
      type: 'reward',
      title: '🪙 Coins Earned!',
      message: `You earned ${coinsEarned} coins for logging waste! Total balance: ${coinBalance[0]?.totalCoins || coinsEarned} coins`,
      read: false
    });

      // Calculate updated stats after creating entry
      const { fn: seqFn, col: seqCol } = require('sequelize');
      const totalWasteResult = await WasteEntry.findAll({
        attributes: [[seqFn('SUM', seqCol('estimatedWeight')), 'total']]
      });
      const totalWaste = parseFloat(totalWasteResult[0]?.getDataValue('total') || 0);
      const totalEntries = await WasteEntry.count();

      res.status(201).json({
        success: true,
        message: 'Waste entry created successfully',
        wasteEntry: createdEntry,
        reward: {
          coinsEarned,
          totalCoins: coinBalance[0]?.totalCoins || coinsEarned,
          lifetimeCoins: coinBalance[0]?.lifetimeCoins || coinsEarned,
          message: `🎉 You earned ${coinsEarned} coins!`
        },
        stats: {
          totalWaste: totalWaste,
          totalEntries: totalEntries,
          biogasProduced: totalWaste * 0.3,
          carbonReduction: totalWaste * 2.3,
          treesEquivalent: Math.floor((totalWaste * 2.3) / 22)
        }
      });
  } catch (error) {
    console.error('Error creating waste entry:', error.message);
    res.status(500).json({ success: false, message: 'Error creating waste entry' });
  }
});

// PUT /api/waste-logging/:id - Update waste entry
router.put('/:id', auth, async (req, res) => {
  try {
  const wasteEntry = await WasteEntry.findByPk(req.params.id);
    
    if (!wasteEntry) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && !wasteEntry.supplier.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Don't allow updates to processed entries
    if (wasteEntry.status === 'processed') {
      return res.status(400).json({ message: 'Cannot update processed waste entries' });
    }
    
    const updateData = req.body;
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'supplier' && key !== 'createdAt') {
        wasteEntry[key] = updateData[key];
      }
    });
    
    await wasteEntry.save();
    await wasteEntry.populate('supplier', 'firstName lastName supplierType organization');
    await wasteEntry.populate('producer', 'firstName lastName organization');
    
    res.json({
      message: 'Waste entry updated successfully',
      wasteEntry
    });
  } catch (error) {
    console.error('Error updating waste entry:', error);
    res.status(500).json({ message: 'Error updating waste entry' });
  }
});

// POST /api/waste-logging/:id/verify - Verify waste entry
router.post('/:id/verify', auth, async (req, res) => {
  try {
    const { verified, rejectionReason } = req.body;
    const wasteEntry = await WasteEntry.findByPk(req.params.id);
    
    if (!wasteEntry) {
      return res.status(404).json({ success: false, message: 'Waste entry not found' });
    }
    
    // Only producers and admins can verify
    if (req.user.role !== 'admin' && req.user.role !== 'producer') {
      return res.status(403).json({ success: false, message: 'Only producers can approve/reject waste entries' });
    }
    
    const Notification = require('../models/Notification');
    
    if (verified) {
      wasteEntry.status = 'confirmed';
      wasteEntry.verifiedById = req.user.id;
      wasteEntry.verifiedAt = new Date();
      await wasteEntry.save();
      
      // Notify supplier
      await Notification.create({
        userId: wasteEntry.supplierId,
        type: 'waste_entry',
        title: 'Waste Entry Confirmed',
        message: `Your waste entry (${wasteEntry.wasteType}, ${wasteEntry.quantity} ${wasteEntry.unit}) has been confirmed by the producer.`,
        isRead: false
      });
    } else {
      wasteEntry.status = 'rejected';
      wasteEntry.rejectionReason = rejectionReason || 'No reason provided';
      await wasteEntry.save();
      
      // Notify supplier
      await Notification.create({
        userId: wasteEntry.supplierId,
        type: 'waste_entry',
        title: 'Waste Entry Rejected',
        message: `Your waste entry was rejected. Reason: ${rejectionReason || 'No reason provided'}`,
        isRead: false
      });
    }

    res.json({
      success: true,
      message: verified ? 'Waste entry confirmed' : 'Waste entry rejected',
      wasteEntry
    });
  } catch (error) {
    console.error('Error verifying waste entry:', error);
    res.status(500).json({ success: false, message: 'Error verifying waste entry' });
  }
});

// POST /api/waste-logging/:id/process - Mark as processed with biogas yield
router.post('/:id/process', auth, async (req, res) => {
  try {
    const { actualBiogasYield, processedDate, notes } = req.body;
    
  const wasteEntry = await WasteEntry.findByPk(req.params.id);
    
    if (!wasteEntry) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }
    
    // Only producers can mark as processed
    if (req.user.role !== 'producer' || !wasteEntry.producer.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    wasteEntry.status = 'processed';
    wasteEntry.processedDate = processedDate || new Date();
    wasteEntry.biogasYield.actual = actualBiogasYield;
    if (notes) wasteEntry.notes = notes;
    
    await wasteEntry.save();
    
    res.json({
      message: 'Waste entry marked as processed',
      wasteEntry
    });
  } catch (error) {
    console.error('Error processing waste entry:', error);
    res.status(500).json({ message: 'Error processing waste entry' });
  }
});

// DELETE /api/waste-logging/:id - Delete waste entry
router.delete('/:id', auth, async (req, res) => {
  try {
  const wasteEntry = await WasteEntry.findByPk(req.params.id);
    
    if (!wasteEntry) {
      return res.status(404).json({ message: 'Waste entry not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && !wasteEntry.supplier.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Don't allow deletion of processed entries
    if (wasteEntry.status === 'processed') {
      return res.status(400).json({ message: 'Cannot delete processed waste entries' });
    }
    
  await WasteEntry.destroy({ where: { id: req.params.id } });
    
    res.json({ message: 'Waste entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting waste entry:', error);
    res.status(500).json({ message: 'Error deleting waste entry' });
  }
});

// @route   GET /api/waste-logging/:id/biogas-potential
// @desc    Calculate biogas potential for waste entry
// @access  Private
router.get('/:id/biogas-potential', auth, async (req, res) => {
  try {
  const wasteEntry = await WasteEntry.findByPk(req.params.id);

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
    
    const wasteEntries = await WasteEntry.findAll({
      where: query,
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'organization'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: skip
    });
    const totalCount = await WasteEntry.count({ where: query });
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

  const wasteEntry = await WasteEntry.findByPk(req.params.id);

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

  const updatedEntry = await WasteEntry.update(
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