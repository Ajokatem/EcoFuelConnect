const { sequelize } = require('../config/database');

const runSeedScript = async (scriptName, scriptPath) => {
  try {
    console.log(`\n Starting ${scriptName}...`);
    const seedFunction = require(scriptPath);
    await seedFunction();
    console.log(` ${scriptName} completed successfully!`);
  } catch (error) {
    console.error(` Error in ${scriptName}:`, error.message);
    throw error;
  }
};

const seedAll = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log(' Connected to MySQL database');
    console.log(' Starting complete database seeding...\n');

    // Run seeding scripts in order (due to foreign key dependencies)
    console.log('1️ Seeding Users...');
    await require('./seedUsers')();
    
    console.log('\n2️ Seeding Organizations...');
    await require('./seedOrganizations')();
    
    console.log('\n3️ Seeding Educational Content...');
    await require('../seedEducationalData')();

    console.log('\n All seeding operations completed successfully!');
    console.log(' Your EcoFuelConnect database is now ready with sample data.');
    process.exit(0);

  } catch (error) {
    console.error('\n Seeding failed:', error.message);
    console.log(' Please check your database connection and try again.');
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedAll();
}

module.exports = seedAll;