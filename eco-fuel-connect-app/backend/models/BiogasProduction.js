const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BiogasProduction = sequelize.define('BiogasProduction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  plantId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  productionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  // Daily production metrics
  totalVolume: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  methaneContent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 60,
    validate: {
      min: 0,
      max: 100
    }
  },
  co2Content: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 35,
    validate: {
      min: 0,
      max: 100
    }
  },
  h2sContent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 100,
    validate: {
      min: 0
    }
  },
  // Process parameters
  temperature: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  pressure: {
    type: DataTypes.DECIMAL(8, 2),
    validate: {
      min: 0
    }
  },
  pH: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 7,
    validate: {
      min: 0,
      max: 14
    }
  },
  // Input materials tracking
  feedstock: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  totalFeedstock: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // Production efficiency
  yieldRate: {
    type: DataTypes.DECIMAL(8, 4),
    defaultValue: 0
  },
  efficiency: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  // Operational status
  operationalHours: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 24,
    validate: {
      min: 0,
      max: 24
    }
  },
  downtime: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  maintenancePerformed: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Quality metrics
  qualityGrade: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good'
  },
  impurities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Distribution tracking
  fuelDistributed: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  totalDistributed: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  remainingStock: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  // Environmental impact
  co2Saved: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  // Monitoring and alerts
  alerts: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Notes and observations
  operatorNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  weatherConditions: {
    type: DataTypes.STRING,
    allowNull: true
  },
  issuesEncountered: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Verification
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'biogas_production',
  timestamps: true,
  indexes: [
    {
      fields: ['producerId', 'productionDate']
    },
    {
      fields: ['productionDate', 'totalVolume']
    },
    {
      fields: ['plantId', 'productionDate']
    }
  ]
});

// Hooks for pre-save operations
BiogasProduction.beforeSave(async (biogasProduction, options) => {
  // Calculate yield rate
  if (biogasProduction.totalVolume && biogasProduction.totalFeedstock) {
    biogasProduction.yieldRate = biogasProduction.totalVolume / biogasProduction.totalFeedstock;
  }
  
  // Calculate remaining stock
  biogasProduction.remainingStock = biogasProduction.totalVolume - biogasProduction.totalDistributed;
  
  // Calculate CO2 saved (1 cubic meter biogas = ~2.3 kg CO2 saved)
  biogasProduction.co2Saved = biogasProduction.totalVolume * 2.3;
  
  // Calculate efficiency based on expected yield
  const expectedYield = biogasProduction.totalFeedstock * 0.3; // Expected 0.3 m³/kg
  if (expectedYield > 0) {
    biogasProduction.efficiency = Math.min((biogasProduction.totalVolume / expectedYield) * 100, 100);
  }
});

// Static method to get production statistics
BiogasProduction.getProductionStatistics = async function(producerId, startDate, endDate) {
  const { Op, fn, col } = require('sequelize');
  
  const result = await this.findAll({
    where: {
      producerId: producerId,
      productionDate: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: [
      [fn('SUM', col('totalVolume')), 'totalProduction'],
      [fn('AVG', col('totalVolume')), 'avgDailyProduction'],
      [fn('SUM', col('totalFeedstock')), 'totalFeedstock'],
      [fn('AVG', col('yieldRate')), 'avgYieldRate'],
      [fn('AVG', col('efficiency')), 'avgEfficiency'],
      [fn('SUM', col('co2Saved')), 'totalCO2Saved'],
      [fn('COUNT', '*'), 'productionDays']
    ]
  });
  
  return result[0];
};

// Static method to get monthly production trends
BiogasProduction.getMonthlyTrends = async function(producerId, year) {
  const { Op, fn, col, literal } = require('sequelize');
  
  const results = await this.findAll({
    where: {
      producerId: producerId,
      productionDate: {
        [Op.between]: [
          new Date(year, 0, 1),
          new Date(year + 1, 0, 1)
        ]
      }
    },
    attributes: [
      [fn('MONTH', col('productionDate')), 'month'],
      [fn('SUM', col('totalVolume')), 'monthlyProduction'],
      [fn('AVG', col('totalVolume')), 'avgDailyProduction'],
      [fn('SUM', col('totalFeedstock')), 'feedstockUsed'],
      [fn('AVG', col('efficiency')), 'avgEfficiency']
    ],
    group: [fn('MONTH', col('productionDate'))],
    order: [[fn('MONTH', col('productionDate')), 'ASC']]
  });
  
  return results;
};

// Define associations
BiogasProduction.associate = function(models) {
  // Many-to-one with User (producer)
  BiogasProduction.belongsTo(models.User, {
    foreignKey: 'producerId',
    as: 'producer'
  });
  
  // Many-to-one with User (verifier)
  BiogasProduction.belongsTo(models.User, {
    foreignKey: 'verifiedById',
    as: 'verifiedBy'
  });
  
  // One-to-many with FuelRequest
  BiogasProduction.hasMany(models.FuelRequest, {
    foreignKey: 'biogasProductionId',
    as: 'fuelRequests'
  });
};

module.exports = BiogasProduction;