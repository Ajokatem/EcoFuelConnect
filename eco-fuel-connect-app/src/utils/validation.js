// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Form validation for waste entry
export const validateWasteEntry = (data) => {
  const errors = {};

  if (!validateRequired(data.wasteType)) {
    errors.wasteType = 'Waste type is required';
  }

  if (!validateNumber(data.quantity, 0.1)) {
    errors.quantity = 'Quantity must be a positive number';
  }

  if (!validateRequired(data.source)) {
    errors.source = 'Source is required';
  }

  if (!validateRequired(data.supplierName)) {
    errors.supplierName = 'Supplier name is required';
  }

  if (data.supplierId && !validateRequired(data.supplierId)) {
    errors.supplierId = 'Supplier ID is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation for fuel request
export const validateFuelRequest = (data) => {
  const errors = {};

  if (!validateRequired(data.schoolName)) {
    errors.schoolName = 'School name is required';
  }

  if (!validateNumber(data.quantity, 1)) {
    errors.quantity = 'Quantity must be at least 1';
  }

  if (!validateRequired(data.contactNumber) || !validatePhone(data.contactNumber)) {
    errors.contactNumber = 'Valid contact number is required';
  }

  if (!validateRequired(data.deliveryDate)) {
    errors.deliveryDate = 'Delivery date is required';
  }

  if (!validateRequired(data.location)) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation for user profile
export const validateUserProfile = (data) => {
  const errors = {};

  if (!validateRequired(data.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!validateRequired(data.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!validateRequired(data.email) || !validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation for content creation
export const validateContent = (data) => {
  const errors = {};

  if (!validateRequired(data.title)) {
    errors.title = 'Title is required';
  }

  if (!validateRequired(data.content)) {
    errors.content = 'Content is required';
  }

  if (!validateRequired(data.category)) {
    errors.category = 'Category is required';
  }

  if (data.title && data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};