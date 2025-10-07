const mongoose = require('mongoose');

const fuelRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: {
      values: ['biogas', 'biomethane', 'bioethanol', 'bio_diesel'],
      message: 'Invalid fuel type selected'
    }
  },
  fuelDetails: {
    name: String,
    description: String,
    pricePerUnit: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive']
    },
    unit: {
      type: String,
      required: true,
      enum: ['cubic meter', 'liter', 'kilogram', 'gallon']
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be greater than 0']
  },
  totalCost: {
    type: Number,
    required: true,
    min: [0, 'Total cost must be positive']
  },
  deliveryAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryInstructions: String
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    email: String,
    alternateContact: String
  },
  preferredDeliveryDate: {
    type: Date,
    required: [true, 'Preferred delivery date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Delivery date must be in the future'
    }
  },
  urgency: {
    type: String,
    enum: ['low', 'normal', 'medium', 'high'],
    default: 'normal'
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    maxlength: [500, 'Purpose cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'processing', 'in_transit', 'delivered', 'cancelled', 'rejected'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  approval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String
  },
  delivery: {
    assignedDriver: String,
    vehicleInfo: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    deliveryNotes: String,
    deliveryConfirmation: {
      receivedBy: String,
      signature: String,
      timestamp: Date
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'mobile_money'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  additionalNotes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate unique request ID before saving
fuelRequestSchema.pre('save', async function(next) {
  if (!this.requestId) {
    const count = await this.constructor.countDocuments();
    this.requestId = `FR${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate total cost
  if (this.fuelDetails && this.fuelDetails.pricePerUnit && this.quantity) {
    this.totalCost = this.fuelDetails.pricePerUnit * this.quantity;
  }
  
  next();
});

// Add status to history when status changes
fuelRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Static method to get request statistics
fuelRequestSchema.statics.getStats = function(userId = null) {
  const matchStage = userId ? { user: userId } : {};
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        processing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
        delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
        totalValue: { $sum: '$totalCost' },
        avgOrderValue: { $avg: '$totalCost' }
      }
    }
  ]);
};

// Instance method to check if request can be cancelled
fuelRequestSchema.methods.canBeCancelled = function() {
  return ['pending', 'approved'].includes(this.status);
};

// Instance method to update status
fuelRequestSchema.methods.updateStatus = function(newStatus, updatedBy = null, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    updatedBy,
    notes
  });
  return this.save();
};

module.exports = mongoose.model('FuelRequest', fuelRequestSchema);