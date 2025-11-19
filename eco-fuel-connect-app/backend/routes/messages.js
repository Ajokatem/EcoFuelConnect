const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const { Op } = require('sequelize');
const Notification = require('../models/Notification');

// Get all users for chat - show ALL active users so anyone can chat with anyone
router.get('/chat-users', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const User = require('../models/User');
    
    // Show ALL active users except current user
    const users = await User.findAll({
      where: { 
        isActive: true,
        id: { [Op.ne]: currentUserId } // Exclude self
      },
      attributes: ['id', 'firstName', 'lastName', 'role', 'organization', 'email', 'phone', 'profilePhoto', 'profileImage', 'bio'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ users });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ success: false, message: 'Error fetching chat users' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Receiver and content required' });
    }
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content,
      sentAt: new Date()
    });
    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      type: 'message',
      title: 'New Message Received',
      message: `You received a message from ${req.user.firstName} ${req.user.lastName}`,
      isRead: false,
      relatedId: message.id,
      metadata: JSON.stringify({ senderId: req.user.id, receiverId, messageId: message.id })
    });

    // If sender is producer, notify the original sender (supplier/school) that their message was replied to
    // Or, if receiver is producer, notify producer that a new message was sent
    // This logic ensures both sides get notified
    const senderUser = await require('../models/User').findByPk(req.user.id);
    const receiverUser = await require('../models/User').findByPk(receiverId);
    if (senderUser.role === 'producer' && receiverUser.role !== 'producer') {
      await Notification.create({
        userId: receiverId,
        type: 'message',
        title: 'Reply from Producer',
        message: `Producer ${senderUser.firstName} ${senderUser.lastName} replied to your message`,
        isRead: false,
        relatedId: message.id,
        metadata: JSON.stringify({ senderId: req.user.id, receiverId, messageId: message.id })
      });
    } else if (receiverUser.role === 'producer' && senderUser.role !== 'producer') {
      await Notification.create({
        userId: receiverId,
        type: 'message',
        title: 'New Message from Supplier/School',
        message: `${senderUser.firstName} ${senderUser.lastName} sent you a message`,
        isRead: false,
        relatedId: message.id,
        metadata: JSON.stringify({ senderId: req.user.id, receiverId, messageId: message.id })
      });
    }
    // Emit real-time message to receiver if they're online
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiverId}`).emit('new_message', {
        id: message.id,
        senderId: req.user.id,
        senderName: `${req.user.firstName} ${req.user.lastName}`,
        content: message.content,
        sentAt: message.sentAt
      });
    }
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

// Get messages between two users
router.get('/with/:userId', auth, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id }
        ]
      },
      order: [['sentAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
});

// Mark message as read
router.post('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message || message.receiverId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Message not found or access denied' });
    }
    message.isRead = true;
    await message.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ success: false, message: 'Error marking as read' });
  }
});

module.exports = router;
