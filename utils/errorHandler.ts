import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Enhanced error response interface
export interface ErrorResponse {
  error: string;
  details?: any;
  requestId?: string;
  timestamp?: string;
}

// Standardized error logging
export const logError = (error: unknown, context?: string) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';
  
  if (error instanceof AppError) {
    console.error(`${timestamp}${contextStr} AppError:`, {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    });
  } else if (error instanceof Error) {
    console.error(`${timestamp}${contextStr} Error:`, {
      message: error.message,
      stack: error.stack
    });
  } else {
    console.error(`${timestamp}${contextStr} Unknown error:`, error);
  }
};

// Enhanced Prisma error handling
export const handlePrismaError = (error: any): ErrorResponse => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return {
      error: "Internal server error. Please try again later.",
      timestamp: new Date().toISOString()
    };
  }

  const prismaError = error as any;
  
  switch (prismaError.code) {
    case 'P2002':
      return {
        error: "A record with this information already exists",
        details: prismaError.meta?.target ? `Field: ${prismaError.meta.target.join(', ')}` : undefined,
        timestamp: new Date().toISOString()
      };
    case 'P2025':
      return {
        error: "Record not found",
        timestamp: new Date().toISOString()
      };
    case 'P2003':
      return {
        error: "Foreign key constraint failed",
        timestamp: new Date().toISOString()
      };
    case 'P2014':
      return {
        error: "The change you are trying to make would violate the required relation",
        timestamp: new Date().toISOString()
      };
    case 'P2021':
      return {
        error: "The table does not exist in the current database",
        timestamp: new Date().toISOString()
      };
    case 'P2022':
      return {
        error: "The column does not exist in the current database",
        timestamp: new Date().toISOString()
      };
    default:
      return {
        error: "Database operation failed",
        details: `Error code: ${prismaError.code}`,
        timestamp: new Date().toISOString()
      };
  }
};

// Enhanced API error handler for Next.js
export const handleApiError = (error: unknown, requestId?: string): NextResponse => {
  const timestamp = new Date().toISOString();
  
  // Log the error
  logError(error, 'API');

  // Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    
    return new NextResponse(
      JSON.stringify({ 
        error: "Validation failed", 
        details: errors,
        requestId,
        timestamp
      }),
      { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Custom application errors
  if (error instanceof AppError) {
    return new NextResponse(
      JSON.stringify({ 
        error: error.message,
        requestId,
        timestamp
      }),
      { 
        status: error.statusCode,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const errorResponse = handlePrismaError(error);
    const statusCode = getStatusCodeFromPrismaError(error as any);
    
    return new NextResponse(
      JSON.stringify({ 
        ...errorResponse,
        requestId
      }),
      { 
        status: statusCode,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Generic server error
  return new NextResponse(
    JSON.stringify({ 
      error: "Internal server error. Please try again later.",
      requestId,
      timestamp
    }),
    { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    }
  );
};

// Helper function to get status code from Prisma error
const getStatusCodeFromPrismaError = (error: any): number => {
  switch (error.code) {
    case 'P2002':
      return 409; // Conflict
    case 'P2025':
      return 404; // Not Found
    case 'P2003':
    case 'P2014':
      return 400; // Bad Request
    case 'P2021':
    case 'P2022':
      return 500; // Internal Server Error
    default:
      return 500;
  }
};

// Server-side error handler for Express.js routes
export const handleServerError = (error: unknown, res: any, context?: string): void => {
  const timestamp = new Date().toISOString();
  
  // Log the error
  logError(error, context);

  // Custom application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      timestamp
    });
    return;
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const errorResponse = handlePrismaError(error);
    const statusCode = getStatusCodeFromPrismaError(error as any);
    
    res.status(statusCode).json(errorResponse);
    return;
  }

  // Generic server error
  res.status(500).json({
    error: "Internal server error. Please try again later.",
    timestamp
  });
};

// Async wrapper for server functions
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next?: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      handleServerError(error, res, `${req.method} ${req.path}`);
    });
  };
};

// Async wrapper for Next.js API routes
export const asyncApiHandler = (fn: Function) => {
  return async (req: Request, context?: any) => {
    try {
      return await fn(req, context);
    } catch (error) {
      const requestId = req.headers.get('x-request-id') || 
                       req.headers.get('x-forwarded-for') || 
                       'unknown';
      return handleApiError(error, requestId);
    }
  };
};
