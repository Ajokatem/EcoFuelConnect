const express = require('express');
const router = express.Router();
const db = require('../config/database').sequelize;

// Chatbot query
router.post('/query', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    const searchTerm = `%${message.toLowerCase()}%`;
    
    // Simple keyword search with proper Sequelize binding
    const [matches] = await db.query(
      `SELECT * FROM chatbot_knowledge 
       WHERE LOWER(keyword) LIKE :search OR LOWER(question) LIKE :search OR LOWER(answer) LIKE :search
       ORDER BY usageCount DESC LIMIT 1`,
      { replacements: { search: searchTerm } }
    );

    let response;

    if (matches.length > 0) {
      response = matches[0].answer;
      await db.query(
        'UPDATE chatbot_knowledge SET usageCount = usageCount + 1 WHERE id = :id',
        { replacements: { id: matches[0].id } }
      );
    } else {
      response = "I'm not sure about that. Try asking about: starting biogas production, maintenance, safety, or temperature control.";
    }

    // Save conversation
    await db.query(
      `INSERT INTO chatbot_conversations (userId, sessionId, userMessage, botResponse)
       VALUES (:userId, :sessionId, :userMessage, :botResponse)`,
      { replacements: { userId: userId || null, sessionId, userMessage: message, botResponse: response } }
    );

    res.json({ success: true, response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const [conversations] = await db.query(
      `SELECT * FROM chatbot_conversations WHERE sessionId = :sessionId ORDER BY createdAt ASC`,
      { replacements: { sessionId: req.params.sessionId } }
    );
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Feedback on response
router.post('/feedback', async (req, res) => {
  try {
    const { conversationId, wasHelpful } = req.body;
    await db.query(
      'UPDATE chatbot_conversations SET wasHelpful = :wasHelpful WHERE id = :id',
      { replacements: { wasHelpful, id: conversationId } }
    );
    res.json({ success: true, message: 'Feedback recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
