const { sequelize } = require('../config/database');

async function fixCoinTablesSchema() {
  try {
    console.log('🔧 Fixing coin tables schema...');
    
    const isPostgres = sequelize.getDialect() === 'postgres';
    
    if (!isPostgres) {
      console.log('⚠️  Not PostgreSQL, skipping migration');
      return;
    }

    // Drop existing tables (in correct order due to foreign keys)
    console.log('Dropping existing coin tables...');
    await sequelize.query('DROP TABLE IF EXISTS coin_payouts CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS coin_transactions CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS user_coins CASCADE');
    
    // Recreate with correct schema
    console.log('Creating user_coins table...');
    await sequelize.query(`
      CREATE TABLE user_coins (
        id SERIAL PRIMARY KEY,
        "userId" INT NOT NULL,
        "totalCoins" INT DEFAULT 0,
        "lifetimeCoins" INT DEFAULT 0,
        "lastEarned" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE ("userId")
      )
    `);
    
    console.log('Creating coin_transactions table...');
    await sequelize.query(`
      CREATE TABLE coin_transactions (
        id SERIAL PRIMARY KEY,
        "userId" INT NOT NULL,
        "wasteEntryId" INT,
        amount INT NOT NULL,
        type VARCHAR(20) DEFAULT 'earned' CHECK (type IN ('earned', 'converted', 'bonus', 'penalty')),
        description TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY ("wasteEntryId") REFERENCES waste_entries(id) ON DELETE SET NULL
      )
    `);
    
    console.log('Creating coin_payouts table...');
    await sequelize.query(`
      CREATE TABLE coin_payouts (
        id SERIAL PRIMARY KEY,
        "userId" INT NOT NULL,
        coins INT NOT NULL,
        "cashAmount" DECIMAL(10,2) NOT NULL,
        "paymentMethod" VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        "processedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Creating indexes...');
    await sequelize.query('CREATE INDEX idx_user_coins_userId ON user_coins("userId")');
    await sequelize.query('CREATE INDEX idx_coin_transactions_userId ON coin_transactions("userId")');
    await sequelize.query('CREATE INDEX idx_coin_transactions_wasteEntryId ON coin_transactions("wasteEntryId")');
    await sequelize.query('CREATE INDEX idx_coin_payouts_userId ON coin_payouts("userId")');
    await sequelize.query('CREATE INDEX idx_coin_payouts_status ON coin_payouts(status)');
    
    console.log('✅ Coin tables schema fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing coin tables schema:', error.message);
    throw error;
  }
}

module.exports = { fixCoinTablesSchema };

if (require.main === module) {
  fixCoinTablesSchema()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
