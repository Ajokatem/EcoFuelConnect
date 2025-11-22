/**
 * Check database schema and verify User table columns
 * Run: node check-db-schema.js
 */

require('dotenv').config();
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function checkSchema() {
  console.log('🔍 Checking Database Schema...\n');

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Get table description
    console.log('📋 User table columns:');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.table(results);

    // Check for required columns
    const columnNames = results.map(r => r.column_name);
    const requiredColumns = ['profilePhoto', 'bio', 'isActive'];
    
    console.log('\n🔎 Checking required columns:');
    requiredColumns.forEach(col => {
      const exists = columnNames.includes(col);
      console.log(`${exists ? '✅' : '❌'} ${col}: ${exists ? 'EXISTS' : 'MISSING'}`);
    });

    // Count producers
    console.log('\n👥 Producer count:');
    const producerCount = await User.count({ where: { role: 'producer' } });
    const activeProducerCount = await User.count({ where: { role: 'producer', isActive: true } });
    console.log(`Total producers: ${producerCount}`);
    console.log(`Active producers: ${activeProducerCount}`);

    // List recent producers
    console.log('\n📝 Recent producers:');
    const recentProducers = await User.findAll({
      where: { role: 'producer' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'profilePhoto', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    recentProducers.forEach(p => {
      console.log(`- ${p.firstName} ${p.lastName} (${p.email}) - Active: ${p.isActive} - Created: ${p.createdAt}`);
    });

    console.log('\n✅ Schema check completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkSchema();
