import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
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
      // Fetch suggestions first
      axios.get('/api/chatbot/suggestions')
        .then(res => {
          setSuggestions(res.data.suggestions || []);
          setMessages([{
            type: 'bot',
            text: 'Hi! 👋 I\'m your Biogas Assistant. Choose a question below or type your own:',
            timestamp: new Date()
          }]);
        })
        .catch(() => {
          setSuggestions([]);
          setMessages([{
            type: 'bot',
            text: 'Hi! 👋 I\'m your Biogas Assistant. Ask me anything about biogas production!',
            timestamp: new Date()
          }]);
        });
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
      // Try API call first
      const response = await axios.post('/api/chatbot/query', {
        message: messageText,
        sessionId,
        userId: localStorage.getItem('userId')
      });

      const botMessage = {
        type: 'bot',
        text: response.data.response || 'I received your question but couldn\'t find a specific answer. Please try rephrasing or ask about biogas production, maintenance, or safety.',
        timestamp: new Date(),
        articleId: response.data.relatedArticleId
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Fallback responses if API fails
      const fallbackResponses = {
        'start': 'To start biogas production: 1) Set up your digester 2) Mix organic waste with water (1:1 ratio) 3) Add starter culture 4) Maintain temperature 30-40°C 5) Wait 15-30 days for first gas.',
        'maintenance': 'Daily maintenance: Check temperature, stir mixture, add feedstock. Weekly: Check pH levels, inspect for leaks. Monthly: Clean inlet/outlet, check gas pressure.',
        'help': 'I can help you with: biogas production, maintenance, troubleshooting, waste types, safety, and temperature control. What would you like to know?',
        'safety': 'Biogas safety tips: 1) Ensure good ventilation 2) Check for leaks regularly 3) No open flames near digester 4) Use proper equipment 5) Train all users.',
        'temperature': 'Optimal temperature: 30-40°C (86-104°F). Below 20°C: production slows. Above 45°C: bacteria die. Use insulation in cold weather.'
      };
      
      const lowerInput = messageText.toLowerCase();
      let response = 'I\'m currently having trouble connecting to my knowledge base. However, I can still help! Try asking about: starting biogas production, maintenance, safety, or temperature control.';
      
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
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
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: '#25805a',
              border: 'none',
              borderRadius: '24px',
              padding: '10px 24px',
              fontWeight: '600',
              minWidth: '80px'
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
