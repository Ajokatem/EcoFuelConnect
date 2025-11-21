const { sequelize } = require('../config/database');

async function fixDatabaseTables() {
  try {
    console.log('Starting database table fixes...');
    
    const queryInterface = sequelize.getQueryInterface();
    const dialect = sequelize.getDialect();
    
    // Add plantId column to biogas_production for both MySQL and PostgreSQL
    console.log('Adding plantId column to biogas_production...');
    try {
      const tables = await queryInterface.describeTable('biogas_production');
      if (!tables.plantId) {
        if (dialect === 'mysql') {
          await sequelize.query(`ALTER TABLE biogas_production ADD COLUMN plantId VARCHAR(255)`);
        } else if (dialect === 'postgres') {
          await sequelize.query(`ALTER TABLE biogas_production ADD COLUMN "plantId" VARCHAR(255)`);
        }
        console.log('plantId column added successfully');
      } else {
        console.log('plantId column already exists');
      }
    } catch (err) {
      console.log('plantId column error:', err.message);
    }
    
    // Fix unit column in waste_entries
    console.log('Fixing unit column in waste_entries...');
    try {
      if (dialect === 'mysql') {
        await sequelize.query(`ALTER TABLE waste_entries MODIFY COLUMN unit VARCHAR(50) NOT NULL DEFAULT 'kg'`);
      } else if (dialect === 'postgres') {
        await sequelize.query(`ALTER TABLE waste_entries ALTER COLUMN unit TYPE VARCHAR(50)`);
      }
    } catch (err) {
      console.log('unit column fix error:', err.message);
    }
    
    if (dialect === 'postgres') {
      console.log('Fixing PostgreSQL table names...');
      
      const tables = await queryInterface.showAllTables();
      console.log('Existing tables:', tables);
      
      const tableMapping = {
        'Users': 'users',
        'WasteEntries': 'waste_entries',
        'FuelRequests': 'fuel_requests',
        'BiogasProductions': 'biogas_productions',
        'Transactions': 'transactions',
        'Notifications': 'notifications',
        'Messages': 'messages',
        'Projects': 'projects',
        'Organizations': 'organizations',
        'Courses': 'courses',
        'UserProgresses': 'user_progresses',
        'KnowledgeArticles': 'knowledge_articles',
        'ContentPosts': 'content_posts',
        'ContactMessages': 'contact_messages',
        'IoTSensors': 'iot_sensors',
        'IoTSensorReadings': 'iot_sensor_readings',
        'Analytics': 'analytics'
      };
      
      for (const [oldName, newName] of Object.entries(tableMapping)) {
        if (tables.includes(oldName) && !tables.includes(newName)) {
          console.log(`Renaming ${oldName} to ${newName}...`);
          await sequelize.query(`ALTER TABLE "${oldName}" RENAME TO "${newName}"`);
        }
      }
      
      console.log('Creating coin tables if not exist...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user_coins (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          "totalCoins" INTEGER DEFAULT 0,
          "lifetimeCoins" INTEGER DEFAULT 0,
          "lastEarned" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW(),
          UNIQUE("userId")
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS coin_transactions (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount INTEGER NOT NULL,
          type VARCHAR(50) NOT NULL,
          description TEXT,
          "wasteEntryId" INTEGER REFERENCES waste_entries(id) ON DELETE SET NULL,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS coin_payouts (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          coins INTEGER NOT NULL,
          "cashAmount" DECIMAL(10,2) NOT NULL,
          "paymentMethod" VARCHAR(50),
          status VARCHAR(50) DEFAULT 'pending',
          "processedAt" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS chatbot_knowledge (
          id SERIAL PRIMARY KEY,
          keyword VARCHAR(255),
          question TEXT,
          answer TEXT,
          category VARCHAR(100),
          "usageCount" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('Creating/updating messages table...');
      if (dialect === 'mysql') {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            senderId INT NOT NULL,
            receiverId INT NOT NULL,
            content TEXT NOT NULL,
            isRead BOOLEAN DEFAULT false,
            sentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
        
        // Add createdAt and updatedAt if they don't exist
        try {
          await sequelize.query(`ALTER TABLE messages ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP`);
          console.log('Added createdAt column to messages');
        } catch (e) {
          if (!e.message.includes('Duplicate column')) console.log('createdAt exists or error:', e.message);
        }
        try {
          await sequelize.query(`ALTER TABLE messages ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
          console.log('Added updatedAt column to messages');
        } catch (e) {
          if (!e.message.includes('Duplicate column')) console.log('updatedAt exists or error:', e.message);
        }
      } else {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            "senderId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            "receiverId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            "isRead" BOOLEAN DEFAULT false,
            "sentAt" TIMESTAMP DEFAULT NOW(),
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `);
        
        // Add createdAt and updatedAt if they don't exist
        try {
          await sequelize.query(`ALTER TABLE messages ADD COLUMN "createdAt" TIMESTAMP DEFAULT NOW()`);
          console.log('Added createdAt column to messages');
        } catch (e) {
          if (!e.message.includes('already exists')) console.log('createdAt exists or error:', e.message);
        }
        try {
          await sequelize.query(`ALTER TABLE messages ADD COLUMN "updatedAt" TIMESTAMP DEFAULT NOW()`);
          console.log('Added updatedAt column to messages');
        } catch (e) {
          if (!e.message.includes('already exists')) console.log('updatedAt exists or error:', e.message);
        }
      }
      
      if (dialect === 'mysql') {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId, sentAt)`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiverId, isRead, sentAt)`);
      } else {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderId", "sentAt")`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages("receiverId", "isRead", "sentAt")`);
      }
      
      console.log('Creating/updating notifications table...');
      if (dialect === 'mysql') {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            type VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            \`read\` BOOLEAN DEFAULT false,
            isRead BOOLEAN DEFAULT false,
            status VARCHAR(50) DEFAULT 'unread',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
      } else {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            type VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            "read" BOOLEAN DEFAULT false,
            "isRead" BOOLEAN DEFAULT false,
            status VARCHAR(50) DEFAULT 'unread',
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        `);
      }
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS chatbot_conversations (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
          "sessionId" VARCHAR(255),
          "userMessage" TEXT,
          "botResponse" TEXT,
          "wasHelpful" BOOLEAN,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('Seeding chatbot knowledge...');
      await sequelize.query(`
        INSERT INTO chatbot_knowledge (keyword, question, answer, category, "usageCount")
        VALUES 
          ('biogas', 'What is biogas?', 'Biogas is a renewable energy produced when bacteria break down organic waste in an oxygen-free environment. It contains 50-75% methane and can be used for cooking, heating, and electricity.', 'basics', 0),
          ('start', 'How do I start producing biogas?', 'To start: 1) Build/buy a digester, 2) Fill with water (50%), 3) Add starter (cow dung), 4) Feed daily with organic waste, 5) Maintain 20-35°C, 6) Wait 15-30 days for gas production.', 'getting_started', 0),
          ('temperature', 'What temperature is best?', 'Optimal temperature: 30-35°C. Minimum: 20°C. Tips: Insulate digester, use black paint for heat absorption, consider underground installation.', 'maintenance', 0),
          ('ph', 'What pH level should I maintain?', 'Ideal pH: 6.5-7.5. Too acidic? Add lime/wood ash. Too alkaline? Add organic acids. Test weekly with pH strips.', 'maintenance', 0),
          ('leak', 'How do I check for gas leaks?', 'Mix soap with water, apply to joints/pipes, look for bubbles. Fix: Tighten connections, replace damaged parts. NEVER use flame to check!', 'safety', 0),
          ('waste', 'What waste can I use?', 'Best: Cow/pig manure, kitchen waste, crop residues. Good: Food scraps, vegetable waste. Avoid: Meat, bones, oils, chemicals, plastics.', 'feeding', 0)
        ON CONFLICT DO NOTHING
      `);
    }
    
    console.log('Database fixes completed successfully!');
    return true;
  } catch (error) {
    console.error('Error fixing database:', error);
    throw error;
  }
}

if (require.main === module) {
  fixDatabaseTables()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { fixDatabaseTables };
