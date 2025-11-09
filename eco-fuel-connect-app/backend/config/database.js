const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' MySQL connected successfully.');
  } catch (error) {
    console.error(' MySQL connection failed:', error);
    console.warn(' App will continue without database connection');
    // Don't throw error - allow app to start without DB
  }
};

module.exports = { connectDB, sequelize };
