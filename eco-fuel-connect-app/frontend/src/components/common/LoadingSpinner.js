import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  text = 'Loading...', 
  center = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  };

  const spinnerStyle = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div className={`d-flex align-items-center ${className}`}>
      <Spinner
        animation="border"
        variant={variant}
        style={spinnerStyle}
        className="me-2"
      />
      {text && <span>{text}</span>}
    </div>
  );

  if (center) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;