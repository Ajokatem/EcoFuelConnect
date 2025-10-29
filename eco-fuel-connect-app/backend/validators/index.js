const Joi = require('joi');

// User validation schemas
const userValidation = {
  register: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    organization: Joi.string().max(100).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    organization: Joi.string().max(100).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional()
  })
};

// Waste entry validation schemas
const wasteValidation = {
  create: Joi.object({
    wasteType: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    unit: Joi.string().valid('kg', 'tons', 'liters').default('kg'),
    source: Joi.string().required(),
    supplierName: Joi.string().required(),
    supplierId: Joi.string().optional(),
    notes: Joi.string().max(500).optional(),
    entryDate: Joi.date().optional()
  }),

  update: Joi.object({
    wasteType: Joi.string().optional(),
    quantity: Joi.number().positive().optional(),
    unit: Joi.string().valid('kg', 'tons', 'liters').optional(),
    source: Joi.string().optional(),
    supplierName: Joi.string().optional(),
    supplierId: Joi.string().optional(),
    notes: Joi.string().max(500).optional()
  })
};

// Fuel request validation schemas
const fuelRequestValidation = {
  create: Joi.object({
    schoolName: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    unit: Joi.string().valid('liters', 'kg').default('liters'),
    contactNumber: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).required(),
    deliveryDate: Joi.date().min('now').required(),
    location: Joi.string().required(),
    urgencyLevel: Joi.string().valid('low', 'medium', 'high').default('medium'),
    notes: Joi.string().max(500).optional()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'approved', 'in-progress', 'completed', 'cancelled', 'rejected').required(),
    notes: Joi.string().max(500).optional()
  })
};

// Content validation schemas
const contentValidation = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().min(10).required(),
    summary: Joi.string().max(500).optional(),
    category: Joi.string().valid('Biogas Basics', 'Waste Management', 'Environment & Health', 'Community Impact', 'Innovation', 'Getting Started').required(),
    tags: Joi.string().optional(),
    published: Joi.boolean().default(false),
    featured: Joi.boolean().default(false),
    imageUrl: Joi.string().uri().optional()
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    content: Joi.string().min(10).optional(),
    summary: Joi.string().max(500).optional(),
    category: Joi.string().valid('Biogas Basics', 'Waste Management', 'Environment & Health', 'Community Impact', 'Innovation', 'Getting Started').optional(),
    tags: Joi.string().optional(),
    published: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    imageUrl: Joi.string().uri().optional()
  })
};

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

module.exports = {
  userValidation,
  wasteValidation,
  fuelRequestValidation,
  contentValidation,
  validateRequest
};