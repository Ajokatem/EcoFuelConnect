const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
// @route   GET /api/dashboard/charts/iot-trends
// @desc    Get IoT sensor trends and aggregated readings for charts
// @access  Private
router.get('/charts/iot-trends', auth, async (req, res) => {
  try {
    const { deviceId, period = 'daily', aggregationType = 'average', limit = 30 } = req.query;
    const IoTSensorReading = require('../models/IoTSensorReading');
    if (!deviceId) return res.status(400).json({ message: 'deviceId required' });
    // Sequelize: Get latest readings for deviceId
    const readingsRaw = await IoTSensorReading.findAll({
      where: { deviceId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    // Flatten and format readings for chart
    const chartData = readingsRaw.flatMap(readingDoc =>
      (readingDoc.readings || []).map(r => ({
        date: r.timestamp,
        value: r.value,
        unit: r.unit,
        quality: r.quality,
        flags: r.flags || []
      }))
    ).slice(-limit);
    res.json({ message: 'IoT sensor trends retrieved', chartData, period, aggregationType });
  } catch (error) {
    console.error('IoT trends error:', error);
    res.status(500).json({ message: 'Error retrieving IoT sensor trends' });
  }
});


const Analytics = require('../models/Analytics');
const WasteEntry = require('../models/WasteEntry');
const FuelRequest = require('../models/FuelRequest');
const User = require('../models/User');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    const userId = req.user.id;
    const { fn, col, Op } = require('sequelize');

    // Get basic statistics using Sequelize
    const totalUsers = await User.count({ where: { isActive: true } });
    const totalSchools = await User.count({ where: { role: 'school', isActive: true } });
    
    // Get user's waste entries (as producer)
    const userWasteResult = await WasteEntry.findAll({
      where: { producerId: userId },
      attributes: [[fn('SUM', col('estimatedWeight')), 'total']]
    });
    const userWasteTotal = userWasteResult[0]?.getDataValue('total') || 0;

    // Get user's fuel requests
    const userFuelResult = await FuelRequest.findAll({
      where: { schoolId: userId },
      attributes: [
        [fn('COUNT', '*'), 'total'],
        [fn('SUM', col('quantityRequested')), 'totalQuantity']
      ]
    });
    const fuelStats = userFuelResult[0] || {};

    // IoT sensor metrics
    const IoTSensor = require('../models/IoTSensor');
    const IoTSensorReading = require('../models/IoTSensorReading');
    // Refactored to Sequelize
    const sensorCount = await IoTSensor.count();
    const activeSensors = await IoTSensor.count({ where: { status: 'active' } });
    // Group by status for sensor health
    const sensorHealthRaw = await IoTSensor.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']],
      group: ['status']
    });
    const sensorHealth = sensorHealthRaw.map(row => ({ status: row.status, count: row.get('count') }));
    // Get latest readings for each deviceId
    const latestReadingsRaw = await IoTSensorReading.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    const latestReadings = latestReadingsRaw.map(reading => ({
      deviceId: reading.deviceId,
      latest: reading.readings?.length ? reading.readings[reading.readings.length - 1] : null
    }));

    // Automated IoT monitoring alerts
    const { monitorIoTSensors } = require('../services/iotMonitor');
    const iotMonitoring = await monitorIoTSensors();

    // Provide stats including IoT metrics and monitoring alerts
    const stats = {
      // Waste metrics
      totalWaste: parseFloat(userWasteTotal) || 0,
      dailyWaste: parseFloat(userWasteTotal) / 30 || 0,
      userWasteContribution: parseFloat(userWasteTotal) || 0,
      // Biogas production (mock data for now)
      biogasProduced: parseFloat(userWasteTotal) * 0.3 || 0, // Rough estimate
      biogasEfficiency: 75, // Mock data
      // Fuel requests
      fuelRequests: fuelStats.getDataValue ? fuelStats.getDataValue('total') || 0 : 0,
      fuelDelivered: fuelStats.getDataValue ? fuelStats.getDataValue('totalQuantity') || 0 : 0,
      fuelRequestValue: 0, // Mock data
      // Environmental impact (mock calculations)
      carbonReduction: parseFloat(userWasteTotal) * 2.3 || 0,
      energyGenerated: parseFloat(userWasteTotal) * 1.5 || 0,
      forestSaved: Math.round((parseFloat(userWasteTotal) * 2.3 / 1000) * 100) / 100,
      treesEquivalent: Math.floor((parseFloat(userWasteTotal) * 2.3) / 22),
      // Community engagement
      communityEngagement: totalUsers,
      activeUsers: totalUsers,
      wasteSuppliers: await User.count({ where: { role: 'producer', isActive: true } }),
      schoolsServed: totalSchools,
      // Educational and other metrics
      educationalMessages: Math.floor(totalUsers * 0.3),
      monthlyTarget: 1500, // Can be made configurable
      // Progress indicators
      wasteProgress: Math.min(100, (parseFloat(userWasteTotal) / 1500) * 100),
      biogasProgress: Math.min(100, ((parseFloat(userWasteTotal) * 0.3) / 600) * 100),
      carbonProgress: Math.min(100, ((parseFloat(userWasteTotal) * 2.3) / 750) * 100),
      // IoT metrics
      iotSensorCount: sensorCount,
      iotActiveSensors: activeSensors,
      iotSensorHealth: sensorHealth,
      iotLatestReadings: latestReadings,
      iotMonitoringAlerts: iotMonitoring.alerts,
      iotMonitoringCheckedAt: iotMonitoring.checkedAt
    };

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      stats,
      timeframe,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      message: 'Error retrieving dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/recent-activity
// @desc    Get recent activity feed
// @access  Private
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id;

    // Get recent waste entries
    const recentWaste = await WasteEntry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit / 2)
      .populate('user', 'firstName lastName')
      .select('entryId wasteDetails quantity createdAt processing.status');

    // Get recent fuel requests
    const recentFuel = await FuelRequest.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit / 2)
      .populate('user', 'firstName lastName')
      .select('requestId fuelType quantity status createdAt totalCost');

    // Combine and sort activities
    const activities = [
      ...recentWaste.map(entry => ({
        id: entry._id,
        type: 'waste_entry',
        title: `Waste Entry: ${entry.wasteDetails.type.replace('_', ' ')}`,
        description: `${entry.quantity.weight} ${entry.quantity.unit} of ${entry.wasteDetails.type.replace('_', ' ')} logged`,
        status: entry.processing.status,
        timestamp: entry.createdAt,
        entryId: entry.entryId
      })),
      ...recentFuel.map(request => ({
        id: request._id,
        type: 'fuel_request',
        title: `Fuel Request: ${request.fuelType}`,
        description: `${request.quantity} units requested - ${request.status}`,
        status: request.status,
        timestamp: request.createdAt,
        requestId: request.requestId,
        totalCost: request.totalCost
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, limit);

    res.json({
      message: 'Recent activity retrieved successfully',
      activities,
      count: activities.length
    });

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      message: 'Error retrieving recent activity'
    });
  }
});

// @route   GET /api/dashboard/charts/waste-trends
// @desc    Get waste trends for charts
// @access  Private
router.get('/charts/waste-trends', auth, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    // Temporarily providing mock data until Analytics is converted to Sequelize
    const trendData = Array.from({ length: months }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      value: Math.floor(Math.random() * 100) + 50
    })).reverse();
    
    const chartData = trendData.map(item => ({
      month: item.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      waste: item.metrics?.totalWasteCollected || 0,
      date: item.date
    }));

    res.json({
      message: 'Waste trends retrieved successfully',
      chartData,
      months: parseInt(months)
    });

  } catch (error) {
    console.error('Waste trends error:', error);
    res.status(500).json({
      message: 'Error retrieving waste trends'
    });
  }
});

// @route   GET /api/dashboard/charts/biogas-production
// @desc    Get biogas production trends
// @access  Private
router.get('/charts/biogas-production', auth, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    // Temporarily providing mock data until Analytics is converted to Sequelize
    const trendData = Array.from({ length: months }, (_, i) => {
      const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        biogas: Math.floor(Math.random() * 200) + 100,
        efficiency: Math.floor(Math.random() * 20) + 70,
        date: date
      };
    }).reverse();

    res.json({
      message: 'Biogas production trends retrieved successfully',
      chartData: trendData,
      months: parseInt(months)
    });

  } catch (error) {
    console.error('Biogas trends error:', error);
    res.status(500).json({
      message: 'Error retrieving biogas production trends'
    });
  }
});

// @route   GET /api/dashboard/charts/fuel-requests
// @desc    Get fuel request analytics
// @access  Private
router.get('/charts/fuel-requests', auth, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    // Temporarily providing mock data until Analytics is converted to Sequelize
    const chartData = Array.from({ length: months }, (_, i) => {
      const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
      const total = Math.floor(Math.random() * 50) + 20;
      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: total,
        delivered: Math.floor(total * 0.8),
        pending: Math.floor(total * 0.2),
        value: total * 150,
        date: date
      };
    }).reverse();

    res.json({
      message: 'Fuel request analytics retrieved successfully',
      chartData,
      months: parseInt(months)
    });

  } catch (error) {
    console.error('Fuel request analytics error:', error);
    res.status(500).json({
      message: 'Error retrieving fuel request analytics'
    });
  }
});

// @route   GET /api/dashboard/waste-distribution
// @desc    Get waste type distribution
// @access  Private
router.get('/waste-distribution', auth, async (req, res) => {
  try {
    const wasteDistribution = await WasteEntry.getWasteByType();
    
    const distributionData = wasteDistribution.map(item => ({
      type: item._id.replace('_', ' '),
      count: item.count,
      weight: item.totalWeight,
      percentage: 0 // Will be calculated on frontend
    }));

    // Calculate percentages
    const totalWeight = distributionData.reduce((sum, item) => sum + item.weight, 0);
    distributionData.forEach(item => {
      item.percentage = totalWeight > 0 ? Math.round((item.weight / totalWeight) * 100) : 0;
    });

    res.json({
      message: 'Waste distribution retrieved successfully',
      distributionData,
      totalWeight
    });

  } catch (error) {
    console.error('Waste distribution error:', error);
    res.status(500).json({
      message: 'Error retrieving waste distribution'
    });
  }
});

// @route   POST /api/dashboard/generate-report
// @desc    Generate monthly analytics report
// @access  Private (Admin/Manager)
router.post('/generate-report', auth, async (req, res) => {
  try {
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Admin or Manager privileges required.'
      });
    }

    const { month, year } = req.body;
    const reportDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);


    // IoT sensor metrics for report
    const IoTSensor = require('../models/IoTSensor');
    const IoTSensorReading = require('../models/IoTSensorReading');
    const sensorCount = await IoTSensor.count();
    const activeSensors = await IoTSensor.count({ where: { status: 'active' } });
    const sensorHealthRaw = await IoTSensor.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']],
      group: ['status']
    });
    const sensorHealth = sensorHealthRaw.map(row => ({ status: row.status, count: row.get('count') }));
    const latestReadingsRaw = await IoTSensorReading.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    const latestReadings = latestReadingsRaw.map(reading => ({
      deviceId: reading.deviceId,
      latest: reading.readings?.length ? reading.readings[reading.readings.length - 1] : null
    }));

    // Analytics data including IoT metrics
    const analytics = {
      date: reportDate,
      totalWaste: Math.floor(Math.random() * 1000) + 500,
      biogasProduced: Math.floor(Math.random() * 300) + 150,
      carbonReduced: Math.floor(Math.random() * 500) + 200,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      fuelRequests: Math.floor(Math.random() * 50) + 20,
      iotSensorCount: sensorCount,
      iotActiveSensors: activeSensors,
      iotSensorHealth: sensorHealth,
      iotLatestReadings: latestReadings
    };

    res.json({
      message: 'Monthly analytics report generated successfully',
      analytics,
      reportDate
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      message: 'Error generating analytics report'
    });
  }
});

// @route   GET /api/dashboard/kpis
// @desc    Get Key Performance Indicators
// @access  Private
router.get('/kpis', auth, async (req, res) => {
  try {
    // Temporarily providing mock KPI data
    const kpis = {
      wasteCollectionEfficiency: Math.floor(Math.random() * 20) + 75,
      biogasConversionRate: Math.floor(Math.random() * 15) + 80,
      customerSatisfaction: Math.floor(Math.random() * 20) + 75,
      supplierRetention: Math.floor(Math.random() * 15) + 80,
      deliverySuccess: Math.floor(Math.random() * 10) + 85
    };

    res.json({
      message: 'KPIs retrieved successfully',
      kpis,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('KPIs error:', error);
    res.status(500).json({
      message: 'Error retrieving KPIs'
    });
  }
});

module.exports = router;