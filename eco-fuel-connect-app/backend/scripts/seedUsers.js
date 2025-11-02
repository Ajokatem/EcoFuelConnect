const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log(' Connected to MySQL database');

    // Hash passwords
    const saltRounds = 10;
    
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@ecofuelconnect.com',
        password: await bcrypt.hash('Admin@12345', saltRounds),
        phone: '+211123456789',
        organization: 'EcoFuel Connect',
        role: 'admin',
        emailVerified: true
      },
      {
        firstName: 'Ayen Beek',
        lastName: 'Atem',
        email: 'ayenbeek@gmail.com',
        password: await bcrypt.hash('ayen@278', saltRounds),
        phone: '+211936789999',
        organization: 'Amarat Hotel, Juba',
        role: 'supplier',
        emailVerified: true
      },
      {
        firstName: 'Malang Atem',
        lastName: 'Biar',
        email: 'promisedland@education.com',
        password: await bcrypt.hash('promised.10@211', saltRounds),
        phone: '+211955666777',
        organization: 'Promised Land Secondary School',
        role: 'school',
        emailVerified: true
      },
      {
        firstName: 'Gabriel Manyang',
        lastName: 'Jok',
        email: 'manyangjok@gmail.com',
        password: await bcrypt.hash('manyang@999', saltRounds),
        phone: '+211944555666',
        organization: 'Imperial Plaza Restaurant',
        role: 'supplier', 
        emailVerified: true
      },
      {
        firstName: 'Akech Atem',
        lastName: 'Deng',
        email: 'akech@gmail.com',
        password: await bcrypt.hash('akechdeng@457', saltRounds),
        phone: '+211933444555',
        organization: 'Central Market',
        role: 'supplier',
        emailVerified: true
      },
      {
        firstName: 'Ajok Atem',
        lastName: 'Beek',
        email: 'producer@ecofuelconnect.com',
        password: await bcrypt.hash('producer@123', saltRounds),
        phone: '+211922333444',
        organization: 'EcoFuel Biogas Plant',
        role: 'producer',
        emailVerified: true
      }
    ];

    // Insert users
    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(` Created user: ${userData.firstName} ${userData.lastName}`);
      } else {
        console.log(` User already exists: ${userData.email}`);
      }
    }

    console.log(' User seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error(' Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();