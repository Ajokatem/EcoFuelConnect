const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const FuelRequest = require('./models/FuelRequest');
const WasteEntry = require('./models/WasteEntry');
const Analytics = require('./models/Analytics');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecofuelconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log(' Starting to seed database...');

    // Clear existing data to avoid duplicates
    await User.deleteMany({});
    await FuelRequest.deleteMany({});
    await WasteEntry.deleteMany({});
    await Analytics.deleteMany({});
    console.log('  Cleared existing data');

    // Create sample users
    const sampleUsers = await User.create([
      {
        email: 'Malangatem2gmail.com',
        password: 'malange@123',
        role: 'user',
        firstName: 'Malang',
        lastName: 'Atem',
        phone: '+250792104895'
      },
      {
        email: 'contactus@greenorg.com',
        password: 'nya123',
        role: 'supplier',
        firstName: 'Green',
        lastName: 'Organization',
        organizationName: 'Green Energy Co.'
      },
      {
        email: 'ajokbiar57@gmail.com',
        password: 'password123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'Biar'
      }
    ]);

    console.log(' Users created:', sampleUsers.length);

    // Create sample fuel requests
    const sampleFuelRequests = await FuelRequest.create([
      {
        requestId: 'FR001',
        user: sampleUsers[0]._id,
        fuelType: 'biogas',
        fuelDetails: {
          name: 'Premium Biogas',
          description: 'High-quality biogas for residential use',
          pricePerUnit: 1.50,
          unit: 'cubic meter'
        },
        quantity: 100,
        totalCost: 150.00,
        deliveryAddress: {
          street: '123 Main St',
          city: 'Eco City',
          state: 'Green State',
          zipCode: '12345'
        },
        contactInfo: {
          phone: '+250792104895',
          email: 'john@example.com'
        },
        preferredDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        purpose: 'Residential heating and cooking needs',
        urgency: 'normal',
        status: 'pending'
      },
      {
        requestId: 'FR002',
        user: sampleUsers[1]._id,
        fuelType: 'bio_diesel',
        fuelDetails: {
          name: 'Industrial Biodiesel',
          description: 'High-grade biodiesel for commercial use',
          pricePerUnit: 1.20,
          unit: 'liter'
        },
        quantity: 500,
        totalCost: 600.00,
        deliveryAddress: {
          street: '456 Green Ave',
          city: 'Eco City',
          state: 'Green State',
          zipCode: '12346'
        },
        contactInfo: {
          phone: '+1234567891',
          email: 'contact@greenorg.com'
        },
        preferredDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        purpose: 'Industrial machinery and transportation fuel',
        urgency: 'high',
        status: 'approved'
      }
    ]);

    console.log(' Fuel requests created:', sampleFuelRequests.length);

    // Create sample waste entries
    const sampleWasteEntries = await WasteEntry.create([
      {
        entryId: 'WE001',
        user: sampleUsers[0]._id,
        supplier: {
          name: 'Akech Beek household',
          type: 'household',
          contact: {
            phone: '+250792104895',
            email: 'akechbeek@gmail.com'
          }
        },
        wasteDetails: {
          type: 'food_scraps',
          category: 'wet_waste',
          description: 'Kitchen scraps and food waste'
        },
        quantity: {
          weight: 25.5,
          unit: 'kg'
        },
        collectionInfo: {
          date: new Date(),
          method: 'pickup',
          location: {
            coordinates: [-1.9441, 30.0619], // Kigali coordinates
            address: '123 Main St, Kigali'
          }
        },
        qualityAssessment: {
          rating: 4,
          contamination: 'low',
          moistureContent: 65
        },
        status: 'processing'
      },
      {
        entryId: 'WE002',
        user: sampleUsers[1]._id,
        supplier: {
          name: 'Green Farm Co.',
          type: 'farm',
          contact: {
            phone: '+11234567891',
            email: 'contactus@greenfarm.com'
          }
        },
        wasteDetails: {
          type: 'agricultural_residue',
          category: 'dry_organic',
          description: 'Crop residues and organic farm waste'
        },
        quantity: {
          weight: 150.0,
          unit: 'kg'
        },
        collectionInfo: {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          method: 'delivery',
          location: {
            coordinates: [-1.9461, 30.0639],
            address: '456 Green Ave, Kigali'
          }
        },
        qualityAssessment: {
          rating: 5,
          contamination: 'none',
          moistureContent: 25
        },
        status: 'completed'
      }
    ]);

    console.log(' Waste entries created:', sampleWasteEntries.length);

    // Create sample analytics
    const sampleAnalytics = await Analytics.create([
      {
        date: new Date(),
        metrics: {
          totalWasteCollected: 25.5,
          dailyWasteAverage: 12.75,
          wasteByType: {
            food_scraps: 25.5,
            vegetable_peels: 0,
            fruit_waste: 0,
            garden_waste: 0,
            agricultural_residue: 0,
            other: 0
          },
          biogasProduced: {
            total: 8.5,
            daily: 8.5,
            efficiency: 85
          },
          fuelRequests: {
            total: 1,
            pending: 1,
            approved: 0,
            delivered: 0,
            cancelled: 0,
            totalValue: 150.00
          },
          environmental: {
            carbonFootprintReduced: 12.3,
            methaneEmissionAvoided: 5.2,
            energyGenerated: 15.7,
            treesEquivalent: 0.6
          }
        }
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        metrics: {
          totalWasteCollected: 150.0,
          dailyWasteAverage: 87.75,
          wasteByType: {
            food_scraps: 0,
            vegetable_peels: 0,
            fruit_waste: 0,
            garden_waste: 0,
            agricultural_residue: 150.0,
            other: 0
          },
          biogasProduced: {
            total: 45.0,
            daily: 45.0,
            efficiency: 90
          },
          fuelRequests: {
            total: 1,
            pending: 0,
            approved: 1,
            delivered: 0,
            cancelled: 0,
            totalValue: 600.00
          },
          environmental: {
            carbonFootprintReduced: 67.5,
            methaneEmissionAvoided: 28.5,
            energyGenerated: 89.2,
            treesEquivalent: 3.4
          }
        }
      }
    ]);

    console.log(' Analytics created:', sampleAnalytics.length);

    console.log(' Database seeded successfully!');
    console.log('\n Summary:');
    console.log(`Users: ${sampleUsers.length}`);
    console.log(`Fuel Requests: ${sampleFuelRequests.length}`);
    console.log(`Waste Entries: ${sampleWasteEntries.length}`);
    console.log(`Analytics: ${sampleAnalytics.length}`);

  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log(' Database connection closed');
  }
};

// Run the seed function
seedData();