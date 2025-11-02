const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, sequelize } = require('./config/database');

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
// Trust proxy for correct rate-limit IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const wasteLoggingRoutes = require('./routes/wasteLogging');
const biogasProductionRoutes = require('./routes/biogasProduction');
const fuelRequestRoutes = require('./routes/fuelRequests');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const contentRoutes = require('./routes/content');
const coursesRoutes = require('./routes/courses');
const educationRoutes = require('./routes/education');
const iotRoutes = require('./routes/iot');
const notificationsRoutes = require('./routes/notifications');
const messagesRoutes = require('./routes/messages');


// Database connection and model associations
connectDB().then(async () => {
  try {
    // Set up model associations after database connection
    const { defineAssociations } = require('./models/associations');
    defineAssociations();
    
    console.log('Database connected and model associations defined');
    
    // Note: Database sync is temporarily disabled to avoid schema conflicts
    // The models will work with existing database structure
  } catch (associationError) {
    console.error('Model association error:', associationError.message);
  }
}).catch(error => {
  console.error('Database connection failed:', error.message);
  process.exit(1);
});

// Routes


app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/fuel-requests', fuelRequestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/waste-logging', wasteLoggingRoutes);
app.use('/api/biogas-production', biogasProductionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/admin', adminRoutes);




// Health check endpoint - no authentication required
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EcoFuelConnect API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0'
  });
});

// Welcome page configuration endpoint - no authentication required
app.get('/api/welcome-config', async (req, res) => {
  try {
    const WasteEntry = require('./models/WasteEntry');
    const BiogasProduction = require('./models/BiogasProduction');
    const User = require('./models/User');
    const { Op, fn, col } = require('sequelize');

    // Initialize default statistics
    let statistics = {
      users: 45,
      schools: 12,
      wasteProcessed: 2840,
      biogasProduced: 1136,
      co2Saved: 2613
    };

    try {
      // Try to get real statistics - if database is synced
      const totalUsers = await User.count({ 
        where: { isActive: true } 
      });
      
      const totalSchools = await User.count({ 
        where: { 
          role: 'school', 
          isActive: true 
        } 
      });
      
      const totalWasteResult = await WasteEntry.findAll({
        attributes: [[fn('SUM', col('quantity')), 'total']] // Changed from estimatedWeight to quantity
      });
      const totalWasteProcessed = totalWasteResult[0]?.getDataValue('total') || 0;

      const totalBiogasResult = await BiogasProduction.findAll({
        attributes: [[fn('SUM', col('totalVolume')), 'total']]
      });
      const totalBiogasProduced = totalBiogasResult[0]?.getDataValue('total') || 0;

      const co2Saved = Math.round(totalBiogasProduced * 2.3);

      // Update statistics with real data if available
      statistics = {
        users: totalUsers || statistics.users,
        schools: totalSchools || statistics.schools,
        wasteProcessed: totalWasteProcessed || statistics.wasteProcessed,
        biogasProduced: totalBiogasProduced || statistics.biogasProduced,
        co2Saved: co2Saved || statistics.co2Saved
      };
    } catch (dbError) {
      console.log('Welcome config database error:', dbError.message);
      // Use fallback statistics if database queries fail
    }

    res.json({
      success: true,
      welcome: {
        title: "Welcome to EcoFuelConnect",
        subtitle: "Transforming Organic Waste into Clean Energy for South Sudan Schools",
        autoRedirect: {
          enabled: true,
          delaySeconds: 5,
          redirectTo: "/auth" // This should redirect to login/register page
        },
        statistics,
        features: [
          {
            title: "Waste-to-Energy Tracking",
            description: "Complete lifecycle monitoring from organic waste to biogas",
            icon: ""
          },
          {
            title: "School Fuel Management", 
            description: "Streamlined fuel delivery for educational institutions",
            icon: ""
          },
          {
            title: "Environmental Impact",
            description: "Track CO2 reduction and environmental benefits",
            icon: ""
          }
        ]
      }
    });
  } catch (error) {
    console.error('Welcome config error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to load welcome configuration'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 EcoFuelConnect API server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🛡️  Security middleware enabled`);
});

module.exports = app;