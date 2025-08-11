import { BaseUser, UserRole, UserAvailability } from './base.types';

// Re-export base types for convenience
export type { UserRole, UserAvailability, BaseUser } from './base.types';

export interface User extends BaseUser {
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  title?: string;
  summary?: string;
  experienceYears?: number;
  skills: string[];
  location?: string;
  salaryExpectationMin?: number;
  salaryExpectationMax?: number;
  currency: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  availability: UserAvailability;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePictureUrl?: string;
}

export interface UpdateUserProfileDto {
  title?: string;
  summary?: string;
  experienceYears?: number;
  skills?: string[];
  location?: string;
  salaryExpectationMin?: number;
  salaryExpectationMax?: number;
  currency?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  availability?: UserAvailability;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface PasswordResetDto {
  email: string;
}

export interface PasswordResetConfirmDto {
  token: string;
  newPassword: string;
}
