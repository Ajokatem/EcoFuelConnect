const { sequelize } = require('../config/database');

async function updateCoinPayoutsSchema() {
  try {
    console.log('Updating coin_payouts table schema...');
    
    const isPostgres = sequelize.getDialect() === 'postgres';
    if (!isPostgres) {
      console.log('Not PostgreSQL, skipping');
      return;
    }

    await sequelize.query(`
      ALTER TABLE coin_payouts 
      ADD COLUMN IF NOT EXISTS "paymentDetails" JSONB,
      ADD COLUMN IF NOT EXISTS "processedBy" INT REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS "transactionReference" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS notes TEXT
    `);
    
    console.log('Coin payouts schema updated successfully');
  } catch (error) {
    console.error('Update schema error:', error.message);
  }
}

module.exports = { updateCoinPayoutsSchema };

if (require.main === module) {
  updateCoinPayoutsSchema()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
