const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, organization, phone, bio, profilePhoto } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Update user fields
    await user.update({
      firstName: firstName !== undefined ? firstName : user.firstName,
      lastName: lastName !== undefined ? lastName : user.lastName,
      email: email !== undefined ? email : user.email,
      organization: organization !== undefined ? organization : user.organization,
      phone: phone !== undefined ? phone : user.phone,
      bio: bio !== undefined ? bio : user.bio,
      profilePhoto: profilePhoto !== undefined ? profilePhoto : user.profilePhoto
    });
    
    // Return updated user without password
    const updatedUser = user.toJSON();
    delete updatedUser.password;
    
    res.json({ success: true, user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile', message: error.message });
  }
});

// GET /api/users - Get all users or filtered
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const { Op } = require('sequelize');
    const { sequelize } = require('../config/database');
    const currentUser = await User.findByPk(req.user.id);
    
    let where = { 
      id: { [Op.ne]: req.user.id },
      isActive: true
    };
    
    // Role-based filtering
    if (currentUser.role === 'school' || currentUser.role === 'supplier') {
      where.role = 'producer';
    } else if (currentUser.role === 'producer') {
      where.role = { [Op.in]: ['school', 'supplier'] };
    }
    // Admin sees all roles
    
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      where[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('firstName')), { [Op.like]: `%${searchTerm}%` }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('lastName')), { [Op.like]: `%${searchTerm}%` })
      ];
    }
    
    const users = await User.findAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'organization', 'email', 'phone', 'role', 'isActive', 'profilePhoto', 'profileImage', 'bio', 'createdAt'],
      order: [['firstName', 'ASC']]
    });
    
    console.log(`✓ Search by ${currentUser.role}: "${search}" | Found ${users.length} users`);
    return res.status(200).json({ success: true, users, producers: users });
  } catch (error) {
    console.error('✗ Error fetching users:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch users', message: error.message });
  }
});

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.update(req.body);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

module.exports = router;
