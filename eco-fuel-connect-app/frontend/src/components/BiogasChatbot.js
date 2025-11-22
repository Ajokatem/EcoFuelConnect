import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import chatbotService from '../services/chatbotService';
import { useLanguage } from '../contexts/LanguageContext';

const BiogasChatbot = ({ show, onHide }) => {
  const { translate } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (show && messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: 'Hi! 👋 I\'m your Biogas Expert. Ask me about biogas production, maintenance, troubleshooting, safety, or any related topic!',
        timestamp: new Date()
      }]);
    }
  }, [show, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text = null) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    setShowSuggestions(false);
    const userMessage = { type: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.query(messageText, sessionId, localStorage.getItem('userId'));
      const botMessage = {
        type: 'bot',
        text: response.response || 'I received your question but couldn\'t find a specific answer. Please try rephrasing or ask about biogas production, maintenance, or safety.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      const lowerInput = messageText.toLowerCase();
      const knowledge = {
        'biogas': 'Biogas is renewable energy from organic waste breakdown in oxygen-free conditions. Contains 50-75% methane (CH4). Used for cooking, heating, electricity. Reduces emissions and manages waste sustainably.',
        'start': 'To start: 1) Get/build digester 2) Fill 50% with water 3) Add cow dung starter 4) Feed daily (waste:water 1:1) 5) Keep 30-35°C 6) Wait 15-30 days for gas.',
        'temperature': 'Optimal: 30-35°C. Minimum: 20°C. Maximum: 40°C (bacteria die above 45°C). Tips: Insulate, paint black, install underground, add hot water in cold weather.',
        'ph': 'Ideal pH: 6.5-7.5. Too acidic? Add lime/wood ash. Too alkaline? Add organic acids. Test weekly. Maintain stable pH for bacteria.',
        'feed': 'Feed daily. Good: kitchen scraps, manure, crop waste, grass. Avoid: meat, bones, oils, plastics, chemicals. Ratio: 1:1 waste to water. Chop small.',
        'leak': 'Detect leaks: Mix soap+water, apply to joints/pipes, look for bubbles. NEVER use flame! Fix: Tighten connections, replace seals. Check regularly.',
        'maintenance': 'Daily: Feed, check temp. Weekly: Test pH, check leaks. Monthly: Remove sludge, clean pipes. Yearly: Deep clean, replace parts.',
        'safety': 'Safety: 1) Good ventilation 2) No smoking near digester 3) Install pressure valve 4) Check leaks regularly 5) Use proper appliances 6) Keep fire extinguisher 7) Train users.',
        'problem': 'Common issues: Low temp (<20°C), wrong pH, overfeeding, gas leaks, toxic materials, insufficient bacteria, water imbalance. Check each.',
        'waste': 'Best: Cow dung, pig manure, kitchen waste, vegetable scraps, crop residues, grass. Avoid: Meat, bones, oils, plastics, metals, chemicals.',
        'production': 'Yield: Cow dung 0.3-0.4 m³/kg, Pig manure 0.5-0.6 m³/kg, Kitchen waste 0.4-0.5 m³/kg. Factors: temp, pH, retention time (20-30 days).',
        'cost': 'Small (2-4 m³): $300-800. Medium (6-10 m³): $1,500-3,000. Large (20+ m³): $5,000+. Payback: 2-4 years.',
        'benefit': 'Benefits: Free energy, reduces costs, organic fertilizer, cuts emissions, improves sanitation, creates jobs, energy independence.'
      };
      
      let response = null;
      for (const [key, value] of Object.entries(knowledge)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }
      
      if (!response) {
        response = 'Ask me about: biogas basics, how to start, temperature control, pH levels, feeding, gas leaks, maintenance, safety, troubleshooting, waste types, production rates, costs, or benefits.';
      }
      
      setMessages(prev => [...prev, {
        type: 'bot',
        text: response,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      style={{ zIndex: 9999 }}
      dialogClassName="chatbot-modal"
    >
      <style>{`
        .chatbot-modal .modal-content {
          border-radius: 16px;
          border: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .chatbot-modal .modal-header {
          border: none;
          padding: 20px 24px;
        }
        .chatbot-modal .modal-body {
          padding: 0 24px 24px 24px;
        }
      `}</style>
      <Modal.Header closeButton style={{ backgroundColor: '#f8fafc', border: 'none' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#25805a', marginBottom: '4px' }}>
             {translate('chatbot')}
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            {translate('howCanIHelp')}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body style={{ height: '500px', display: 'flex', flexDirection: 'column', padding: '0 24px 24px 24px' }}>
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          {showSuggestions && suggestions.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>Quick Questions:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSend(s.question)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: '1px solid #25805a',
                      backgroundColor: 'white',
                      color: '#25805a',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#25805a';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = '#25805a';
                    }}
                  >
                    {s.icon} {s.question}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: msg.type === 'user' ? '#25805a' : 'white',
                color: msg.type === 'user' ? 'white' : '#333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</div>
                <small style={{ 
                  display: 'block', 
                  marginTop: '6px', 
                  opacity: 0.7, 
                  fontSize: '11px' 
                }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <span style={{ color: '#25805a' }}>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Form.Control
            type="text"
            placeholder={translate('askQuestion')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            style={{ 
              borderRadius: '24px',
              border: '2px solid #e5e7eb',
              padding: '10px 20px',
              fontSize: '14px'
            }}
          />
          <Button
            type="button"
            onClick={() => handleSend()}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleSend();
            }}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: '#25805a',
              border: 'none',
              borderRadius: '24px',
              padding: '10px 24px',
              fontWeight: '600',
              minWidth: '80px',
              touchAction: 'manipulation'
            }}
          >
            {loading ? '...' : translate('send')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BiogasChatbot;
