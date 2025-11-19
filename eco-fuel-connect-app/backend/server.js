const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { connectDB } = require('./config/database');
const morgan = require('morgan');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.set('trust proxy', 1); // Trust proxy for correct IP detection behind proxies/load balancers

// ----- Performance Optimizations -----
app.use(compression()); // Enable gzip compression
app.disable('x-powered-by'); // Remove Express signature
// ----- Security Middleware -----
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

if(process.env.NODE_ENV === 'development')
  app.use(morgan("combined"));

// ----- Rate Limiting -----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased for load testing
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health' || req.path === '/manifest.json'
});
app.use(limiter);

// ----- Middleware -----
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ----- Import Routes -----
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const wasteLoggingRoutes = require('./routes/wasteLogging');
const biogasProductionRoutes = require('./routes/biogasProduction');
const fuelRequestRoutes = require('./routes/fuelRequests');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const contentRoutes = require('./routes/content');
const coursesRoutes = require('./routes/courses');
const educationRoutes = require('./routes/education');
const iotRoutes = require('./routes/iot');
const notificationsRoutes = require('./routes/notifications');
const messagesRoutes = require('./routes/messages');
const rewardsRoutes = require('./routes/rewards');
const knowledgeRoutes = require('./routes/knowledge');
const chatbotRoutes = require('./routes/chatbot');
const usersRoutes = require('./routes/users');
// const environmentalRoutes = require('./routes/environmental');
// const imageAnalysisRoutes = require('./routes/imageAnalysis');

// ----- Database Connection -----
connectDB()
  .then(async () => {
    try {
      const { sequelize } = require('./config/database');
      
      // Sync database tables (creates all tables)
      await sequelize.sync({ force: false, alter: false });
      console.log(' Database tables synced successfully');
    } catch (err) {
      console.error(' Database sync error:', err.message);
    }
  })
  .catch((err) => {
    console.error(' Database connection failed:', err.message);
    process.exit(1);
  });

// ----- Route Mounting -----
app.use('/api/auth', authRoutes); // <-- Auth routes correctly mounted
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
app.use('/api/rewards', rewardsRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/chatbot', chatbotRoutes);
// app.use('/api/image-analysis', imageAnalysisRoutes);
app.use('/api/users', usersRoutes);
// app.use('/api/environmental', environmentalRoutes);
app.use('/admin', adminRoutes);

// ----- Static Files -----
app.get('/manifest.json', (req, res) => {
  res.json({
    name: 'EcoFuelConnect',
    short_name: 'EcoFuel',
    description: 'Transforming Organic Waste into Clean Energy',
    start_url: '/',
    display: 'standalone',
    theme_color: '#22c55e',
    background_color: '#ffffff',
    icons: []
  });
});

// ----- Health Check -----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EcoFuelConnect API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
  });
});

// ----- Welcome Config -----
app.get('/api/welcome-config', async (req, res) => {
  try {
    const WasteEntry = require('./models/WasteEntry');
    const BiogasProduction = require('./models/BiogasProduction');
    const User = require('./models/User');
    const { fn, col } = require('sequelize');

    let statistics = { users: 45, schools: 12, wasteProcessed: 2840, biogasProduced: 1136, co2Saved: 2613 };

    try {
      const totalUsers = await User.count({ where: { isActive: true } });
      const totalSchools = await User.count({ where: { role: 'school', isActive: true } });

      const totalWasteResult = await WasteEntry.findAll({
        attributes: [[fn('SUM', col('quantity')), 'total']],
      });
      const totalWasteProcessed = totalWasteResult[0]?.getDataValue('total') || 0;

      const totalBiogasResult = await BiogasProduction.findAll({
        attributes: [[fn('SUM', col('totalVolume')), 'total']],
      });
      const totalBiogasProduced = totalBiogasResult[0]?.getDataValue('total') || 0;

      const co2Saved = Math.round(totalBiogasProduced * 2.3);

      statistics = {
        users: totalUsers || statistics.users,
        schools: totalSchools || statistics.schools,
        wasteProcessed: totalWasteProcessed || statistics.wasteProcessed,
        biogasProduced: totalBiogasProduced || statistics.biogasProduced,
        co2Saved: co2Saved || statistics.co2Saved,
      };
    } catch (dbError) {
      console.log(' Welcome config database error:', dbError.message);
    }

    res.json({
      success: true,
      welcome: {
        title: 'Welcome to EcoFuelConnect',
        subtitle: 'Transforming Organic Waste into Clean Energy for South Sudan Schools',
        autoRedirect: { enabled: true, delaySeconds: 5, redirectTo: '/auth' },
        statistics,
        features: [
          { title: 'Waste-to-Energy Tracking', description: 'Complete lifecycle monitoring from organic waste to biogas', icon: '' },
          { title: 'School Fuel Management', description: 'Streamlined fuel delivery for educational institutions', icon: '' },
          { title: 'Environmental Impact', description: 'Track CO2 reduction and environmental benefits', icon: '' },
        ],
      },
    });
  } catch (error) {
    console.error(' Welcome config error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to load welcome configuration' });
  }
});

// ----- Error Handling -----
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
});

// ----- Frontend Route Redirects -----
app.all('/register', (req, res) => {
  res.status(200).json({
    message: 'Registration endpoint',
    correctEndpoint: '/api/auth/register',
    method: 'POST',
    note: 'Use /api/auth/register for actual registration'
  });
});

app.all('/login', (req, res) => {
  res.status(200).json({
    message: 'Login endpoint',
    correctEndpoint: '/api/auth/login',
    method: 'POST',
    note: 'Use /api/auth/login for actual login'
  });
});

// Handle other common frontend routes
app.all('/dashboard', (req, res) => {
  res.status(200).json({
    message: 'Dashboard endpoint',
    correctEndpoint: '/api/dashboard/stats',
    method: 'GET',
    note: 'Use /api/dashboard/stats for dashboard data'
  });
});

app.all('/waste-logging', (req, res) => {
  res.status(200).json({
    message: 'Waste logging endpoint',
    correctEndpoint: '/api/waste-logging',
    method: 'GET/POST',
    note: 'Use /api/waste-logging for waste operations'
  });
});

app.all('/fuel-requests', (req, res) => {
  res.status(200).json({
    message: 'Fuel requests endpoint',
    correctEndpoint: '/api/fuel-requests',
    method: 'GET/POST',
    note: 'Use /api/fuel-requests for fuel operations'
  });
});

app.all('/messages', (req, res) => {
  res.status(200).json({
    message: 'Messages endpoint',
    correctEndpoint: '/api/messages',
    method: 'GET/POST',
    note: 'Use /api/messages for messaging operations'
  });
});

// ----- SPA Routing Support -----
app.all('*', (req, res) => {
  // Only handle non-API routes
  if (!req.path.startsWith('/api/')) {
    res.json({
      message: 'EcoFuelConnect Frontend Route',
      path: req.originalUrl,
      method: req.method,
      note: 'This is a backend API server. Frontend should handle this route.'
    });
  } else {
    res.status(404).json({ message: 'API endpoint not found', path: req.originalUrl, method: req.method });
  }
});

// ----- Start Server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` EcoFuelConnect API server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API Base URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}/api`}`);
  console.log(` Security middleware enabled`);
});

module.exports = app;
