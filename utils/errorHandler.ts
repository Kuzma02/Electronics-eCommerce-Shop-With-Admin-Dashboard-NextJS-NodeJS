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

export const handleApiError = (error: unknown) => {
  // Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    
    return new NextResponse(
      JSON.stringify({ 
        error: "Validation failed", 
        details: errors 
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
      JSON.stringify({ error: error.message }),
      { 
        status: error.statusCode,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        return new NextResponse(
          JSON.stringify({ error: "A record with this information already exists" }),
          { 
            status: 409,
            headers: { "Content-Type": "application/json" }
          }
        );
      case 'P2025':
        return new NextResponse(
          JSON.stringify({ error: "Record not found" }),
          { 
            status: 404,
            headers: { "Content-Type": "application/json" }
          }
        );
      default:
        break;
    }
  }

  // Generic server error
  console.error("Unhandled error:", error);
  return new NextResponse(
    JSON.stringify({ 
      error: "Internal server error. Please try again later." 
    }),
    { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    }
  );
};
