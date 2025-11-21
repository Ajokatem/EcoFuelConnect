const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const WasteEntry = require('../models/WasteEntry');
const BiogasProduction = require('../models/BiogasProduction');
const FuelRequest = require('../models/FuelRequest');
const { auth, adminOnly, managerOrAdmin } = require('../middleware/auth');

// @route   GET /admin/dashboard
// @desc    Get admin dashboard overview
// @access  Private (Admin/Manager only)
router.get('/dashboard', auth, managerOrAdmin, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['role']
    });

    // Project statistics - temporarily disabled
    // const totalProjects = await Project.count();
    // const activeProjects = await Project.count({ where: { status: 'active' } });
    // const projectsByStatus = await Project.findAll({
    //   attributes: [
    //     'status',
    //     [Project.sequelize.fn('COUNT', '*'), 'count']
    //   ],
    //   group: ['status']
    // });

    // System statistics
    const totalWasteProcessed = await WasteEntry.findOne({
      attributes: [[WasteEntry.sequelize.fn('SUM', WasteEntry.sequelize.col('estimatedWeight')), 'total']]
    });

    const totalBiogasProduced = await BiogasProduction.findOne({
      attributes: [[BiogasProduction.sequelize.fn('SUM', BiogasProduction.sequelize.col('biogasProduced')), 'total']]
    });

    const totalFuelRequests = await FuelRequest.count();
    const completedDeliveries = await FuelRequest.count({ where: { status: 'delivered' } });

    // Recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.count({
      where: {
        createdAt: { [User.sequelize.Sequelize.Op.gte]: thirtyDaysAgo }
      }
    });

    // const recentProjects = await Project.count({
    //   where: {
    //     createdAt: { [Project.sequelize.Sequelize.Op.gte]: thirtyDaysAgo }
    //   }
    // });

    const recentWasteEntries = await WasteEntry.count({
      where: {
        createdAt: { [WasteEntry.sequelize.Sequelize.Op.gte]: thirtyDaysAgo }
      }
    });

    res.json({
      success: true,
      dashboard: {
        users: {
          total: totalUsers,
          active: activeUsers,
          recent: recentUsers,
          byRole: usersByRole.map(item => ({ _id: item.role, count: item.dataValues.count }))
        },
        // projects: {
        //   total: totalProjects,
        //   active: activeProjects,
        //   recent: recentProjects,
        //   byStatus: projectsByStatus
        // },
        system: {
          wasteProcessed: totalWasteProcessed?.dataValues?.total || 0,
          biogasProduced: totalBiogasProduced?.dataValues?.total || 0,
          fuelRequests: totalFuelRequests,
          completedDeliveries: completedDeliveries,
          recentWasteEntries: recentWasteEntries
        },
        environmentalImpact: {
          co2Saved: Math.round((totalBiogasProduced[0]?.total || 0) * 2.3),
          treesEquivalent: Math.floor(((totalBiogasProduced[0]?.total || 0) * 2.3) / 22)
        }
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load admin dashboard',
      error: error.message
    });
  }
});

// @route   GET /admin/users
// @desc    Get all users for admin management
// @access  Private (Admin only)
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { organizationName: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.count({ where: filter });

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNextPage: skip + users.length < totalUsers,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// @route   PATCH /admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.patch('/users/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Admin user status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
});

// @route   GET /admin/projects
// @desc    Get all projects for admin (alias to main projects route)
// @access  Private (Admin/Manager)
router.get('/projects', auth, managerOrAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.region': new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(filter)
      .populate('stakeholders.projectManager', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // const totalProjects = await Project.count({ where: filter });

    const enhancedProjects = projects.map(project => ({
      ...project.toObject(),
      progress: project.objectives?.length > 0 
        ? Math.round((project.objectives.filter(obj => obj.isCompleted).length / project.objectives.length) * 100)
        : 0,
      budgetUtilization: project.budget?.allocated > 0 
        ? Math.round((project.budget.spent / project.budget.allocated) * 100)
        : 0
    }));

    res.json({
      success: true,
      projects: enhancedProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProjects / parseInt(limit)),
        totalProjects,
        hasNextPage: skip + projects.length < totalProjects,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Admin projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// @route   GET /admin/system-status
// @desc    Get system health and status
// @access  Private (Admin only)
router.get('/system-status', auth, adminOnly, async (req, res) => {
  try {
    const systemHealth = {
      database: 'connected',
      server: 'running',
      lastCheck: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };

    // Check recent errors or issues
    const recentErrors = []; // This could be connected to a logging system

    res.json({
      success: true,
      status: 'healthy',
      systemHealth,
      recentErrors
    });

  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system status',
      error: error.message
    });
  }
});

module.exports = router;
