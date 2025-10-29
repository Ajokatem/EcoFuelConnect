const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Organization extends Model {}

Organization.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  organizationType: {
    type: String,
    required: true,
    enum: ['school', 'biogas_producer', 'waste_supplier', 'government', 'ngo', 'private_company']
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Contact Information
  contact: {
    email: String,
    phone: String,
    website: String,
    address: {
      street: String,
      city: { type: String, default: 'Juba' },
      state: String,
      country: { type: String, default: 'South Sudan' },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  
  // Organization-specific details
  details: {
    // For schools
    studentCapacity: Number,
    currentStudentCount: Number,
    schoolLevel: {
      type: String,
      enum: ['primary', 'secondary', 'university', 'technical', 'mixed']
    },
    establishedYear: Number,
    
    // For biogas producers
    plantCapacity: Number, // cubic meters per day
    operationalSince: Date,
    certifications: [String],
    technologyType: String,
    
    // For waste suppliers
    supplierType: {
      type: String,
      enum: ['market', 'slaughterhouse', 'restaurant', 'hotel', 'hospital', 'farm']
    },
    dailyWasteGeneration: Number, // kg per day
    operatingHours: {
      start: String,
      end: String
    },
    
    // General
    description: String,
    services: [String],
    specializations: [String]
  },
  
  // Staff and management
  staff: [{
    name: String,
    position: String,
    contact: {
      email: String,
      phone: String
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'operator', 'staff']
    },
    startDate: Date
  }],
  
  primaryContact: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  
  // Business/operational information
  operationalStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'under_maintenance'],
    default: 'active'
  },
  licenses: [{
    type: String,
    number: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['valid', 'expired', 'suspended'],
      default: 'valid'
    }
  }],
  
  // Performance metrics
  metrics: {
    // For schools
    monthlyFuelConsumption: Number,
    averageStudentsPerMeal: Number,
    cookingHoursPerDay: Number,
    
    // For producers
    monthlyProduction: Number,
    averageEfficiency: Number,
    customersServed: Number,
    
    // For suppliers
    monthlyWasteSupply: Number,
    reliabilityScore: Number,
    qualityRating: Number,
    
    // General
    satisfactionRating: Number,
    responseTime: Number // hours
  },
  
  // Financial information
  financials: {
    annualRevenue: Number,
    operatingCosts: Number,
    profitMargin: Number,
    paymentTerms: String,
    creditLimit: Number
  },
  
  // Relationships and partnerships
  partnerships: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Users associated with this organization
  users: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Verification and compliance
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedBy: {
    type: DataTypes.INTEGER
  },
  verificationDate: Date,
  complianceStatus: {
    environmental: { type: Boolean, default: false },
    health: { type: Boolean, default: false },
    safety: { type: Boolean, default: false },
    business: { type: Boolean, default: false }
  },
  
  // Media and documents
  logo: String,
  images: [String],
  documents: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['license', 'certificate', 'permit', 'insurance', 'contract', 'other']
    },
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // Preferences and settings
  preferences: {
    communication: {
      preferredMethod: {
        type: String,
        enum: ['email', 'phone', 'sms', 'app'],
        default: 'email'
      },
      language: { type: String, default: 'en' }
    },
    business: {
      operatingHours: {
        monday: { start: String, end: String },
        tuesday: { start: String, end: String },
        wednesday: { start: String, end: String },
        thursday: { start: String, end: String },
        friday: { start: String, end: String },
        saturday: { start: String, end: String },
        sunday: { start: String, end: String }
      },
      holidaySchedule: [Date]
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
organizationSchema.index({ name: 'text' });
organizationSchema.index({ organizationType: 1, isActive: 1 });
organizationSchema.index({ 'contact.address.city': 1 });
organizationSchema.index({ verified: 1 });

// Virtual for organization summary
organizationSchema.virtual('summary').get(function() {
  return {
    name: this.name,
    type: this.organizationType,
    location: this.contact?.address?.city,
    status: this.operationalStatus,
    verified: this.verified
  };
});

// Instance method to calculate organization score
organizationSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Base score for verification
  if (this.verified) score += 20;
  
  // Performance metrics
  if (this.metrics?.satisfactionRating) {
    score += (this.metrics.satisfactionRating / 5) * 30;
  }
  
  // Compliance
  const complianceScore = Object.values(this.complianceStatus).filter(Boolean).length;
  score += (complianceScore / 4) * 20;
  
  // Activity level
  if (this.operationalStatus === 'active') score += 15;
  
  // Documentation
  if (this.documents?.length > 0) score += 10;
  
  // Contact completeness
  if (this.contact?.email && this.contact?.phone) score += 5;
  
  return Math.round(score);
};


Organization.init({
  // ...fields above...
}, {
  sequelize,
  modelName: 'Organization',
  tableName: 'organizations',
  timestamps: true
});

// Static method to get organization statistics
Organization.getOrganizationStatistics = async function() {
  const { fn, col } = require('sequelize');
  
  const stats = await this.findAll({
    attributes: [
      'organizationType',
      [fn('COUNT', '*'), 'count'],
      [fn('SUM', 
        this.sequelize.literal(`CASE WHEN verified = true THEN 1 ELSE 0 END`)
      ), 'verified'],
      [fn('SUM', 
        this.sequelize.literal(`CASE WHEN operationalStatus = 'active' THEN 1 ELSE 0 END`)
      ), 'active']
    ],
    group: ['organizationType']
  });
  
  return stats;
};

module.exports = Organization;