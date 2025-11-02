const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users?role=producer&isActive=true
router.get('/', async (req, res) => {
  try {
    const { role, isActive } = req.query;
    let where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    const producers = await User.findAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'organization', 'email', 'phone']
    });
    res.json({ producers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
