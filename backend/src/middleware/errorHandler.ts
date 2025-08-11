import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export interface CustomError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public details: any;

  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

// Logger utility for consistent error logging
export const logError = (error: any, req?: Request) => {
  const timestamp = new Date().toISOString();
  const requestInfo = req ? `${req.method} ${req.originalUrl}` : 'No request context';
  
  console.error(`[${timestamp}] ERROR - ${requestInfo}:`, {
    message: error.message,
    stack: error.stack,
    status: error.status,
    code: error.code,
  });
};

// Error handler middleware
export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logError(error, req);

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      message: 'Invalid input data',
      code: 'VALIDATION_ERROR',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
    });
    return;
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    res.status(error.status).json({
      error: error.name,
      message: error.message,
      code: error.code,
      ...(error instanceof ValidationError && error.details && { details: error.details }),
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
    });
    return;
  }

  // Handle Prisma errors
  if (error.code && error.code.startsWith('P')) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          error: 'Conflict',
          message: 'Resource already exists',
          code: 'DUPLICATE_RESOURCE',
        });
        return;
      case 'P2025':
        res.status(404).json({
          error: 'Not found',
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND',
        });
        return;
      default:
        res.status(500).json({
          error: 'Database error',
          message: 'A database error occurred',
          code: 'DATABASE_ERROR',
        });
        return;
    }
  }

  // Default error response
  const status = error.status || 500;
  const message = status === 500 ? 'Internal server error' : error.message;
  
  res.status(status).json({
    error: 'Internal error',
    message,
    code: error.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Async wrapper to catch async errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
  next(error);
};

export default {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  logError,
};