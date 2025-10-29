const { sequelize } = require('../config/database');
const Organization = require('../models/Organization');

const seedOrganizations = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log(' Connected to MySQL database');

    const organizations = [
      {
        name: 'Promised Land Secondary School',
        type: 'school',
        address: 'Nimule Road, Juba',
        contactPerson: 'Duot Deng',
        email: 'promisedLand@education.com',
        phone: '+211955666777',
        registrationNumber: 'SCH-001-2024',
        isActive: true
      },
      {
        name: 'Imperial Plaza Restaurant',
        type: 'restaurant',
        address: 'Juba town road, Juba',
        contactPerson: 'Ahmed Hassan',
        email: 'imperialplaza@gmail.com.ss',
        phone: '+211944555666',
        registrationNumber: 'RES-002-2024',
        isActive: true
      },
      {
        name: 'Konyokonyo Market Juba',
        type: 'market',
        address: 'Nimule road, Juba',
        contactPerson: 'Sarah Johnson',
        email: 'ajok@gmail.com',
        phone: '+211933444555',
        registrationNumber: 'MKT-003-2024',
        isActive: true
      },
      {
        name: 'Juba Teaching Hospital',
        type: 'hospital',
        address: 'University of Juba Road, Juba',
        contactPerson: 'Dr. Peter Mading',
        email: 'info@jubahospital.gov.ss',
        phone: '+211922333444',
        registrationNumber: 'HSP-004-2024',
        isActive: true
      },
      {
        name: 'Green Valley Farm',
        type: 'other',
        address: 'Rajaf Payam, Juba County',
        contactPerson: 'Joseph Wani',
        email: 'info@greenvalley.ss',
        phone: '+211911222333',
        registrationNumber: 'FRM-005-2024',
        isActive: true
      }
    ];

    // Insert organizations
    for (const orgData of organizations) {
      const existingOrg = await Organization.findOne({ 
        where: { 
          $or: [
            { email: orgData.email },
            { registrationNumber: orgData.registrationNumber }
          ]
        } 
      });
      
      if (!existingOrg) {
        await Organization.create(orgData);
        console.log(` Created organization: ${orgData.name}`);
      } else {
        console.log(` Organization already exists: ${orgData.name}`);
      }
    }

    console.log(' Organization seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error(' Error seeding organizations:', error);
    process.exit(1);
  }
};

seedOrganizations();