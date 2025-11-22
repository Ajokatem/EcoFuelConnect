const { sequelize } = require('./config/database');

async function checkData() {
  try {
    await sequelize.authenticate();
    
    const [schools] = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE role = \'school\'');
    console.log('All Schools:', schools[0].count);
    
    const [suppliers] = await sequelize.query('SELECT COUNT(*) as count FROM users WHERE role = \'supplier\'');
    console.log('All Suppliers:', suppliers[0].count);
    
    const [waste] = await sequelize.query('SELECT "supplierId", COUNT(*) as count FROM waste_entries GROUP BY "supplierId" LIMIT 5');
    console.log('Waste by Supplier:', waste);
    
    const [fuel] = await sequelize.query('SELECT "schoolId", COUNT(*) as count FROM fuel_requests GROUP BY "schoolId" LIMIT 5');
    console.log('Fuel by School:', fuel);
    
    const [users] = await sequelize.query('SELECT id, role, "firstName", "lastName", "isActive" FROM users LIMIT 10');
    console.log('Sample Users:', users);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkData();
