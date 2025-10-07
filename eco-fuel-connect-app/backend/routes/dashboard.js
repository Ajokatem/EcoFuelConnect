const express = require('express');
const Analytics = require('../models/Analytics');
const WasteEntry = require('../models/WasteEntry');
const FuelRequest = require('../models/FuelRequest');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { timeframe = 'month' } = req.query;
    const userId = req.user.id;

    // Get current period analytics
    const summary = await Analytics.getDashboardSummary(timeframe);

    // Get user-specific statistics
    const [wasteStats, fuelStats] = await Promise.all([
      WasteEntry.getStats(userId, timeframe),
      FuelRequest.getStats(userId)
    ]);

    const waste = wasteStats[0] || {};
    const fuel = fuelStats[0] || {};

    // Calculate derived metrics
    const stats = {
      // Waste metrics
      totalWaste: summary.totalWaste || 0,
      dailyWaste: summary.avgDailyWaste || 0,
      userWasteContribution: waste.totalWeight || 0,
      
      // Biogas production
      biogasProduced: summary.totalBiogas || 0,
      biogasEfficiency: summary.avgBiogasEfficiency || 0,
      
      // Fuel requests
      fuelRequests: fuel.totalRequests || 0,
      fuelDelivered: fuel.delivered || 0,
      fuelRequestValue: fuel.totalValue || 0,
      
      // Environmental impact
      carbonReduction: summary.totalCarbonReduced || 0,
      energyGenerated: summary.totalEnergyGenerated || 0,
      forestSaved: Math.round((summary.totalCarbonReduced || 0) / 1000 * 100) / 100,
      treesEquivalent: Math.floor((summary.totalCarbonReduced || 0) / 22),
      
      // Community engagement
      communityEngagement: (waste.totalEntries || 0) + (fuel.totalRequests || 0),
      activeUsers: summary.avgActiveUsers || 0,
      wasteSuppliers: summary.totalSuppliers || 0,
      schoolsServed: summary.totalSchools || 0,
      
      // Educational and other metrics
      educationalMessages: Math.floor((summary.avgActiveUsers || 0) * 0.3),
      monthlyTarget: 1500, // Can be made configurable
      
      // Progress indicators
      wasteProgress: Math.min(100, ((summary.totalWaste || 0) / 1500) * 100),
      biogasProgress: Math.min(100, ((summary.totalBiogas || 0) / 600) * 100),
      carbonProgress: Math.min(100, ((summary.totalCarbonReduced || 0) / 750) * 100),
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
    
    const trendData = await Analytics.getTrendData('totalWasteCollected', parseInt(months));
    
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
    
    const trendData = await Analytics.getTrendData('biogasProduced.total', parseInt(months));
    
    const chartData = trendData.map(item => ({
      month: item.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      biogas: item.metrics?.biogasProduced?.total || 0,
      efficiency: item.metrics?.biogasProduced?.efficiency || 0,
      date: item.date
    }));

    res.json({
      message: 'Biogas production trends retrieved successfully',
      chartData,
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
    
    const trendData = await Analytics.getTrendData('fuelRequests', parseInt(months));
    
    const chartData = trendData.map(item => ({
      month: item.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total: item.metrics?.fuelRequests?.total || 0,
      delivered: item.metrics?.fuelRequests?.delivered || 0,
      pending: item.metrics?.fuelRequests?.pending || 0,
      value: item.metrics?.fuelRequests?.totalValue || 0,
      date: item.date
    }));

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

    const analytics = await Analytics.generateMonthlyAnalytics(reportDate);

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
    const latestAnalytics = await Analytics.findOne({ isActive: true })
      .sort({ date: -1 });

    const kpis = latestAnalytics?.kpis || {
      wasteCollectionEfficiency: 0,
      biogasConversionRate: 0,
      customerSatisfaction: 0,
      supplierRetention: 0,
      deliverySuccess: 0
    };

    res.json({
      message: 'KPIs retrieved successfully',
      kpis,
      lastUpdated: latestAnalytics?.updatedAt || new Date()
    });

  } catch (error) {
    console.error('KPIs error:', error);
    res.status(500).json({
      message: 'Error retrieving KPIs'
    });
  }
});

module.exports = router;