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
            content: 'You are a biogas production expert assistant. Provide helpful, accurate, and concise answers about biogas production, waste management, maintenance, troubleshooting, and safety. Keep responses under 150 words.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
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
    return 'I can help with biogas questions! Ask about: what is biogas, how to start, temperature, pH levels, feeding, gas leaks, maintenance, safety, or troubleshooting.';
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
    const searchTerm = `%${message.toLowerCase()}%`;
    
    let response;
    let source = 'database';

    try {
      // Try database first
      const [matches] = await db.query(
        `SELECT * FROM chatbot_knowledge 
         WHERE LOWER(keyword) LIKE :search OR LOWER(question) LIKE :search OR LOWER(answer) LIKE :search
         ORDER BY usageCount DESC LIMIT 1`,
        { replacements: { search: searchTerm } }
      );

      if (matches.length > 0) {
        response = matches[0].answer;
        await db.query(
          'UPDATE chatbot_knowledge SET usageCount = usageCount + 1 WHERE id = :id',
          { replacements: { id: matches[0].id } }
        );
      } else {
        // Use AI if no database match
        response = await getAIResponse(message);
        source = 'ai';
      }
    } catch (dbError) {
      // If database fails, use AI
      response = await getAIResponse(message);
      source = 'ai';
    }

    // Save conversation if database available
    try {
      await db.query(
        `INSERT INTO chatbot_conversations (userId, sessionId, userMessage, botResponse)
         VALUES (:userId, :sessionId, :userMessage, :botResponse)`,
        { replacements: { userId: userId || null, sessionId, userMessage: message, botResponse: response } }
      );
    } catch (saveError) {
      console.log('Could not save conversation:', saveError.message);
    }

    res.json({ success: true, response, source });
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
