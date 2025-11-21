
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const router = express.Router();

// @route   GET /api/auth/producers
// @desc    Get active producers (for waste logging dropdown)
// @access  Private
router.get('/producers', auth, async (req, res) => {
  try {
    const producers = await User.findAll({
      where: { role: 'producer', isActive: true },
      attributes: ['id', 'firstName', 'lastName', 'organization', 'role']
    });
    res.json({ success: true, producers });
  } catch (error) {
    console.error('Error fetching producers:', error);
    res.status(500).json({ success: false, message: 'Error fetching producers' });
  }
});

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

// Apply security middleware
router.use(helmet());
// (Already declared at the top)

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      organization,
      organizationName,
      role = 'school',
      address,
      vehicleDetails,
      capacity
    } = req.body;

    // Enhanced validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, password'
      });
    }
    // Password confirmation validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }
    // Enhanced password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }
    // Email format validation - using safer regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    // Role validation - allow producer as a valid role
    const validRoles = ['admin', 'supplier', 'producer', 'consumer', 'school'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: admin, supplier, producer, consumer, school'
      });
    }
    // Create user with role-specific fields
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      organization: organizationName || organization,
      role,
      isActive: true
    };
    const user = await User.create(userData);
    // Generate token
    const token = generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json({
      success: true,
      token,
      message: 'User registered successfully! Welcome to EcoFuelConnect!',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organization: user.organization,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      nextSteps: {
        completeProfile: true,
        verifyEmail: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});
// @route   POST /api/auth/logout
// @desc    Logout user by clearing cookie
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});
// ...existing code...
// (Already declared at the top)

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { 
    expiresIn: '7d' 
  });
}

// ...existing code...
// @route   POST /api/auth/login
// @desc    Login user with comprehensive response data
// @access  Public
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    let user;
    try {
      user = await User.findOne({ 
        where: { email: email.toLowerCase() }
      });
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please set up PostgreSQL on Render and add DATABASE_URL environment variable.'
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token with appropriate expiration
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { 
      expiresIn: tokenExpiry 
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
    });

    // Optionally, add user stats and dashboard info here
    const dashboardRoutes = {
      admin: '/admin/dashboard',
      supplier: '/supplier/dashboard',
      producer: '/producer/dashboard',
      school: '/school/dashboard',
      consumer: '/consumer/dashboard'
    };

    res.json({
      success: true,
      token,
      message: `Welcome back, ${user.firstName}!`,
      redirectTo: dashboardRoutes[user.role] || '/dashboard',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organization: user.organization,
        phone: user.phone,
        isActive: user.isActive,
        profilePhoto: user.profilePhoto || '',
        bio: user.bio || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a database connection error
    if (error.name === 'SequelizeHostNotFoundError' || error.name === 'SequelizeConnectionError') {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please contact administrator to set up database.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/welcome
// @desc    Get welcome page data with system statistics
// @access  Public
router.get('/welcome', async (req, res) => {
  try {
    const WasteEntry = require('../models/WasteEntry');
    const BiogasProduction = require('../models/BiogasProduction');
    const FuelRequest = require('../models/FuelRequest');
    const User = require('../models/User');
    const { Op, fn, col } = require('sequelize');

    // Get system-wide statistics using Sequelize
    const totalUsers = await User.count({ where: { isActive: true } });
    const totalSchools = await User.count({ where: { role: 'school', isActive: true } });
    const totalProducers = await User.count({ where: { role: 'producer', isActive: true } });
    const totalSuppliers = await User.count({ where: { role: 'supplier', isActive: true } });

    // Get waste and production statistics using Sequelize
    const totalWasteResult = await WasteEntry.findAll({
      attributes: [[fn('SUM', col('quantity')), 'total']]
    });
    const totalWasteProcessed = totalWasteResult[0]?.getDataValue('total') || 0;

    let totalBiogasProduced = 0;
    try {
      const totalBiogasResult = await BiogasProduction.findAll({
        attributes: [[fn('SUM', col('totalVolume')), 'total']]
      });
      totalBiogasProduced = totalBiogasResult[0]?.getDataValue('total') || 0;
    } catch (biogasError) {
      console.log('Welcome data error:', biogasError);
      totalBiogasProduced = 0; // Fallback value
    }

    const totalFuelResult = await FuelRequest.findAll({
      where: { status: 'completed' },
      attributes: [[fn('SUM', col('quantityDelivered')), 'total']]
    });
    const totalFuelDelivered = totalFuelResult[0]?.getDataValue('total') || 0;

    // Recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWasteEntries = await WasteEntry.count({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });


    const recentFuelRequests = await FuelRequest.count({
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      }
    });

    // Environmental impact calculation
    const co2Saved = totalBiogasProduced * 2.3; // Approximate CO2 saved in kg
    const treesEquivalent = Math.floor(co2Saved / 22); // Approximate trees equivalent

    res.json({
      success: true,
      welcome: {
        title: "Welcome to EcoFuelConnect",
        subtitle: "Transforming Organic Waste into Clean Energy for South Sudan Schools",
        description: "Join our mission to provide sustainable biogas solutions while reducing environmental impact through organic waste management."
      },
      systemStats: {
        totalUsers,
        totalSchools,
        totalProducers,
        totalSuppliers,
        totalWasteProcessed: parseFloat(totalWasteProcessed) || 0,
        totalBiogasProduced: parseFloat(totalBiogasProduced) || 0,
        totalFuelDelivered: parseFloat(totalFuelDelivered) || 0,
        co2Saved: Math.round(co2Saved),
        treesEquivalent
      },
      recentActivity: {
        wasteEntries: recentWasteEntries,
        newRegistrations: recentRegistrations,
        fuelRequests: recentFuelRequests
      },
      features: [
        {
          title: "Waste-to-Energy Tracking",
          description: "Monitor the complete lifecycle from organic waste collection to biogas production",
          icon: "recycle"
        },
        {
          title: "School Fuel Management",
          description: "Streamlined fuel request and delivery system for educational institutions",
          icon: "school"
        },
        {
          title: "Environmental Impact",
          description: "Track CO2 reduction and environmental benefits of biogas production",
          icon: "eco"
        },
        {
          title: "Real-time Monitoring",
          description: "Live production data and quality control for optimal biogas generation",
          icon: "monitor"
        }
  ]
  });
  } catch (error) {
    console.error('Welcome data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load welcome page data'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user with coins balance
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let coins = { totalCoins: 0, lifetimeCoins: 0 };
    try {
      const db = require('../config/database').sequelize;
      const [coinData] = await db.query(
        'SELECT totalCoins, lifetimeCoins FROM user_coins WHERE userId = ?',
        { replacements: [req.user.id] }
      );
      if (coinData && coinData[0]) {
        coins = coinData[0];
      }
    } catch (coinError) {
      console.log('Could not fetch coins:', coinError.message);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        organization: user.organization || '',
        role: user.role,
        isActive: user.isActive,
        profilePhoto: user.profilePhoto || '',
        profileImage: user.profileImage || '',
        bio: user.bio || '',
        coins: coins.totalCoins || 0,
        lifetimeCoins: coins.lifetimeCoins || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user data'
    });
  }
});



// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    if (!user) {
      return res.json({ success: true, message: 'If email exists, reset instructions sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // In production, send email here
    console.log(`Password reset link: http://localhost:3000/reset-password?token=${resetToken}`);

    res.json({ success: true, message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ success: false, message: 'Invalid or expired token' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      organization,
      bio,
      profilePhoto
    } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (organization) user.organization = organization;
    if (bio !== undefined) user.bio = bio;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', auth, async (req, res) => {
  try {
    const token = generateToken(req.user.id);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error refreshing token'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user and invalidate session
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just send a success response
    // The frontend will handle removing the token from storage
    
    await User.update(
      { lastLogoutAt: new Date() },
      { where: { id: req.user.id } }
    );

    res.json({
      success: true,
      message: 'Logged out successfully',
      redirectTo: '/login',
      loginOptions: {
        hasAccount: true,
        createAccount: true,
        googleAuth: true,
        welcomeMessage: 'You have been logged out successfully. Please sign in to continue.',
        authOptions: [
          {
            type: 'login',
            title: 'Sign In to Your Account',
            description: 'Access your EcoFuelConnect dashboard',
            action: 'login'
          },
          {
            type: 'register',
            title: 'Create New Account',
            description: 'Join the EcoFuelConnect community',
            action: 'register'
          },
          {
            type: 'google',
            title: 'Continue with Google',
            description: 'Quick sign-in with your Google account',
            action: 'google-auth'
          }
        ]
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// @route   GET /api/auth/login-options
// @desc    Get login page configuration with multiple auth options
// @access  Public
router.get('/login-options', async (req, res) => {
  try {
    // Get some basic statistics for the login page
    const totalUsers = await User.count({ where: { isActive: true } });
    const totalSchools = await User.count({ where: { role: 'school', isActive: true } });
    
    res.json({
      success: true,
      loginConfig: {
        appName: 'EcoFuelConnect',
        tagline: 'Powering South Sudan with Clean Energy',
        statistics: {
          totalUsers,
          totalSchools,
          activeCommunities: totalSchools
        },
        authMethods: {
          email: {
            enabled: true,
            title: 'Sign in with Email',
            description: 'Use your registered email and password'
          },
          google: {
            enabled: true,
            title: 'Continue with Google',
            description: 'Quick and secure authentication',
            clientId: process.env.GOOGLE_CLIENT_ID || null
          },
          microsoft: {
            enabled: false,
            title: 'Sign in with Microsoft',
            description: 'Use your Microsoft account'
          }
        },
        features: [
          'Real-time biogas production monitoring',
          'IoT sensor integration',
          'Community waste management',
          'Educational content access',
          'Project collaboration tools'
        ],
        supportInfo: {
          helpEmail: 'support@ecofuelconnect.org',
          documentationUrl: '/help',
          contactPhone: '+211-XXX-XXXX'
        }
      }
    });
  } catch (error) {
    console.error('Login options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load login configuration'
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth authentication
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Missing Google credential' });
    }
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token' });
    }
    // Find or create user in DB
    const User = require('../models/User');
    let user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      user = await User.create({
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        email: payload.email,
        password: '', // No password for Google users
        organization: '',
        phone: '',
        role: 'user',
        isActive: true
      });
    }
    // Generate JWT token
  // ...existing code...
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication service error' });
  }
});

// @route   GET /api/auth/session-status
// @desc    Check if user session is valid
// @access  Private
router.get('/session-status', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        sessionValid: false
      });
    }

    res.json({
      success: true,
      sessionValid: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
        profileCompletion: user.profileCompletion,
        lastLogin: user.lastLogin,
        preferences: user.preferences
      },
      sessionInfo: {
        isActive: true,
        expiresIn: '7d', // Based on JWT expiration
        lastActivity: new Date()
      }
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({
      success: false,
      sessionValid: false,
      message: 'Session validation error'
    });
  }
});

module.exports = router;
module.exports = router;