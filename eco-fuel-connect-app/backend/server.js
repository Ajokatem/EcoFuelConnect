const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const fuelRequestRoutes = require('./routes/fuelRequests');
const wasteLoggingRoutes = require('./routes/wasteLogging');
const authRoutes = require('./routes/auth');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecofuelconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' Connected to MongoDB successfully');
})
.catch((error) => {
  console.error(' MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fuel-requests', fuelRequestRoutes);
app.use('/api/waste-logging', wasteLoggingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EcoFuelConnect API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
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
  console.log(` EcoFuelConnect API server is running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;