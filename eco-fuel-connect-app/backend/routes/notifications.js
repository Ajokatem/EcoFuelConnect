const { auth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/notifications - Get all notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('\n📬 GET /api/notifications - User ID:', req.user.id);
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    console.log('📬 Found', notifications.length, 'notifications for user', req.user.id);
    
    const processedNotifications = notifications.map(n => {
      const obj = n.toJSON();
      obj.datetime = obj.createdAt;
      return obj;
    });
    
    res.json(processedNotifications);
  } catch (error) {
    console.error('❌ Error fetching notifications:', error.message);
    res.json([]);
  }
});

// POST /api/notifications/:id/read - Mark notification as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await notification.update({ read: true, isRead: true });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Error marking notification as read' });
  }
});

// POST /api/notifications/:id/confirm - Confirm notification (for producers)
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await notification.update({ read: true, status: 'confirmed' });

    res.json({
      success: true,
      message: 'Notification confirmed'
    });
  } catch (error) {
    console.error('Error confirming notification:', error);
    res.status(500).json({ success: false, message: 'Error confirming notification' });
  }
});

// POST /api/notifications/:id/pending - Mark as pending (for schools/suppliers)
router.post('/:id/pending', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await notification.update({ status: 'pending' });

    res.json({
      success: true,
      message: 'Notification marked as pending'
    });
  } catch (error) {
    console.error('Error marking notification as pending:', error);
    res.status(500).json({ success: false, message: 'Error marking notification as pending' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Error deleting notification' });
  }
});

module.exports = router;
