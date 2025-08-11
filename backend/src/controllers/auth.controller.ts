import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
  role: z.enum(['job_seeker', 'employer']).default('job_seeker'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error && error.message === 'User with this email already exists') {
      res.status(409).json({
        error: 'Registration failed',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);

    res.json({
      message: 'Login successful',
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error && (error.message === 'Invalid email or password' || error.message === 'Account is disabled')) {
      res.status(401).json({
        error: 'Authentication failed',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error',
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const tokens = await authService.refreshTokens(refreshToken);

    res.json({
      message: 'Token refreshed successfully',
      tokens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors,
      });
      return;
    }

    res.status(401).json({
      error: 'Token refresh failed',
      message: 'Invalid or expired refresh token',
    });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // In a production app, you might want to blacklist the token
  // For now, we'll just return a success message
  res.json({
    message: 'Logout successful',
  });
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getUserProfile(req.user!.id);

    res.json({
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({
        error: 'User not found',
        message: 'User account not found',
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to get user profile',
      message: 'Internal server error',
    });
  }
};
