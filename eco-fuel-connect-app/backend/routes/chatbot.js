const express = require('express');
const router = express.Router();
const db = require('../config/database').sequelize;
const axios = require('axios');
const { HfInference } = require('@huggingface/inference');

// Smart AI responses
const getAIResponse = async (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Comprehensive biogas knowledge base
  const responses = {
    'hi': 'Hello! 👋 I\'m your Biogas Assistant. I can help you with biogas production, maintenance, troubleshooting, and safety. What would you like to know?',
    'hello': 'Hi there! 👋 I\'m here to help with all your biogas questions. Ask me anything!',
    'hey': 'Hey! 👋 Ready to help with biogas production. What\'s your question?',
    'what is biogas': 'Biogas is a renewable energy produced when bacteria break down organic waste in an oxygen-free environment. It contains 50-75% methane (CH4) and can be used for cooking, heating, and electricity generation.',
    'how to start': 'To start biogas production: 1) Build/buy a digester, 2) Fill with water (50%), 3) Add starter (cow dung), 4) Feed daily with organic waste, 5) Maintain 20-35°C, 6) Wait 15-30 days for gas production.',
    'temperature': 'Optimal temperature: 30-35°C. Minimum: 20°C. Tips: Insulate digester, use black paint for heat absorption, consider underground installation, add hot water if needed.',
    'ph level': 'Ideal pH: 6.5-7.5. Too acidic? Add lime/wood ash. Too alkaline? Add organic acids. Test weekly with pH strips.',
    'feeding': 'Feed daily! Good: kitchen scraps, animal manure, crop residues. Avoid: plastics, metals, chemicals. Ratio: 1 part waste to 1 part water.',
    'gas leak': 'Detection: Mix soap with water, apply to joints/pipes, look for bubbles. Fix: Tighten connections, replace damaged parts. NEVER use flame to check!',
    'maintenance': 'Daily: Feed, check temperature. Weekly: Test pH, check leaks. Monthly: Remove sludge, clean filters. Yearly: Deep clean, replace parts.',
    'safety': 'Biogas is flammable! Ensure ventilation, no smoking near digester, install pressure valve, keep fire extinguisher, regular leak checks.',
    'not working': 'Common issues: 1) Low temperature (<20°C), 2) Wrong pH (not 6.5-7.5), 3) Insufficient feeding, 4) Gas leaks, 5) Water imbalance, 6) Toxic materials.',
    'waste types': 'Best: Cow/pig manure, kitchen waste, crop residues, grass. Good: Food scraps, vegetable waste. Avoid: Meat, bones, oils, chemicals, plastics.',
  };
  
  // Match question to response
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) return value;
  }
  
  // Greetings
  if (lowerMsg === 'hi' || lowerMsg === 'hello' || lowerMsg === 'hey') {
    return responses[lowerMsg] || responses['hi'];
  }
  
  // Partial matches
  if (lowerMsg.includes('biogas')) return responses['what is biogas'];
  if (lowerMsg.includes('start') || lowerMsg.includes('begin')) return responses['how to start'];
  if (lowerMsg.includes('temp')) return responses['temperature'];
  if (lowerMsg.includes('ph') || lowerMsg.includes('acid')) return responses['ph level'];
  if (lowerMsg.includes('feed') || lowerMsg.includes('waste')) return responses['feeding'];
  if (lowerMsg.includes('leak')) return responses['gas leak'];
  if (lowerMsg.includes('maintain') || lowerMsg.includes('clean')) return responses['maintenance'];
  if (lowerMsg.includes('safe')) return responses['safety'];
  if (lowerMsg.includes('not') || lowerMsg.includes('problem') || lowerMsg.includes('issue')) return responses['not working'];
  
  return "I can help with biogas questions! Ask about: what is biogas, how to start, temperature, pH levels, feeding, gas leaks, maintenance, safety, or troubleshooting.";
};

// Chatbot query
// Get suggested questions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    { id: 1, question: 'What is biogas?', icon: '💡' },
    { id: 2, question: 'How do I start producing biogas?', icon: '🚀' },
    { id: 3, question: 'Why is my digester not working?', icon: '⚠️' },
    { id: 4, question: 'How to control temperature?', icon: '🌡️' },
    { id: 5, question: 'How to check for gas leaks?', icon: '🔍' },
    { id: 6, question: 'What waste can I use?', icon: '♻️' },
    { id: 7, question: 'How to maintain pH levels?', icon: '⚗️' },
    { id: 8, question: 'What are safety precautions?', icon: '🛡️' }
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
