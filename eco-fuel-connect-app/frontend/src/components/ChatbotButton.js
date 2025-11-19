import React, { useState } from 'react';
import BiogasChatbot from './BiogasChatbot';

const ChatbotButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  return (
    <>
      <div
        onClick={() => setShowChat(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9998,
        }}
      >
        {showLabel && (
          <div
            style={{
              backgroundColor: 'white',
              color: '#25805a',
              padding: '10px 16px',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            Need help with Biogas? Ask me! 
          </div>
        )}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#25805a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 128, 90, 0.4)',
            fontSize: '28px',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Biogas Assistant"
        >
          💬
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <BiogasChatbot show={showChat} onHide={() => setShowChat(false)} />
    </>
  );
};

export default ChatbotButton;
