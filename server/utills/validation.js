// Server-side validation utilities for payment and order processing
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Validation error class
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Payment validation utilities
const paymentValidation = {
  // Validate credit card number using Luhn algorithm
  validateCardNumber: (cardNumber) => {
    if (!cardNumber || typeof cardNumber !== 'string') {
      throw new ValidationError('Card number is required', 'cardNumber');
    }

    // Remove all non-digit characters
    const cleanedNumber = cardNumber.replace(/[^0-9]/g, '');
    
    // Check length (13-19 digits)
    if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
      throw new ValidationError('Card number must be between 13 and 19 digits', 'cardNumber');
    }

    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanedNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      throw new ValidationError('Invalid card number', 'cardNumber');
    }
    
    return cleanedNumber;
  },

  // Validate CVV/CVC
  validateCVV: (cvv, cardNumber) => {
    if (!cvv || typeof cvv !== 'string') {
      throw new ValidationError('CVV is required', 'cvv');
    }

    const cleanedCVV = cvv.replace(/[^0-9]/g, '');
    
    // American Express cards have 4-digit CVV, others have 3-digit
    const cleanedCardNumber = cardNumber ? cardNumber.replace(/[^0-9]/g, '') : '';
    const isAmex = cleanedCardNumber.startsWith('34') || cleanedCardNumber.startsWith('37');
    const expectedLength = isAmex ? 4 : 3;
    
    if (cleanedCVV.length !== expectedLength) {
      throw new ValidationError(`CVV must be ${expectedLength} digits`, 'cvv');
    }
    
    if (!/^[0-9]+$/.test(cleanedCVV)) {
      throw new ValidationError('CVV must contain only numbers', 'cvv');
    }
    
    return cleanedCVV;
  },

  // Validate expiration date
  validateExpirationDate: (expDate) => {
    if (!expDate || typeof expDate !== 'string') {
      throw new ValidationError('Expiration date is required', 'expDate');
    }

    // Accept MM/YY, MM/YYYY, MM-YY, MM-YYYY formats
    const cleanedDate = expDate.replace(/[^0-9]/g, '');
    
    if (cleanedDate.length !== 4 && cleanedDate.length !== 6) {
      throw new ValidationError('Expiration date must be in MM/YY or MM/YYYY format', 'expDate');
    }

    const month = parseInt(cleanedDate.substring(0, 2));
    const year = parseInt(cleanedDate.substring(2));
    const fullYear = year < 100 ? 2000 + year : year;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      throw new ValidationError('Invalid month in expiration date', 'expDate');
    }

    if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
      throw new ValidationError('Card has expired', 'expDate');
    }

    return { month, year: fullYear };
  },

  // Validate cardholder name
  validateCardholderName: (name) => {
    if (!name || typeof name !== 'string') {
      throw new ValidationError('Cardholder name is required', 'cardholderName');
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      throw new ValidationError('Cardholder name must be at least 2 characters', 'cardholderName');
    }

    if (trimmedName.length > 50) {
      throw new ValidationError('Cardholder name must be less than 50 characters', 'cardholderName');
    }

    // Allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
      throw new ValidationError('Cardholder name contains invalid characters', 'cardholderName');
    }

    return trimmedName;
  }
};

// Order validation utilities
const orderValidation = {
  // Validate email format - FIXED: Check XSS patterns first
  validateEmail: (email) => {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required', 'email');
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    // Check for suspicious patterns FIRST (before format validation)
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(trimmedEmail))) {
      throw new ValidationError('Email contains invalid characters', 'email');
    }
    
    if (trimmedEmail.length > 254) {
      throw new ValidationError('Email must be less than 254 characters', 'email');
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      throw new ValidationError('Invalid email format', 'email');
    }

    return trimmedEmail;
  },

  // Validate name format - Updated to support Unicode and Indonesian names
  validateName: (name, fieldName = 'name') => {
    if (!name || typeof name !== 'string') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      throw new ValidationError(`${fieldName} must be at least 2 characters`, fieldName);
    }

    if (trimmedName.length > 50) {
      throw new ValidationError(`${fieldName} must be less than 50 characters`, fieldName);
    }

    // Check for dangerous patterns first
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /<\w+[^>]*>/,
    ];
    
    if (dangerousPatterns.some(pattern => pattern.test(trimmedName))) {
      throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
    }

    // Allow Unicode letters, spaces, hyphens, apostrophes, and dots
    // This supports international names including Indonesian, Arabic, Chinese, etc.
    if (!/^[\p{L}\p{M}\s\-'.]+$/u.test(trimmedName)) {
      throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
    }

    return trimmedName;
  },

  // Validate phone number
  validatePhone: (phone) => {
    if (!phone || typeof phone !== 'string') {
      throw new ValidationError('Phone number is required', 'phone');
    }

    const cleanedPhone = phone.replace(/[^0-9+\-\(\)\s]/g, '');
    
    if (cleanedPhone.length < 10) {
      throw new ValidationError('Phone number must be at least 10 digits', 'phone');
    }

    if (cleanedPhone.length > 20) {
      throw new ValidationError('Phone number must be less than 20 characters', 'phone');
    }

    return cleanedPhone;
  },

  // Validate address fields - UPDATED for apartment (1 character minimum)
  validateAddress: (address, fieldName = 'address') => {
    if (!address || typeof address !== 'string') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }

    const trimmedAddress = address.trim();
    
    // Special case for apartment - only 1 character minimum
    const minLength = fieldName === 'apartment' ? 1 : 5;
    
    if (trimmedAddress.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters`, fieldName);
    }

    if (trimmedAddress.length > 200) {
      throw new ValidationError(`${fieldName} must be less than 200 characters`, fieldName);
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(trimmedAddress))) {
      throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
    }

    return trimmedAddress;
  },

  // Validate postal code
  validatePostalCode: (postalCode) => {
    if (!postalCode || typeof postalCode !== 'string') {
      throw new ValidationError('Postal code is required', 'postalCode');
    }

    const trimmedCode = postalCode.trim();
    
    if (trimmedCode.length < 3) {
      throw new ValidationError('Postal code must be at least 3 characters', 'postalCode');
    }

    if (trimmedCode.length > 20) {
      throw new ValidationError('Postal code must be less than 20 characters', 'postalCode');
    }

    return trimmedCode;
  },

  // Validate total amount
  validateTotal: (total) => {
    if (total === null || total === undefined) {
      throw new ValidationError('Total amount is required', 'total');
    }

    const numTotal = parseFloat(total);
    
    if (isNaN(numTotal)) {
      throw new ValidationError('Total must be a valid number', 'total');
    }

    if (numTotal <= 0) {
      throw new ValidationError('Total must be greater than 0', 'total');
    }

    if (numTotal > 999999.99) {
      throw new ValidationError('Total amount is too large', 'total');
    }

    return Math.round(numTotal * 100) / 100; // Round to 2 decimal places
  },

  // Validate order status
  validateStatus: (status) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || typeof status !== 'string') {
      throw new ValidationError('Order status is required', 'status');
    }

    if (!validStatuses.includes(status.toLowerCase())) {
      throw new ValidationError(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`, 'status');
    }

    return status.toLowerCase();
  }
};

// Comprehensive order validation - FIXED VERSION
const validateOrderData = (orderData) => {
  const errors = [];
  const validatedData = {};

  // Helper function to safely validate a field
  const safeValidate = (validationFn, value, fieldName) => {
    try {
      return validationFn(value, fieldName);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push({
          field: error.field,
          message: error.message
        });
        return null;
      } else {
        errors.push({
          field: fieldName,
          message: 'Validation error occurred'
        });
        return null;
      }
    }
  };

  // Validate all required fields - ALL will be checked regardless of previous errors
  validatedData.name = safeValidate(orderValidation.validateName, orderData.name, 'name');
  validatedData.lastname = safeValidate(orderValidation.validateName, orderData.lastname, 'lastname');
  validatedData.email = safeValidate(orderValidation.validateEmail, orderData.email, 'email');
  validatedData.phone = safeValidate(orderValidation.validatePhone, orderData.phone, 'phone');
  validatedData.company = safeValidate(orderValidation.validateAddress, orderData.company, 'company');
  validatedData.adress = safeValidate(orderValidation.validateAddress, orderData.adress, 'address');
  validatedData.apartment = safeValidate(orderValidation.validateAddress, orderData.apartment, 'apartment');
  validatedData.city = safeValidate(orderValidation.validateAddress, orderData.city, 'city');
  validatedData.country = safeValidate(orderValidation.validateAddress, orderData.country, 'country');
  validatedData.postalCode = safeValidate(orderValidation.validatePostalCode, orderData.postalCode, 'postalCode');
  validatedData.total = safeValidate(orderValidation.validateTotal, orderData.total, 'total');
  validatedData.status = safeValidate(orderValidation.validateStatus, orderData.status || 'pending', 'status');
  
  // Optional fields
  validatedData.orderNotice = orderData.orderNotice ? 
    orderData.orderNotice.trim().substring(0, 500) : ''; // Limit to 500 characters

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
};

// Payment data validation (for future payment integration)
const validatePaymentData = (paymentData) => {
  const errors = [];
  const validatedData = {};

  // Helper function to safely validate payment fields
  const safeValidatePayment = (validationFn, value, fieldName) => {
    try {
      return validationFn(value, paymentData.cardNumber);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push({
          field: error.field,
          message: error.message
        });
        return null;
      } else {
        errors.push({
          field: fieldName,
          message: 'Payment validation error occurred'
        });
        return null;
      }
    }
  };

  if (paymentData.cardNumber) {
    validatedData.cardNumber = safeValidatePayment(paymentValidation.validateCardNumber, paymentData.cardNumber, 'cardNumber');
  }
  
  if (paymentData.cvv) {
    validatedData.cvv = safeValidatePayment(paymentValidation.validateCVV, paymentData.cvv, 'cvv');
  }
  
  if (paymentData.expDate) {
    try {
      validatedData.expDate = paymentValidation.validateExpirationDate(paymentData.expDate);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push({
          field: error.field,
          message: error.message
        });
      }
    }
  }
  
  if (paymentData.cardholderName) {
    try {
      validatedData.cardholderName = paymentValidation.validateCardholderName(paymentData.cardholderName);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push({
          field: error.field,
          message: error.message
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
};

module.exports = {
  ValidationError,
  paymentValidation,
  orderValidation,
  validateOrderData,
  validatePaymentData
};
