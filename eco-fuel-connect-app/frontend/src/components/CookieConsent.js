import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      zIndex: 9999,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h5 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>🍪 We Use Cookies</h5>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            We use cookies to enhance your experience, analyze site traffic, and personalize content. By clicking "Accept", you consent to our use of cookies.
          </p>
        </div>
        <Button 
          onClick={handleAccept}
          style={{
            backgroundColor: '#27ae60',
            border: 'none',
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '5px'
          }}
        >
          Accept & Continue
        </Button>
      </div>
    </div>
  );
}

export default CookieConsent;
