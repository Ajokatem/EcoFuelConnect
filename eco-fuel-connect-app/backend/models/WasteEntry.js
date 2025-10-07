const mongoose = require('mongoose');

const wasteEntrySchema = new mongoose.Schema({
  entryId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    contact: {
      phone: String,
      email: String,
      address: String
    },
    type: {
      type: String,
      enum: ['household', 'restaurant', 'market', 'farm', 'school', 'hospital', 'other'],
      required: true
    }
  },
  wasteDetails: {
    type: {
      type: String,
      required: [true, 'Waste type is required'],
      enum: [
        'food_scraps',
        'vegetable_peels', 
        'fruit_waste',
        'garden_waste',
        'paper_organic',
        'agricultural_residue',
        'animal_manure',
        'mixed_organic',
        'other'
      ]
    },
    category: {
      type: String,
      enum: ['wet_waste', 'dry_organic', 'mixed'],
      required: true
    },
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    moistureContent: {
      type: Number,
      min: 0,
      max: 100,
      validate: {
        validator: Number.isInteger,
        message: 'Moisture content must be a whole number'
      }
    },
    contamination: {
      level: {
        type: String,
        enum: ['none', 'low', 'medium', 'high'],
        default: 'none'
      },
      contaminants: [String]
    }
  },
  quantity: {
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0.1, 'Weight must be greater than 0']
    },
    unit: {
      type: String,
      enum: ['kg', 'pounds', 'tons'],
      default: 'kg'
    },
    volume: {
      amount: Number,
      unit: {
        type: String,
        enum: ['liters', 'cubic_meters', 'gallons']
      }
    }
  },
  collectionInfo: {
    date: {
      type: Date,
      required: [true, 'Collection date is required']
    },
    time: String,
    location: {
      address: {
        type: String,
        required: [true, 'Collection address is required']
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      district: String,
      sector: String
    },
    collectedBy: {
      name: String,
      id: String,
      contact: String
    }
  },
  processing: {
    status: {
      type: String,
      enum: ['collected', 'in_transit', 'received', 'processing', 'processed', 'completed'],
      default: 'collected'
    },
    facility: {
      name: String,
      location: String,
      capacity: String
    },
    processedDate: Date,
    biogasProduced: {
      amount: Number,
      unit: { type: String, default: 'cubic_meters' },
      estimatedYield: Number
    },
    byProducts: {
      fertilizer: {
        amount: Number,
        unit: { type: String, default: 'kg' }
      },
      compost: {
        amount: Number,
        unit: { type: String, default: 'kg' }
      }
    }
  },
  environmental: {
    carbonFootprintReduced: {
      type: Number,
      default: 0
    },
    methaneEmissionAvoided: {
      type: Number,
      default: 0
    },
    energyGenerated: {
      amount: Number,
      unit: { type: String, default: 'kWh' }
    }
  },
  payment: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'RWF'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paidAt: Date,
    paymentMethod: String
  },
  quality_check: {
    inspector: String,
    inspectionDate: Date,
    passed: { type: Boolean, default: true },
    notes: String,
    images: [String]
  },
  notes: {
    supplier: String,
    collector: String,
    processor: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate unique entry ID before saving
wasteEntrySchema.pre('save', async function(next) {
  if (!this.entryId) {
    const count = await this.constructor.countDocuments();
    this.entryId = `WE${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate estimated biogas production
  if (this.quantity.weight && !this.processing.biogasProduced.estimatedYield) {
    // Rough estimate: 1 kg organic waste = 0.3-0.5 cubic meters biogas
    this.processing.biogasProduced.estimatedYield = this.quantity.weight * 0.4;
  }
  
  // Calculate carbon footprint reduction
  if (this.quantity.weight && !this.environmental.carbonFootprintReduced) {
    // Rough estimate: 1 kg organic waste = 0.5 kg CO2 reduction
    this.environmental.carbonFootprintReduced = this.quantity.weight * 0.5;
  }
  
  next();
});

// Static method to get waste statistics
wasteEntrySchema.statics.getStats = function(userId = null, timeframe = null) {
  const matchStage = { isActive: true };
  if (userId) matchStage.user = userId;
  
  if (timeframe) {
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
    }
    
    if (startDate) {
      matchStage.createdAt = { $gte: startDate };
    }
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        totalWeight: { $sum: '$quantity.weight' },
        totalBiogasProduced: { $sum: '$processing.biogasProduced.amount' },
        totalCarbonReduced: { $sum: '$environmental.carbonFootprintReduced' },
        totalPayments: { $sum: '$payment.amount' },
        avgWeight: { $avg: '$quantity.weight' },
        uniqueSuppliers: { $addToSet: '$supplier.name' }
      }
    },
    {
      $addFields: {
        supplierCount: { $size: '$uniqueSuppliers' }
      }
    }
  ]);
};

// Static method to get waste by type
wasteEntrySchema.statics.getWasteByType = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$wasteDetails.type',
        count: { $sum: 1 },
        totalWeight: { $sum: '$quantity.weight' },
        avgWeight: { $avg: '$quantity.weight' }
      }
    },
    { $sort: { totalWeight: -1 } }
  ]);
};

// Instance method to calculate biogas potential
wasteEntrySchema.methods.calculateBiogasPotential = function() {
  const baseYield = 0.4; // cubic meters per kg
  let multiplier = 1;
  
  // Adjust based on waste type
  const highYieldTypes = ['food_scraps', 'vegetable_peels', 'animal_manure'];
  const lowYieldTypes = ['paper_organic', 'garden_waste'];
  
  if (highYieldTypes.includes(this.wasteDetails.type)) {
    multiplier = 1.2;
  } else if (lowYieldTypes.includes(this.wasteDetails.type)) {
    multiplier = 0.7;
  }
  
  // Adjust based on quality
  const qualityMultipliers = {
    excellent: 1.1,
    good: 1.0,
    fair: 0.8,
    poor: 0.5
  };
  
  multiplier *= qualityMultipliers[this.wasteDetails.quality] || 1;
  
  return this.quantity.weight * baseYield * multiplier;
};

module.exports = mongoose.model('WasteEntry', wasteEntrySchema);