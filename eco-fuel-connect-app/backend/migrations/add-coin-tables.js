const { sequelize } = require('../config/database');

async function addCoinTables() {
  try {
    const isPostgres = sequelize.getDialect() === 'postgres';
    console.log(`Creating coin reward tables for ${isPostgres ? 'PostgreSQL' : 'MySQL'}...`);

    if (isPostgres) {
      // PostgreSQL syntax
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user_coins (
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
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS coin_transactions (
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
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS coin_payouts (
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
    } else {
      // MySQL syntax
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user_coins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          totalCoins INT DEFAULT 0,
          lifetimeCoins INT DEFAULT 0,
          lastEarned DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_user (userId)
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS coin_transactions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          wasteEntryId INT,
          amount INT NOT NULL,
          type ENUM('earned', 'converted', 'bonus', 'penalty') DEFAULT 'earned',
          description TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (wasteEntryId) REFERENCES waste_entries(id) ON DELETE SET NULL
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS coin_payouts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          coins INT NOT NULL,
          cashAmount DECIMAL(10,2) NOT NULL,
          paymentMethod VARCHAR(50),
          status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
          processedAt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    }
    
    console.log('✓ All coin tables created successfully!');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✓ Coin tables already exist');
    } else {
      console.error('Migration error:', error.message);
      throw error;
    }
  }
}

module.exports = { addCoinTables };

if (require.main === module) {
  addCoinTables()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
