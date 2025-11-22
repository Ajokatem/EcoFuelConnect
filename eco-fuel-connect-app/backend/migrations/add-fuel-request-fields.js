const { sequelize } = require('../config/database');

async function addFuelRequestFields() {
  try {
    console.log('🔧 Adding missing fields to fuel_requests table...');
    
    // Add requestDate column
    await sequelize.query(`
      ALTER TABLE fuel_requests 
      ADD COLUMN IF NOT EXISTS "requestDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `).catch(err => console.log('requestDate column may already exist'));
    
    // Add contactPerson column
    await sequelize.query(`
      ALTER TABLE fuel_requests 
      ADD COLUMN IF NOT EXISTS "contactPerson" VARCHAR(255);
    `).catch(err => console.log('contactPerson column may already exist'));
    
    // Add contactPhone column
    await sequelize.query(`
      ALTER TABLE fuel_requests 
      ADD COLUMN IF NOT EXISTS "contactPhone" VARCHAR(255);
    `).catch(err => console.log('contactPhone column may already exist'));
    
    // Add priority column
    await sequelize.query(`
      ALTER TABLE fuel_requests 
      ADD COLUMN IF NOT EXISTS "priority" VARCHAR(50) DEFAULT 'normal';
    `).catch(err => console.log('priority column may already exist'));
    
    // Add notes column
    await sequelize.query(`
      ALTER TABLE fuel_requests 
      ADD COLUMN IF NOT EXISTS "notes" TEXT;
    `).catch(err => console.log('notes column may already exist'));
    
    console.log('✅ Fuel request fields migration completed');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  }
}

module.exports = { addFuelRequestFields };

if (require.main === module) {
  addFuelRequestFields()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
