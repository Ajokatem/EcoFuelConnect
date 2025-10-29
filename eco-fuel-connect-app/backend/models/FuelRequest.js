const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FuelRequest = sequelize.define('FuelRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  producerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  
  // Request details
  fuelType: {
    type: DataTypes.ENUM('biogas', 'biomethane', 'compressed_biogas'),
    allowNull: false,
    defaultValue: 'biogas'
  },
  quantityRequested: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.1
    }
  },
  unit: {
    type: DataTypes.ENUM('cubic_meters', 'liters', 'kg'),
    allowNull: false,
    defaultValue: 'cubic_meters'
  },
  urgencyLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  
  // Delivery information
  deliveryAddress: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  
  preferredDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  flexibleDelivery: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  deliveryTimePreference: {
    type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'any_time'),
    defaultValue: 'any_time'
  },
  
  // Request status and tracking
  status: {
    type: DataTypes.ENUM(
      'pending', 
      'reviewing', 
      'approved', 
      'assigned', 
      'preparing', 
      'in_transit', 
      'delivered', 
      'completed', 
      'cancelled', 
      'rejected'
    ),
    defaultValue: 'pending'
  },
  statusHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Assignment and fulfillment
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  quantityApproved: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  quantityDelivered: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Pricing and payment
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discountApplied: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  finalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'partial', 'overdue'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'mobile_money', 'bank_transfer', 'credit'),
    defaultValue: 'cash'
  },
  
  // Quality and satisfaction
  fuelQuality: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  deliveryRating: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  
  // Communication and notes
  schoolNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  producerNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Delivery logistics
  transportationMethod: {
    type: DataTypes.ENUM('truck', 'van', 'motorcycle', 'bicycle', 'walking'),
    defaultValue: 'truck'
  },
  estimatedDeliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  driverInfo: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  
  // Environmental impact
  environmentalBenefit: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  
 
}, {
  tableName: 'fuel_requests',
  timestamps: true,
  indexes: [
    {
      fields: ['schoolId', 'createdAt']
    },
    {
      fields: ['producerId', 'status']
    },
    {
      fields: ['status', 'preferredDeliveryDate']
    },
    {
      fields: ['requestId'],
      unique: true
    }
  ]
});

// Hooks for pre-save operations
FuelRequest.beforeCreate(async (fuelRequest, options) => {
  // Generate request ID if not exists
  if (!fuelRequest.requestId) {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    fuelRequest.requestId = `FR-${timestamp}-${random}`;
  }
});

FuelRequest.beforeSave(async (fuelRequest, options) => {
  // Calculate costs
  if (fuelRequest.pricePerUnit && fuelRequest.quantityApproved) {
    fuelRequest.totalCost = fuelRequest.pricePerUnit * fuelRequest.quantityApproved;
    fuelRequest.finalCost = fuelRequest.totalCost - (fuelRequest.discountApplied || 0);
  }
  
  // Calculate environmental benefits
  if (fuelRequest.quantityApproved) {
    fuelRequest.environmentalBenefit = {
      co2Saved: fuelRequest.quantityApproved * 2.3, // 1 m³ biogas saves ~2.3 kg CO2
      treesEquivalent: Math.round(fuelRequest.quantityApproved * 0.1),
      fossilFuelReplaced: fuelRequest.quantityApproved * 0.6 // 1 m³ biogas ≈ 0.6L kerosene
    };
  }
});

// Instance method to update status
FuelRequest.prototype.updateStatus = async function(newStatus, updatedBy, notes) {
  this.status = newStatus;
  
  // Add to status history
  const statusHistory = this.statusHistory || [];
  statusHistory.push({
    status: newStatus,
    updatedBy: updatedBy,
    notes: notes,
    timestamp: new Date()
  });
  this.statusHistory = statusHistory;
  
  // Set specific timestamps
  switch(newStatus) {
    case 'approved':
      this.approvedAt = new Date();
      break;
    case 'assigned':
      this.assignedAt = new Date();
      break;
    case 'rejected':
      this.rejectedAt = new Date();
      break;
    case 'delivered':
      this.actualDeliveryDate = new Date();
      break;
  }
  
  return await this.save();
};

// Static method to get request statistics
FuelRequest.getRequestStatistics = async function(filters = {}) {
  const { Op, fn, col, literal } = require('sequelize');
  
  const results = await this.findAll({
    where: filters,
    attributes: [
      'status',
      [fn('COUNT', '*'), 'count'],
      [fn('SUM', col('quantityRequested')), 'totalQuantity'],
      [fn('AVG', literal('TIMESTAMPDIFF(HOUR, createdAt, approvedAt)')), 'avgResponseTimeHours']
    ],
    group: ['status']
  });
  
  return results;
};

// Static method to get delivery performance metrics
FuelRequest.getDeliveryMetrics = async function(producerId, startDate, endDate) {
  const { Op, fn, col, literal } = require('sequelize');
  
  const results = await this.findAll({
    where: {
      producerId: producerId,
      status: 'delivered',
      actualDeliveryDate: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: [
      [fn('COUNT', '*'), 'totalDeliveries'],
      [fn('SUM', literal('CASE WHEN actualDeliveryDate <= preferredDeliveryDate THEN 1 ELSE 0 END')), 'onTimeDeliveries'],
      [fn('AVG', literal('JSON_EXTRACT(deliveryRating, "$.overallSatisfaction")')), 'avgSatisfactionRating'],
      [fn('SUM', col('quantityDelivered')), 'totalFuelDelivered']
    ]
  });
  
  const result = results[0];
  if (result) {
    const totalDeliveries = result.getDataValue('totalDeliveries');
    const onTimeDeliveries = result.getDataValue('onTimeDeliveries');
    
    return {
      ...result.toJSON(),
      onTimeDeliveryRate: totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0
    };
  }
  
  return null;
};

// Define associations (will be set up in a separate associations file)
FuelRequest.associate = function(models) {
  // Many-to-one with User (school)
  FuelRequest.belongsTo(models.User, {
    foreignKey: 'schoolId',
    as: 'school'
  });
  
  // Many-to-one with User (producer)
  FuelRequest.belongsTo(models.User, {
    foreignKey: 'producerId',
    as: 'producer'
  });
  
  // Many-to-one with BiogasProduction
  FuelRequest.belongsTo(models.BiogasProduction, {
    foreignKey: 'biogasProductionId',
    as: 'biogasProduction'
  });
  
  // Many-to-many with Transaction through junction table
  FuelRequest.belongsToMany(models.Transaction, {
    through: 'FuelRequestTransactions',
    foreignKey: 'fuelRequestId',
    otherKey: 'transactionId',
    as: 'transactions'
  });
};

module.exports = FuelRequest;