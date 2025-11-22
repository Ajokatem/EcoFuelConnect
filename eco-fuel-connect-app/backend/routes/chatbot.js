const express = require('express');
const router = express.Router();
const db = require('../config/database').sequelize;
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-proj-your-key-here';

const getAIResponse = async (message) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert biogas production consultant with 20+ years of experience. Answer ALL questions about biogas production, anaerobic digestion, waste management, maintenance, troubleshooting, safety, equipment, costs, benefits, and related topics. Provide detailed, accurate, practical answers. If asked about biogas, always give a complete helpful response. Keep answers under 200 words but be thorough.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw new Error('Unable to connect to AI service. Please check your API key configuration.');
  }
};

// Chatbot query
// Get suggested questions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    { id: 1, question: 'What is biogas?', icon: '💡' },
    { id: 2, question: 'How do I start producing biogas?', icon: '' },
    { id: 3, question: 'Why is my digester not working?', icon: '' },
    { id: 4, question: 'How to control temperature?', icon: '' },
    { id: 5, question: 'How to check for gas leaks?', icon: '' },
    { id: 6, question: 'What waste can I use?', icon: '' },
    { id: 7, question: 'How to maintain pH levels?', icon: '' },
    { id: 8, question: 'What are safety precautions?', icon: '' }
  ];
  res.json({ success: true, suggestions });
});

router.post('/query', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    
    const response = await getAIResponse(message);

    try {
      await db.query(
        `INSERT INTO chatbot_conversations (userId, sessionId, userMessage, botResponse)
         VALUES (:userId, :sessionId, :userMessage, :botResponse)`,
        { replacements: { userId: userId || null, sessionId, userMessage: message, botResponse: response } }
      );
    } catch (saveError) {
      console.log('Could not save conversation:', saveError.message);
    }

    res.json({ success: true, response, source: 'ai' });
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
