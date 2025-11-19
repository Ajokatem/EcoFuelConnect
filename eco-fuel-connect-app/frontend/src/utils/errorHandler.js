// Error handling utilities

export const getErrorMessage = (error) => {
  if (error.response) {
    // API error response
    if (error.response.data?.message) {
      return error.response.data.message;
    }
    if (error.response.data?.error) {
      return error.response.data.error;
    }
    // HTTP status errors
    switch (error.response.status) {
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Error: ${error.response.status}`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred.';
  }
};

export const handleApiError = (error, showAlert) => {
  const message = getErrorMessage(error);
  console.error('API Error:', error);
  
  if (showAlert) {
    showAlert(message, 'danger');
  }
  
  return message;
};

export const createErrorHandler = (setAlert) => {
  return (error) => {
    const message = getErrorMessage(error);
    setAlert({
      show: true,
      message,
      type: 'danger'
    });
  };
};

// Success message handler
export const createSuccessHandler = (setAlert) => {
  return (message) => {
    setAlert({
      show: true,
      message,
      type: 'success'
    });
  };
};

// Loading state handler
export const createLoadingHandler = (setLoading) => {
  return {
    start: () => setLoading(true),
    stop: () => setLoading(false)
  };
};