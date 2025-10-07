const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  metrics: {
    // Waste metrics
    totalWasteCollected: {
      type: Number,
      default: 0
    },
    dailyWasteAverage: {
      type: Number,
      default: 0
    },
    wasteByType: {
      food_scraps: { type: Number, default: 0 },
      vegetable_peels: { type: Number, default: 0 },
      fruit_waste: { type: Number, default: 0 },
      garden_waste: { type: Number, default: 0 },
      agricultural_residue: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    
    // Biogas production metrics
    biogasProduced: {
      total: { type: Number, default: 0 },
      daily: { type: Number, default: 0 },
      efficiency: { type: Number, default: 0 } // percentage
    },
    
    // Fuel request metrics
    fuelRequests: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      approved: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
      totalValue: { type: Number, default: 0 }
    },
    
    // Environmental impact
    environmental: {
      carbonFootprintReduced: { type: Number, default: 0 },
      methaneEmissionAvoided: { type: Number, default: 0 },
      energyGenerated: { type: Number, default: 0 }, // kWh
      treesEquivalent: { type: Number, default: 0 },
      forestSaved: { type: Number, default: 0 } // hectares
    },
    
    // Community engagement
    community: {
      activeUsers: { type: Number, default: 0 },
      newRegistrations: { type: Number, default: 0 },
      wasteSuppliers: { type: Number, default: 0 },
      schoolsServed: { type: Number, default: 0 },
      householdsServed: { type: Number, default: 0 },
      educationalContentViews: { type: Number, default: 0 }
    },
    
    // Financial metrics
    financial: {
      totalRevenue: { type: Number, default: 0 },
      supplierPayments: { type: Number, default: 0 },
      operatingCosts: { type: Number, default: 0 },
      profitMargin: { type: Number, default: 0 }
    }
  },
  
  // Monthly targets and goals
  targets: {
    monthlyWasteTarget: { type: Number, default: 1500 },
    biogasProductionTarget: { type: Number, default: 600 },
    carbonReductionGoal: { type: Number, default: 750 },
    communityEngagementGoal: { type: Number, default: 100 }
  },
  
  // Performance indicators
  kpis: {
    wasteCollectionEfficiency: { type: Number, default: 0 },
    biogasConversionRate: { type: Number, default: 0 },
    customerSatisfaction: { type: Number, default: 0 },
    supplierRetention: { type: Number, default: 0 },
    deliverySuccess: { type: Number, default: 0 }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ 'metrics.community.activeUsers': -1 });

// Static method to get dashboard summary
analyticsSchema.statics.getDashboardSummary = async function(timeframe = 'month') {
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  const summary = await this.aggregate([
    {
      $match: {
        date: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalWaste: { $sum: '$metrics.totalWasteCollected' },
        avgDailyWaste: { $avg: '$metrics.dailyWasteAverage' },
        totalBiogas: { $sum: '$metrics.biogasProduced.total' },
        avgBiogasEfficiency: { $avg: '$metrics.biogasProduced.efficiency' },
        totalFuelRequests: { $sum: '$metrics.fuelRequests.total' },
        totalFuelDelivered: { $sum: '$metrics.fuelRequests.delivered' },
        totalCarbonReduced: { $sum: '$metrics.environmental.carbonFootprintReduced' },
        totalEnergyGenerated: { $sum: '$metrics.environmental.energyGenerated' },
        avgActiveUsers: { $avg: '$metrics.community.activeUsers' },
        totalSuppliers: { $max: '$metrics.community.wasteSuppliers' },
        totalSchools: { $max: '$metrics.community.schoolsServed' },
        totalRevenue: { $sum: '$metrics.financial.totalRevenue' }
      }
    }
  ]);
  
  return summary[0] || {};
};

// Static method to generate monthly analytics
analyticsSchema.statics.generateMonthlyAnalytics = async function(date = new Date()) {
  const WasteEntry = mongoose.model('WasteEntry');
  const FuelRequest = mongoose.model('FuelRequest');
  const User = mongoose.model('User');
  
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  try {
    // Get waste statistics
    const wasteStats = await WasteEntry.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$quantity.weight' },
          totalBiogas: { $sum: '$processing.biogasProduced.amount' },
          totalCarbon: { $sum: '$environmental.carbonFootprintReduced' },
          totalEntries: { $sum: 1 },
          suppliers: { $addToSet: '$supplier.name' },
          wasteTypes: {
            $push: {
              type: '$wasteDetails.type',
              weight: '$quantity.weight'
            }
          }
        }
      }
    ]);
    
    // Get fuel request statistics
    const fuelStats = await FuelRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          totalValue: { $sum: '$totalCost' }
        }
      }
    ]);
    
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
          newUsers: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfMonth] },
                1,
                0
              ]
            }
          },
          userTypes: {
            $push: '$role'
          }
        }
      }
    ]);
    
    const waste = wasteStats[0] || {};
    const fuel = fuelStats[0] || {};
    const users = userStats[0] || {};
    
    // Create or update analytics record
    const analytics = await this.findOneAndUpdate(
      { date: startOfMonth },
      {
        metrics: {
          totalWasteCollected: waste.totalWeight || 0,
          dailyWasteAverage: (waste.totalWeight || 0) / 30,
          biogasProduced: {
            total: waste.totalBiogas || 0,
            daily: (waste.totalBiogas || 0) / 30,
            efficiency: waste.totalWeight ? ((waste.totalBiogas || 0) / waste.totalWeight * 100) : 0
          },
          fuelRequests: {
            total: fuel.totalRequests || 0,
            pending: fuel.pending || 0,
            approved: fuel.approved || 0,
            delivered: fuel.delivered || 0,
            cancelled: fuel.cancelled || 0,
            totalValue: fuel.totalValue || 0
          },
          environmental: {
            carbonFootprintReduced: waste.totalCarbon || 0,
            methaneEmissionAvoided: (waste.totalWeight || 0) * 0.25,
            energyGenerated: (waste.totalBiogas || 0) * 6, // kWh conversion
            treesEquivalent: Math.floor((waste.totalCarbon || 0) / 22),
            forestSaved: (waste.totalCarbon || 0) / 1000
          },
          community: {
            activeUsers: users.activeUsers || 0,
            newRegistrations: users.newUsers || 0,
            wasteSuppliers: (waste.suppliers || []).length,
            schoolsServed: Math.floor((users.activeUsers || 0) / 20),
            householdsServed: Math.floor((users.activeUsers || 0) * 0.8),
            educationalContentViews: (users.activeUsers || 0) * 5
          },
          financial: {
            totalRevenue: fuel.totalValue || 0,
            supplierPayments: (waste.totalWeight || 0) * 50, // RWF per kg
            operatingCosts: (fuel.totalValue || 0) * 0.3,
            profitMargin: fuel.totalValue ? (((fuel.totalValue || 0) - ((fuel.totalValue || 0) * 0.3)) / (fuel.totalValue || 1) * 100) : 0
          }
        },
        kpis: {
          wasteCollectionEfficiency: waste.totalEntries ? Math.min(100, (waste.totalEntries / 100) * 100) : 0,
          biogasConversionRate: waste.totalWeight ? ((waste.totalBiogas || 0) / waste.totalWeight * 100) : 0,
          customerSatisfaction: 85, // Could be calculated from reviews
          supplierRetention: 90, // Could be calculated from supplier activity
          deliverySuccess: fuel.totalRequests ? ((fuel.delivered || 0) / fuel.totalRequests * 100) : 0
        }
      },
      { upsert: true, new: true }
    );
    
    return analytics;
    
  } catch (error) {
    console.error('Error generating monthly analytics:', error);
    throw error;
  }
};

// Method to get trend data
analyticsSchema.statics.getTrendData = function(metric, months = 6) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - months);
  
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    isActive: true
  })
  .sort({ date: 1 })
  .select(`date metrics.${metric}`)
  .lean();
};

module.exports = mongoose.model('Analytics', analyticsSchema);