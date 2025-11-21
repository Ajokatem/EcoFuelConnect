const express = require('express');
const router = express.Router();
const BiogasProduction = require('../models/BiogasProduction');
const WasteEntry = require('../models/WasteEntry');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// GET /api/biogas-production - Get biogas production records
router.get('/', auth, async (req, res) => {
  try {
    const {
      producer,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 20
    } = req.query;
    
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'producer') {
      query.producer = req.user._id;
    } else if (producer) {
      query.producer = producer;
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.productionDate = {};
      if (startDate) query.productionDate.$gte = new Date(startDate);
      if (endDate) query.productionDate.$lte = new Date(endDate);
    }
    
    if (status) query.status = status;
    
    const productions = await BiogasProduction.find(query)
      .populate('producer', 'firstName lastName organization plantCapacity')
      .populate('feedstock.wasteEntries', 'wasteType quantity supplier')
      .populate('schools.school', 'name contact location')
      .sort({ productionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await BiogasProduction.countDocuments(query);
    
    res.json({
      productions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching biogas production records:', error);
    res.status(500).json({ message: 'Error fetching biogas production records' });
  }
});

// GET /api/biogas-production/statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let matchQuery = {};
    if (req.user.role === 'producer') {
      matchQuery.producer = req.user._id;
    }
    
    if (startDate || endDate) {
      matchQuery.productionDate = {};
      if (startDate) matchQuery.productionDate.$gte = new Date(startDate);
      if (endDate) matchQuery.productionDate.$lte = new Date(endDate);
    }
    
    // Get monthly trends
    const monthlyTrends = await BiogasProduction.getMonthlyTrends(
      req.user.role === 'producer' ? req.user._id : null
    );
    
    // Get efficiency metrics
    const efficiencyStats = await BiogasProduction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          avgEfficiency: { $avg: '$efficiency.overallScore' },
          avgBiogasYield: { $avg: '$totalBiogasProduced' },
          avgMethanePct: { $avg: '$qualityMetrics.methaneContent' },
          totalProduction: { $sum: '$totalBiogasProduced' },
          totalFeedstock: { $sum: '$feedstock.totalWeight' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get production by feedstock type
    const feedstockAnalysis = await BiogasProduction.aggregate([
      { $match: matchQuery },
      { $unwind: '$feedstock.breakdown' },
      {
        $group: {
          _id: '$feedstock.breakdown.type',
          totalWeight: { $sum: '$feedstock.breakdown.weight' },
          totalBiogas: { $sum: { $multiply: ['$feedstock.breakdown.weight', '$feedstock.breakdown.yieldPerKg'] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);
    
    // Get quality trends
    const qualityTrends = await BiogasProduction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            month: { $month: '$productionDate' },
            year: { $year: '$productionDate' }
          },
          avgMethane: { $avg: '$qualityMetrics.methaneContent' },
          avgCO2: { $avg: '$qualityMetrics.carbonDioxideContent' },
          avgH2S: { $avg: '$qualityMetrics.hydrogenSulfideContent' },
          avgTemp: { $avg: '$qualityMetrics.temperature' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      monthlyTrends,
      efficiency: efficiencyStats[0] || {},
      feedstockAnalysis,
      qualityTrends
    });
  } catch (error) {
    console.error('Error fetching biogas production statistics:', error);
    res.status(500).json({ message: 'Error fetching biogas production statistics' });
  }
});

// GET /api/biogas-production/:id - Get single production record
router.get('/:id', auth, async (req, res) => {
  try {
    const production = await BiogasProduction.findById(req.params.id)
      .populate('producer', 'firstName lastName organization plantCapacity contact')
      .populate('feedstock.wasteEntries', 'wasteType quantity supplier qualityGrade collectionTimestamp')
      .populate('schools.school', 'name contact location')
      .populate('distributionLog.recipient', 'name contact');
    
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && !production.producer.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ production });
  } catch (error) {
    console.error('Error fetching production record:', error);
    res.status(500).json({ message: 'Error fetching production record' });
  }
});

// POST /api/biogas-production - Create new production record
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'producer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only producers can create production records' });
    }
    
    const {
      productionDate,
      feedstock,
      totalBiogasProduced,
      qualityMetrics,
      temperatureConditions,
      maintenanceChecks,
      weatherConditions,
      notes
    } = req.body;
    
    // Validate feedstock waste entries exist
    if (feedstock.wasteEntries && feedstock.wasteEntries.length > 0) {
      const wasteEntries = await WasteEntry.find({
        _id: { $in: feedstock.wasteEntries },
        producer: req.user._id,
        status: 'delivered'
      });
      
      if (wasteEntries.length !== feedstock.wasteEntries.length) {
        return res.status(400).json({ message: 'Some waste entries are invalid or not available' });
      }
    }
    
    const production = new BiogasProduction({
      producer: req.user._id,
      productionDate: productionDate || new Date(),
      feedstock: {
        ...feedstock,
        totalWeight: feedstock.breakdown.reduce((sum, item) => sum + item.weight, 0)
      },
      totalBiogasProduced,
      qualityMetrics,
      temperatureConditions,
      maintenanceChecks,
      weatherConditions,
      notes,
      status: 'recorded'
    });
    
    await production.save();
    await production.populate('producer', 'firstName lastName organization');
    
    res.status(201).json({
      message: 'Production record created successfully',
      production
    });
  } catch (error) {
    console.error('Error creating production record:', error);
    res.status(500).json({ message: 'Error creating production record' });
  }
});

// PUT /api/biogas-production/:id - Update production record
router.put('/:id', auth, async (req, res) => {
  try {
    const production = await BiogasProduction.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && !production.producer.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Don't allow updates to distributed production
    if (production.status === 'distributed') {
      return res.status(400).json({ message: 'Cannot update distributed production records' });
    }
    
    const updateData = req.body;
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'producer' && key !== 'createdAt') {
        production[key] = updateData[key];
      }
    });
    
    await production.save();
    
    res.json({
      message: 'Production record updated successfully',
      production
    });
  } catch (error) {
    console.error('Error updating production record:', error);
    res.status(500).json({ message: 'Error updating production record' });
  }
});

// POST /api/biogas-production/:id/distribute - Distribute biogas to schools
router.post('/:id/distribute', auth, async (req, res) => {
  try {
    const { schools, distributionDate } = req.body;
    
    const production = await BiogasProduction.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'producer' || !production.producer.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Validate total allocation doesn't exceed available biogas
    const totalAllocated = schools.reduce((sum, school) => sum + school.allocatedAmount, 0);
    if (totalAllocated > production.totalBiogasProduced) {
      return res.status(400).json({ message: 'Total allocation exceeds available biogas' });
    }
    
    // Validate schools exist
    const schoolUsers = await User.find({
      _id: { $in: schools.map(s => s.school) },
      role: 'school',
      isActive: true
    });
    
    if (schoolUsers.length !== schools.length) {
      return res.status(400).json({ message: 'Some schools are invalid or inactive' });
    }
    
    production.schools = schools.map(school => ({
      school: school.school,
      allocatedAmount: school.allocatedAmount,
      deliveryStatus: 'pending',
      assignedAt: new Date()
    }));
    
    production.status = 'allocated';
    production.distributionDate = distributionDate || new Date();
    
    // Create distribution log entries
    production.distributionLog = schools.map(school => ({
      recipient: school.school,
      amount: school.allocatedAmount,
      timestamp: new Date(),
      status: 'allocated'
    }));
    
    await production.save();
    await production.populate('schools.school', 'name contact');
    
    res.json({
      message: 'Biogas allocated to schools successfully',
      production
    });
  } catch (error) {
    console.error('Error distributing biogas:', error);
    res.status(500).json({ message: 'Error distributing biogas' });
  }
});

// POST /api/biogas-production/:id/delivery-confirmation - Confirm delivery to school
router.post('/:id/delivery-confirmation', auth, async (req, res) => {
  try {
    const { schoolId, confirmationDetails } = req.body;
    
    const production = await BiogasProduction.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    // Find the school allocation
    const schoolAllocation = production.schools.find(s => s.school.equals(schoolId));
    if (!schoolAllocation) {
      return res.status(404).json({ message: 'School allocation not found' });
    }
    
    // Update delivery status
    schoolAllocation.deliveryStatus = 'delivered';
    schoolAllocation.deliveredAt = new Date();
    schoolAllocation.deliveryConfirmation = confirmationDetails;
    
    // Update distribution log
    const logEntry = production.distributionLog.find(log => log.recipient.equals(schoolId));
    if (logEntry) {
      logEntry.status = 'delivered';
      logEntry.deliveredAt = new Date();
    }
    
    // Check if all deliveries are complete
    const allDelivered = production.schools.every(s => s.deliveryStatus === 'delivered');
    if (allDelivered) {
      production.status = 'distributed';
    }
    
    await production.save();
    
    res.json({
      message: 'Delivery confirmed successfully',
      production
    });
  } catch (error) {
    console.error('Error confirming delivery:', error);
    res.status(500).json({ message: 'Error confirming delivery' });
  }
});

// GET /api/biogas-production/alerts/maintenance
router.get('/alerts/maintenance', auth, async (req, res) => {
  try {
    if (req.user.role !== 'producer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    let query = {};
    if (req.user.role === 'producer') {
      query.producer = req.user._id;
    }
    
    // Find productions with maintenance alerts
    const alertProductions = await BiogasProduction.find({
      ...query,
      $or: [
        { 'alerts.maintenanceRequired': true },
        { 'alerts.lowEfficiency': true },
        { 'alerts.qualityIssues': true }
      ]
    })
    .populate('producer', 'firstName lastName organization')
    .sort({ productionDate: -1 })
    .limit(50);
    
    res.json({
      message: 'Maintenance alerts retrieved successfully',
      alerts: alertProductions.map(prod => ({
        productionId: prod._id,
        producer: prod.producer,
        productionDate: prod.productionDate,
        alerts: prod.alerts,
        efficiency: prod.efficiency,
        qualityMetrics: prod.qualityMetrics
      }))
    });
  } catch (error) {
    console.error('Error fetching maintenance alerts:', error);
    res.status(500).json({ message: 'Error fetching maintenance alerts' });
  }
});

// DELETE /api/biogas-production/:id - Delete production record
router.delete('/:id', auth, async (req, res) => {
  try {
    const production = await BiogasProduction.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && !production.producer.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Don't allow deletion of distributed production
    if (production.status === 'distributed') {
      return res.status(400).json({ message: 'Cannot delete distributed production records' });
    }
    
    await BiogasProduction.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Production record deleted successfully' });
  } catch (error) {
    console.error('Error deleting production record:', error);
    res.status(500).json({ message: 'Error deleting production record' });
  }
});

module.exports = router;
