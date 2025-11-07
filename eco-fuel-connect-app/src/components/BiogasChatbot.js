import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const BiogasChatbot = ({ show, onHide }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (show && messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: 'Hi! I\'m your Biogas Assistant. Ask me anything about:\n\n• Starting biogas production\n• Daily maintenance\n• Troubleshooting issues\n• Safety procedures\n• Temperature control\n• Waste types and ratios\n\nWhat would you like to know?',
        timestamp: new Date()
      }]);
    }
  }, [show, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { type: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Try API call first
      const response = await axios.post('/api/chatbot/query', {
        message: currentInput,
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
      
      const lowerInput = currentInput.toLowerCase();
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
             Biogas Assistant
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Ask me anything about biogas production
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
            placeholder="Type your question here..."
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
            {loading ? '...' : 'Send'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BiogasChatbot;
