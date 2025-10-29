import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function Welcome() {
  const history = useHistory();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [countdown, setCountdown] = useState(5);

  const loadingMessages = [
    "Welcome to EcoFuelConnect...",
    "Connecting to sustainable future...",
    "Loading eco-friendly solutions...",
    "Preparing your dashboard...",
    "Redirecting to login..."
  ];

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // User is already logged in, redirect to dashboard
      history.push('/admin/dashboard');
      return;
    }

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20; // Complete in 5 seconds
      });
    }, 1000);

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const next = (prev + 1) % loadingMessages.length;
        return next;
      });
    }, 1000);

    // Countdown and redirect after 5 seconds
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          // Redirect to login page
          history.push('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearInterval(countdownInterval);
    };
  }, [history]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #25805a 0%, #1e6b47 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          fontSize: '3rem',
          color: 'white',
          boxShadow: '0 10px 30px rgba(37, 128, 90, 0.3)'
        }}
      >
        ♻️
      </div>
      <p
        style={{
          color: '#e0ffe0',
          fontSize: '1.5rem',
          fontFamily: '"Inter", "Segoe UI", sans-serif',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '0',
          textShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}
      >
        Welcome to EcoFuelConnect
      </p>
    </div>
  );
}

export default Welcome;