// Server-side error handler for Express.js
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Server-side error logging
const logError = (error, context = "") => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : "";

  if (error instanceof AppError) {
    console.error(`${timestamp}${contextStr} AppError:`, {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    console.error(`${timestamp}${contextStr} Error:`, {
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error(`${timestamp}${contextStr} Unknown error:`, error);
  }
};

// Enhanced Prisma error handling for server
const handlePrismaError = (error) => {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return {
      error: "Internal server error. Please try again later.",
      timestamp: new Date().toISOString(),
    };
  }

  const prismaError = error;

  switch (prismaError.code) {
    case "P2002":
      return {
        error: "A record with this information already exists",
        details: prismaError.meta?.target
          ? `Field: ${prismaError.meta.target.join(", ")}`
          : undefined,
        timestamp: new Date().toISOString(),
      };
    case "P2025":
      return {
        error: "Record not found",
        timestamp: new Date().toISOString(),
      };
    case "P2003":
      return {
        error: "Foreign key constraint failed",
        timestamp: new Date().toISOString(),
      };
    case "P2014":
      return {
        error:
          "The change you are trying to make would violate the required relation",
        timestamp: new Date().toISOString(),
      };
    case "P2021":
      return {
        error: "The table does not exist in the current database",
        timestamp: new Date().toISOString(),
      };
    case "P2022":
      return {
        error: "The column does not exist in the current database",
        timestamp: new Date().toISOString(),
      };
    default:
      return {
        error: "Database operation failed",
        details: `Error code: ${prismaError.code}`,
        timestamp: new Date().toISOString(),
      };
  }
};

// Get status code from Prisma error
const getStatusCodeFromPrismaError = (error) => {
  switch (error.code) {
    case "P2002":
      return 409; // Conflict
    case "P2025":
      return 404; // Not Found
    case "P2003":
    case "P2014":
      return 400; // Bad Request
    case "P2021":
    case "P2022":
      return 500; // Internal Server Error
    default:
      return 500;
  }
};

// Server-side error handler
const handleServerError = (error, res, context = "") => {
  const timestamp = new Date().toISOString();

  // Log the error
  logError(error, context);

  // Custom application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      timestamp,
    });
    return;
  }

  // Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const errorResponse = handlePrismaError(error);
    const statusCode = getStatusCodeFromPrismaError(error);

    res.status(statusCode).json(errorResponse);
    return;
  }

  // Generic server error
  res.status(500).json({
    error: "Internal server error. Please try again later.",
    timestamp,
  });
};

// Async wrapper for server functions
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("🔥 Async Handler Error:", error);
      console.error("Stack:", error.stack);
      handleServerError(error, res, `${req.method} ${req.path}`);
    });
  };
};

module.exports = {
  AppError,
  logError,
  handlePrismaError,
  getStatusCodeFromPrismaError,
  handleServerError,
  asyncHandler,
};
