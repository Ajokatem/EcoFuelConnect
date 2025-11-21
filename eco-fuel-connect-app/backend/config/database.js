const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

// Load environment file dynamically based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, '..', envFile) });
console.log(`🌱 Loaded environment file: ${envFile}`);

// Choose database config depending on environment
let sequelize;

if (process.env.NODE_ENV === 'production') {
  // --- Production (Render) uses PostgreSQL ---
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    define: {
      timestamps: true
    }
  });
} else {
  // --- Local (Development) uses MySQL ---
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ ${process.env.NODE_ENV === 'production' ? 'PostgreSQL' : 'MySQL'} connected successfully.`);
  } catch (error) {
    console.error(`❌ Database connection failed:`, error.message);
    console.warn('⚠️ App will continue without database connection.');
  }
};

module.exports = { connectDB, sequelize };
