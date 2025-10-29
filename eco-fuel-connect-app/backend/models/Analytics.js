const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Analytics extends Model {}

Analytics.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.NOW
  },
  
  // Metrics stored as JSON object
  metrics: {
    type: DataTypes.JSON,
    defaultValue: {
      // Waste metrics
      totalWasteCollected: 0,
      dailyWasteAverage: 0,
      wasteByType: {
        food_scraps: 0,
        vegetable_peels: 0,
        fruit_waste: 0,
        garden_waste: 0,
        agricultural_residue: 0,
        other: 0
      },
      
      // Biogas production metrics
      biogasProduced: {
        total: 0,
        daily: 0,
        efficiency: 0
      },
      
      // Fuel request metrics
      fuelRequests: {
        total: 0,
        pending: 0,
        approved: 0,
        delivered: 0,
        cancelled: 0,
        totalValue: 0
      },
      
      // Environmental impact
      environmental: {
        carbonFootprintReduced: 0,
        methaneEmissionAvoided: 0,
        energyGenerated: 0,
        treesEquivalent: 0,
        forestSaved: 0
      },
      
      // Community engagement
      community: {
        activeUsers: 0,
        newRegistrations: 0,
        wasteSuppliers: 0,
        schoolsServed: 0,
        householdsServed: 0,
        educationalContentViews: 0
      },
      
      // Financial metrics
      financial: {
        totalRevenue: 0,
        supplierPayments: 0,
        operatingCosts: 0,
        profitMargin: 0
      }
    }
  },
  
  // Monthly targets and goals
  targets: {
    type: DataTypes.JSON,
    defaultValue: {
      monthlyWasteTarget: 1500,
      biogasProductionTarget: 600,
      carbonReductionGoal: 750,
      communityEngagementGoal: 100
    }
  },
  
  // Performance indicators
  kpis: {
    type: DataTypes.JSON,
    defaultValue: {
      wasteCollectionEfficiency: 0,
      biogasConversionRate: 0,
      customerSatisfaction: 0,
      supplierRetention: 0,
      deliverySuccess: 0
    }
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Analytics',
  tableName: 'analytics',
  timestamps: true,
  indexes: [
    { fields: ['date'] },
    { fields: ['isActive'] }
  ]
});

// Static method to get dashboard summary
Analytics.getDashboardSummary = async function(timeframe = 'month') {
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
  
  const records = await this.findAll({
    where: {
      date: {
        [sequelize.Sequelize.Op.gte]: startDate
      },
      isActive: true
    }
  });
  
  if (records.length === 0) {
    return {};
  }
  
  
  const summary = {
    totalWaste: records.reduce((sum, r) => sum + (r.metrics?.totalWasteCollected || 0), 0),
    avgDailyWaste: records.reduce((sum, r) => sum + (r.metrics?.dailyWasteAverage || 0), 0) / records.length,
    totalBiogas: records.reduce((sum, r) => sum + (r.metrics?.biogasProduced?.total || 0), 0),
    avgBiogasEfficiency: records.reduce((sum, r) => sum + (r.metrics?.biogasProduced?.efficiency || 0), 0) / records.length,
    totalFuelRequests: records.reduce((sum, r) => sum + (r.metrics?.fuelRequests?.total || 0), 0),
    totalFuelDelivered: records.reduce((sum, r) => sum + (r.metrics?.fuelRequests?.delivered || 0), 0),
    totalCarbonReduced: records.reduce((sum, r) => sum + (r.metrics?.environmental?.carbonFootprintReduced || 0), 0),
    totalEnergyGenerated: records.reduce((sum, r) => sum + (r.metrics?.environmental?.energyGenerated || 0), 0),
    avgActiveUsers: records.reduce((sum, r) => sum + (r.metrics?.community?.activeUsers || 0), 0) / records.length,
    totalSuppliers: Math.max(...records.map(r => r.metrics?.community?.wasteSuppliers || 0)),
    totalSchools: Math.max(...records.map(r => r.metrics?.community?.schoolsServed || 0)),
    totalRevenue: records.reduce((sum, r) => sum + (r.metrics?.financial?.totalRevenue || 0), 0)
  };
  
  return summary;
};

module.exports = Analytics;