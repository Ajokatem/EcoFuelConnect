const express = require('express');
const ContactMessage = require('../models/contactmessage');
const nodemailer = require('nodemailer');
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

    // Save to database
    let savedMessage;
    try {
      savedMessage = await ContactMessage.create({
        firstName,
        lastName,
        email,
        subject,
        message
      });
      console.log('Contact message saved to DB:', savedMessage.toJSON());
    } catch (dbError) {
      console.error('Failed to save contact message:', dbError);
      return res.status(500).json({ success: false, error: 'Failed to save message to database.' });
    }

        // Send email to admin using nodemailer
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.CONTACT_EMAIL_USER,
              pass: process.env.CONTACT_EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `${firstName} ${lastName} <${email}>`,
            to: process.env.CONTACT_EMAIL_RECEIVER,
            subject: `[EcoFuelConnect Contact] ${subject}`,
            text: `Message from ${firstName} ${lastName} (${email}):\n\n${message}`
          };

          await transporter.sendMail(mailOptions);
          console.log('Contact email sent to admin:', mailOptions);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the request if email fails
        }

    res.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.',
      messageId: savedMessage.id
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