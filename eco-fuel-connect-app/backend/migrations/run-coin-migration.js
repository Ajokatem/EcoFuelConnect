const fs = require('fs');
const path = require('path');
const db = require('../config/database').sequelize;

async function runMigration() {
  try {
    console.log('Running coin system migration...');
    
    const sqlFile = path.join(__dirname, 'create-coin-tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
        console.log('✓ Executed statement');
      }
    }
    
    console.log('✅ Coin system migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
