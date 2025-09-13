import { z } from "zod";

// Common validation patterns
export const commonValidations = {
  // Email validation with comprehensive checks
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email must be no more than 254 characters")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim()
    .refine(
      (email) => {

        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /data:/i,
        ];
        return !suspiciousPatterns.some(pattern => pattern.test(email));
      },
      "Email contains invalid characters"
    ),

  // Strong password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be no more than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .refine(
      (password) => {
        // Check for common weak passwords
        const commonPasswords = [
          "password", "123456", "qwerty", "abc123", "password123",
          "admin", "letmein", "welcome", "monkey", "dragon"
        ];
        return !commonPasswords.includes(password.toLowerCase());
      },
      "Password is too common, please choose a stronger password"
    ),

  // Request size validation
  validateRequestSize: (contentLength: number | null) => {
    const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB limit
    if (contentLength && contentLength > MAX_REQUEST_SIZE) {
      throw new Error("Request payload too large");
    }
  },

  // Rate limiting helper (basic implementation)
  rateLimit: new Map<string, { count: number; resetTime: number }>(),
  
  checkRateLimit: (identifier: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) => {
    const now = Date.now();
    const userLimit = commonValidations.rateLimit.get(identifier);
    
    if (!userLimit || now > userLimit.resetTime) {
      commonValidations.rateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userLimit.count >= maxRequests) {
      return false;
    }
    
    userLimit.count++;
    return true;
  }
};

// Sanitization helpers
export const sanitizeInput = {
  // Remove potentially dangerous characters
  sanitizeString: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  // Validate and sanitize JSON input
  validateJsonInput: async (request: Request) => {
    const contentLength = request.headers.get("content-length");
    commonValidations.validateRequestSize(contentLength ? parseInt(contentLength) : null);

    try {
      return await request.json();
    } catch (error) {
      throw new Error("Invalid JSON format");
    }
  }
};
