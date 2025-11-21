const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, adminOnly, managerOrAdmin } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects with filtering and pagination
// @access  Private (all authenticated users can view public projects, admins can view all)
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      region,
      state,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};

    // Non-admin users can only see public projects or projects they're involved in
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      filter.$or = [
        { isPublic: true },
        { createdBy: req.user._id },
        { 'stakeholders.projectManager': req.user._id },
        { 'stakeholders.teamMembers.user': req.user._id },
        { 'stakeholders.beneficiaries.schools': req.user._id }
      ];
    }

    // Add filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (region) filter['location.region'] = new RegExp(region, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');

    // Search functionality
    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { 'location.region': new RegExp(search, 'i') },
          { 'location.state': new RegExp(search, 'i') }
        ]
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const projects = await Project.find(filter)
      .populate('stakeholders.projectManager', 'firstName lastName email organizationName')
      .populate('stakeholders.teamMembers.user', 'firstName lastName email')
      .populate('stakeholders.beneficiaries.schools', 'organizationName location')
      .populate('createdBy', 'firstName lastName email')
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalProjects = await Project.countDocuments(filter);

    // Add calculated fields
    const enhancedProjects = projects.map(project => ({
      ...project,
      progress: project.objectives?.length > 0 
        ? Math.round((project.objectives.filter(obj => obj.isCompleted).length / project.objectives.length) * 100)
        : 0,
      budgetUtilization: project.budget?.allocated > 0 
        ? Math.round((project.budget.spent / project.budget.allocated) * 100)
        : 0,
      daysRemaining: project.timeline?.endDate 
        ? Math.max(0, Math.ceil((new Date(project.timeline.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
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
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('stakeholders.projectManager', 'firstName lastName email organizationName phone')
      .populate('stakeholders.teamMembers.user', 'firstName lastName email organizationName')
      .populate('stakeholders.beneficiaries.schools', 'organizationName location address phone')
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email')
      .populate('updates.author', 'firstName lastName email')
      .populate('milestones.completedBy', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check access permissions
    const hasAccess = req.user.role === 'admin' || 
                     req.user.role === 'manager' ||
                     project.isPublic ||
                     project.createdBy._id.toString() === req.user._id ||
                     project.stakeholders.projectManager._id.toString() === req.user._id ||
                     project.stakeholders.teamMembers.some(member => 
                       member.user._id.toString() === req.user._id
                     ) ||
                     project.stakeholders.beneficiaries.schools.some(school => 
                       school._id.toString() === req.user._id
                     );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this project'
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project (Admin/Manager only)
// @access  Private (Admin/Manager)
router.post('/', auth, managerOrAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      budget,
      timeline,
      location,
      stakeholders,
      objectives,
      milestones,
      isPublic
    } = req.body;

    // Validation
    if (!title || !description || !category || !timeline?.startDate || !timeline?.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, category, startDate, endDate'
      });
    }

    // Validate dates
    if (new Date(timeline.startDate) >= new Date(timeline.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Validate project manager exists
    if (stakeholders?.projectManager) {
      const projectManager = await User.findById(stakeholders.projectManager);
      if (!projectManager) {
        return res.status(400).json({
          success: false,
          message: 'Project manager not found'
        });
      }
    }

    const project = new Project({
      title,
      description,
      category,
      priority: priority || 'medium',
      budget: budget || { allocated: 0, spent: 0, currency: 'USD' },
      timeline,
      location,
      stakeholders: {
        projectManager: stakeholders?.projectManager || req.user._id,
        teamMembers: stakeholders?.teamMembers || [],
        beneficiaries: stakeholders?.beneficiaries || { schools: [], communities: [], estimatedBeneficiaries: 0 }
      },
      objectives: objectives || [],
      milestones: milestones || [],
      isPublic: isPublic || false,
      createdBy: req.user._id,
      status: 'planning'
    });

    await project.save();

    // Populate the created project
    await project.populate([
      { path: 'stakeholders.projectManager', select: 'firstName lastName email organizationName' },
      { path: 'createdBy', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project (Admin/Manager/Project Manager only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const canEdit = req.user.role === 'admin' || 
                   req.user.role === 'manager' ||
                   project.createdBy.toString() === req.user._id ||
                   project.stakeholders.projectManager.toString() === req.user._id;

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'description', 'category', 'priority', 'budget', 'timeline',
      'location', 'stakeholders', 'objectives', 'milestones', 'resources',
      'impact', 'isPublic', 'status'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate timeline if being updated
    if (updates.timeline) {
      if (new Date(updates.timeline.startDate) >= new Date(updates.timeline.endDate)) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    updates.lastModifiedBy = req.user._id;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'stakeholders.projectManager', select: 'firstName lastName email organizationName' },
      { path: 'stakeholders.teamMembers.user', select: 'firstName lastName email' },
      { path: 'lastModifiedBy', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// @route   PATCH /api/projects/:id/status
// @desc    Update project status
// @access  Private (Admin/Manager/Project Manager)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    const canUpdate = req.user.role === 'admin' || 
                     req.user.role === 'manager' ||
                     project.createdBy.toString() === req.user._id ||
                     project.stakeholders.projectManager.toString() === req.user._id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project status'
      });
    }

    // Update status and add update entry
    project.status = status;
    project.lastModifiedBy = req.user._id;

    // Add status change to updates
    project.updates.push({
      title: `Project Status Changed to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      content: notes || `Project status has been updated to ${status}`,
      author: req.user._id,
      tags: ['status_change']
    });

    // Set actual dates based on status
    if (status === 'active' && !project.timeline.actualStartDate) {
      project.timeline.actualStartDate = new Date();
    } else if (status === 'completed' && !project.timeline.actualEndDate) {
      project.timeline.actualEndDate = new Date();
    }

    await project.save();

    await project.populate([
      { path: 'stakeholders.projectManager', select: 'firstName lastName email' },
      { path: 'lastModifiedBy', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: `Project status updated to ${status}`,
      project
    });

  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project status',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project (Admin only)
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// @route   POST /api/projects/:id/updates
// @desc    Add project update
// @access  Private (Project stakeholders)
router.post('/:id/updates', auth, async (req, res) => {
  try {
    const { title, content, isPublic = true, tags = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user can add updates
    const canUpdate = req.user.role === 'admin' || 
                     req.user.role === 'manager' ||
                     project.createdBy.toString() === req.user._id ||
                     project.stakeholders.projectManager.toString() === req.user._id ||
                     project.stakeholders.teamMembers.some(member => 
                       member.user.toString() === req.user._id
                     );

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add updates to this project'
      });
    }

    project.updates.push({
      title,
      content,
      author: req.user._id,
      isPublic,
      tags
    });

    await project.save();

    await project.populate('updates.author', 'firstName lastName email');

    const latestUpdate = project.updates[project.updates.length - 1];

    res.status(201).json({
      success: true,
      message: 'Project update added successfully',
      update: latestUpdate
    });

  } catch (error) {
    console.error('Error adding project update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project update',
      error: error.message
    });
  }
});

// @route   GET /api/projects/stats/overview
// @desc    Get project statistics overview (Admin/Manager only)
// @access  Private (Admin/Manager)
router.get('/stats/overview', auth, managerOrAdmin, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    
    // Projects by status
    const statusStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Projects by category
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Budget statistics
    const budgetStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalAllocated: { $sum: '$budget.allocated' },
          totalSpent: { $sum: '$budget.spent' }
        }
      }
    ]);

    // Impact statistics
    const impactStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalWasteProcessed: { $sum: '$impact.environmental.wasteProcessed' },
          totalBiogasProduced: { $sum: '$impact.environmental.biogasProduced' },
          totalCO2Reduced: { $sum: '$impact.environmental.co2Reduced' },
          totalSchoolsServed: { $sum: '$impact.social.schoolsServed' },
          totalStudentsImpacted: { $sum: '$impact.social.studentsImpacted' }
        }
      }
    ]);

    res.json({
      success: true,
      statistics: {
        totalProjects,
        statusBreakdown: statusStats,
        categoryBreakdown: categoryStats,
        budgetOverview: budgetStats[0] || { totalAllocated: 0, totalSpent: 0 },
        impactSummary: impactStats[0] || {
          totalWasteProcessed: 0,
          totalBiogasProduced: 0,
          totalCO2Reduced: 0,
          totalSchoolsServed: 0,
          totalStudentsImpacted: 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching project statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics',
      error: error.message
    });
  }
});

module.exports = router;
