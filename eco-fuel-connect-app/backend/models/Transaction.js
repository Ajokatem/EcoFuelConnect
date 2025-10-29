const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  // Related entities (foreign keys)
  fuelRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'FuelRequests',
      key: 'id'
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
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // biogasProductionId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: {
  //     model: 'biogas_production',
  //     key: 'id'
  //   }
  // },
  
  // Transaction details
  transactionType: {
    type: DataTypes.ENUM('fuel_delivery', 'waste_collection', 'service_fee', 'penalty', 'refund'),
    allowNull: false
  },
  
  // Fuel/service details
  fuelType: {
    type: DataTypes.ENUM('biogas', 'biomethane', 'compressed_biogas'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit: {
    type: DataTypes.ENUM('cubic_meters', 'liters', 'kg'),
    defaultValue: 'cubic_meters'
  },
  
  // Pricing
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  baseAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalDiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalTaxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  
  // Payment information
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'mobile_money', 'bank_transfer', 'credit', 'barter'),
    allowNull: false
  },
  
  // Status tracking
  status: {
    type: DataTypes.ENUM('created', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered', 'completed', 'cancelled'),
    defaultValue: 'created'
  },
  
  // Timestamps
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
Transaction.associate = function(models) {
  // Many-to-one with FuelRequest
  Transaction.belongsTo(models.FuelRequest, {
    foreignKey: 'fuelRequestId',
    as: 'fuelRequest'
  });
  
  // Many-to-one with User (school)
  Transaction.belongsTo(models.User, {
    foreignKey: 'schoolId',
    as: 'school'
  });
  
  // Many-to-one with User (producer)
  Transaction.belongsTo(models.User, {
    foreignKey: 'producerId',
    as: 'producer'
  });
  
  // Many-to-one with BiogasProduction
  Transaction.belongsTo(models.BiogasProduction, {
    foreignKey: 'biogasProductionId',
    as: 'biogasProduction'
  });
};

module.exports = Transaction;