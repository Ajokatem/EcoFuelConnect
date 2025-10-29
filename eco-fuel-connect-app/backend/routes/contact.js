const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security middleware
router.use(helmet());

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many contact form submissions, please try again later.' }
});

router.use(contactLimiter);

// Validation middleware
const validateContact = [
  body('firstName').trim().isLength({ min: 1 }).escape().withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).escape().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 1, max: 200 }).escape().withMessage('Subject is required and must be less than 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).escape().withMessage('Message must be between 10 and 2000 characters')
];

// POST /api/contact
router.post('/', validateContact, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { firstName, lastName, email, subject, message } = req.body;
    
    // Simple in-memory storage for demo (replace with actual database)
    const contactMessage = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: 'received'
    };

    // Log the message (in production, save to database)
    console.log('Contact message received:', contactMessage);

    // Simulate email sending (replace with actual email service)
    try {
      // In production, implement actual email sending here
      console.log(`Email would be sent to admin about: ${subject}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.',
      messageId: contactMessage.id
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error. Please try again later.' 
    });
  }
});

module.exports = router;