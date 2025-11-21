const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WasteEntry = sequelize.define('WasteEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  producerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  wasteType: {
    type: DataTypes.ENUM(
      'food_scraps',
      'vegetable_peels',
      'fruit_waste',
      'garden_waste',
      'paper_organic',
      'agricultural_residue',
      'animal_manure',
      'mixed_organic',
      'other',
      'kitchen_scraps',
      'fruit_vegetable',
      'meat_bones',
      'food_waste'
    ),
    allowNull: false
  },
  wasteSource: {
    type: DataTypes.ENUM('household', 'restaurant', 'market', 'farm', 'school', 'hospital', 'other', 'slaughterhouse'),
    allowNull: false
  },
  sourceLocation: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.1
    }
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'kg'
  },
  estimatedWeight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  qualityGrade: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good'
  },
  moistureContent: {
    type: DataTypes.DECIMAL(5, 2),
    validate: {
      min: 0,
      max: 100
    }
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  pH: {
    type: DataTypes.DECIMAL(4, 2),
    validate: {
      min: 0,
      max: 14
    }
  },
  // Documentation and verification
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  weighbridgePhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationMethod: {
    type: DataTypes.ENUM('weighbridge', 'photo', 'manual_estimate', 'digital_scale'),
    allowNull: false
  },
  // Geolocation and timestamp data
  collectionTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deliveryTimestamp: {
    type: DataTypes.DATE,
    allowNull: true
  },
  geoTimestamp: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  // Processing status
  status: {
    type: DataTypes.ENUM('pending', 'logged', 'confirmed', 'rejected', 'collected', 'in_transit', 'delivered', 'processing', 'processed'),
    defaultValue: 'pending'
  },
  processedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  biogasYield: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  // Notes and observations
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  supplierNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualityIssues: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Verification and approval
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'waste_entries',
  timestamps: true,
  indexes: [
    {
      fields: ['supplierId', 'collectionTimestamp']
    },
    {
      fields: ['producerId', 'collectionTimestamp']
    },
    {
      fields: ['wasteType', 'wasteSource']
    },
    {
      fields: ['status', 'collectionTimestamp']
    }
  ]
});

// Virtual for environmental impact
WasteEntry.prototype.getEnvironmentalImpact = function() {
  // Estimate CO2 saved (kg of waste = ~0.5 kg CO2 saved)
  return {
    co2Saved: this.estimatedWeight * 0.5,
    treesEquivalent: Math.round(this.estimatedWeight * 0.02)
  };
};

// Hook to calculate estimated weight
WasteEntry.beforeSave(async (wasteEntry, options) => {
  if (wasteEntry.changed('quantity') || wasteEntry.changed('unit')) {
    switch(wasteEntry.unit) {
      case 'kg':
        wasteEntry.estimatedWeight = wasteEntry.quantity;
        break;
      case 'tons':
        wasteEntry.estimatedWeight = wasteEntry.quantity * 1000;
        break;
      case 'bags':
        wasteEntry.estimatedWeight = wasteEntry.quantity * 20; // assume 20kg per bag
        break;
      case 'cubic_meters':
        wasteEntry.estimatedWeight = wasteEntry.quantity * 500; // assume 500kg per cubic meter for organic waste
        break;
      default:
        wasteEntry.estimatedWeight = wasteEntry.quantity;
    }
  }
});

// Static method to get waste statistics
WasteEntry.getWasteStatistics = async function(filters = {}) {
  const { Op, fn, col } = require('sequelize');
  
  const result = await this.findAll({
    where: filters,
    attributes: [
      [fn('SUM', col('estimatedWeight')), 'totalWaste'],
      [fn('COUNT', '*'), 'totalEntries'],
      [fn('AVG', col('estimatedWeight')), 'avgDailyWaste']
    ]
  });
  
  // Get waste by type
  const wasteByType = await this.findAll({
    where: filters,
    attributes: [
      'wasteType',
      [fn('SUM', col('estimatedWeight')), 'totalWeight']
    ],
    group: ['wasteType']
  });
  
  return {
    ...result[0].toJSON(),
    wasteByType: wasteByType.map(item => ({
      type: item.wasteType,
      weight: item.getDataValue('totalWeight')
    }))
  };
};

// Define associations
WasteEntry.associate = function(models) {
  // Many-to-one with User (supplier)
  WasteEntry.belongsTo(models.User, {
    foreignKey: 'supplierId',
    as: 'supplier'
  });
  
  // Many-to-one with User (producer)
  WasteEntry.belongsTo(models.User, {
    foreignKey: 'producerId',
    as: 'producer'
  });
  
  // Many-to-one with User (verifier)
  WasteEntry.belongsTo(models.User, {
    foreignKey: 'verifiedById',
    as: 'verifiedBy'
  });
};

module.exports = WasteEntry;