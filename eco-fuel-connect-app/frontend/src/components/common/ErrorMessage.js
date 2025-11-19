import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ 
  error, 
  variant = 'danger', 
  dismissible = false, 
  onClose,
  className = '',
  showIcon = true 
}) => {
  if (!error) return null;

  const errorText = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <Alert 
      variant={variant} 
      dismissible={dismissible} 
      onClose={onClose}
      className={className}
    >
      {showIcon && (
        <i className="nc-icon nc-simple-remove me-2"></i>
      )}
      {errorText}
    </Alert>
  );
};

export default ErrorMessage;