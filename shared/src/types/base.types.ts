// Base types to avoid circular imports

// Common enums and types
export type RemoteType = 'office' | 'remote' | 'hybrid';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type JobStatus = 'draft' | 'active' | 'paused' | 'closed' | 'filled';
export type SalaryType = 'yearly' | 'monthly' | 'weekly' | 'hourly';
export type UserRole = 'job_seeker' | 'employer' | 'admin';
export type UserAvailability = 'available' | 'not_available' | 'open_to_offers';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type CompanyMemberRole = 'admin' | 'recruiter' | 'member';
export type ApplicationStatus = 
  | 'submitted' 
  | 'reviewing' 
  | 'shortlisted' 
  | 'interviewed' 
  | 'offered' 
  | 'rejected' 
  | 'withdrawn';

// Base interfaces (without relations)
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePictureUrl?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
}

// Pagination and search interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BaseApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface BaseApiError {
  error: string;
  message: string;
  code?: string;
  details?: any[];
}