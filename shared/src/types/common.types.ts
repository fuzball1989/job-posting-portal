// Common utility types and interfaces

// Generic API response wrapper
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  code?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Constants
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;