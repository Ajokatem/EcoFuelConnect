const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, organization, phone, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      organization: organization || user.organization,
      phone: phone || user.phone,
      bio: bio || user.bio
    });
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/users?role=producer&isActive=true
router.get('/', async (req, res) => {
  try {
    const { role, isActive } = req.query;
    let where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const producers = await User.findAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'organization', 'email', 'phone', 'role']
    });
    
    console.log(`Fetched ${producers.length} producers`);
    res.json({ producers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
