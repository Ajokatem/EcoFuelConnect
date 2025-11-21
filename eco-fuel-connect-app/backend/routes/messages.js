const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const { Op, fn, col, literal } = require('sequelize');
const Notification = require('../models/Notification');

router.get('/chat-users', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const { sequelize } = require('../config/database');
    
    const users = await sequelize.query(`
      SELECT DISTINCT u.id, u."firstName", u."lastName", u.role, u.organization, u."profilePhoto", u."profileImage",
        (SELECT COUNT(*) FROM messages WHERE "senderId" = u.id AND "receiverId" = ? AND "isRead" = false) as unreadCount,
        (SELECT content FROM messages WHERE ("senderId" = u.id AND "receiverId" = ?) OR ("senderId" = ? AND "receiverId" = u.id) ORDER BY "sentAt" DESC LIMIT 1) as lastMessage,
        (SELECT "sentAt" FROM messages WHERE ("senderId" = u.id AND "receiverId" = ?) OR ("senderId" = ? AND "receiverId" = u.id) ORDER BY "sentAt" DESC LIMIT 1) as lastMessageTime
      FROM users u
      WHERE u."isActive" = true AND u.id != ? AND EXISTS (
        SELECT 1 FROM messages WHERE ("senderId" = u.id AND "receiverId" = ?) OR ("senderId" = ? AND "receiverId" = u.id)
      )
      ORDER BY COALESCE(lastMessageTime, '1970-01-01') DESC
    `, {
      replacements: [req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id],
      type: sequelize.QueryTypes.SELECT
    });
    
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.json({ success: true, users: [] });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Receiver and content required' });
    }
    
    if (!Message) {
      console.error('Message model not found');
      return res.status(500).json({ success: false, message: 'Messaging not available' });
    }
    
    const message = await Message.create({
      senderId: req.user.id,
      receiverId: parseInt(receiverId),
      content: content.trim(),
      sentAt: new Date()
    }).catch(err => {
      console.error('Message create error:', err.message);
      throw err;
    });

    const User = require('../models/User');
    const sender = await User.findByPk(req.user.id, { attributes: ['firstName', 'lastName', 'profilePhoto'] });
    
    if (Notification) {
      await Notification.create({
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `${sender.firstName} ${sender.lastName}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        isRead: false
      }).catch(err => console.error('Notification error:', err.message));
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiverId}`).emit('receive_message', {
        id: message.id,
        senderId: req.user.id,
        senderName: `${sender.firstName} ${sender.lastName}`,
        senderPhoto: sender.profilePhoto,
        content: message.content,
        sentAt: message.sentAt,
        isRead: false
      });
    }
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/with/:userId', auth, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    const { limit = 50, offset = 0 } = req.query;
    
    if (!Message) {
      console.error('Message model not found');
      return res.json({ success: true, messages: [] });
    }
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id }
        ]
      },
      order: [['sentAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    }).catch(err => {
      console.error('Message query error:', err.message);
      return [];
    });
    
    if (messages && messages.length > 0) {
      await Message.update(
        { isRead: true },
        { where: { senderId: otherUserId, receiverId: req.user.id, isRead: false } }
      ).catch(err => console.error('Mark read error:', err.message));
    }
    
    res.json({ success: true, messages: messages ? messages.reverse() : [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.json({ success: true, messages: [] });
  }
});

router.post('/mark-read/:userId', auth, async (req, res) => {
  try {
    await Message.update(
      { isRead: true },
      { where: { senderId: parseInt(req.params.userId), receiverId: req.user.id, isRead: false } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.count({
      where: { receiverId: req.user.id, isRead: false }
    });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message || (message.senderId !== req.user.id && message.receiverId !== req.user.id)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    await message.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, messages: [] });
    
    const messages = await Message.findAll({
      where: {
        [Op.and]: [
          { [Op.or]: [
            { senderId: req.user.id },
            { receiverId: req.user.id }
          ]},
          { content: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['sentAt', 'DESC']],
      limit: 20
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
