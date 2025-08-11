import { z } from 'zod';

// Common validators
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional();
export const urlSchema = z.string().url('Invalid URL').optional();

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name too long'),
  phone: phoneSchema,
  role: z.enum(['job_seeker', 'employer', 'admin']).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: phoneSchema,
  profilePictureUrl: urlSchema,
});

export const updateUserProfileSchema = z.object({
  title: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  experienceYears: z.number().int().min(0).max(50).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  salaryExpectationMin: z.number().int().min(0).optional(),
  salaryExpectationMax: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  portfolioUrl: urlSchema,
  linkedinUrl: urlSchema,
  githubUrl: urlSchema,
  websiteUrl: urlSchema,
  availability: z.enum(['available', 'not_available', 'open_to_offers']).optional(),
});

// Company validation schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200, 'Company name too long'),
  description: z.string().max(5000).optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  location: z.string().max(200).optional(),
  websiteUrl: urlSchema,
  linkedinUrl: urlSchema,
  twitterUrl: urlSchema,
  cultureTags: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  location: z.string().max(200).optional(),
  websiteUrl: urlSchema,
  logoUrl: urlSchema,
  coverImageUrl: urlSchema,
  linkedinUrl: urlSchema,
  twitterUrl: urlSchema,
  cultureTags: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
});

// Job validation schemas
export const createJobSchema = z.object({
  categoryId: z.string().uuid().optional(),
  title: z.string().min(1, 'Job title is required').max(200, 'Job title too long'),
  description: z.string().min(1, 'Job description is required').max(10000, 'Description too long'),
  requirements: z.string().max(5000).optional(),
  responsibilities: z.string().max(5000).optional(),
  benefits: z.string().max(3000).optional(),
  location: z.string().max(200).optional(),
  remoteType: z.enum(['office', 'remote', 'hybrid']),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  salaryType: z.enum(['yearly', 'monthly', 'weekly', 'hourly']).optional(),
  skillsRequired: z.array(z.string()).optional(),
  niceToHaveSkills: z.array(z.string()).optional(),
  applicationDeadline: z.string().datetime().optional(),
  isFeatured: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax'],
  }
);

export const updateJobSchema = z.object({
  categoryId: z.string().uuid().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(10000).optional(),
  requirements: z.string().max(5000).optional(),
  responsibilities: z.string().max(5000).optional(),
  benefits: z.string().max(3000).optional(),
  location: z.string().max(200).optional(),
  remoteType: z.enum(['office', 'remote', 'hybrid']).optional(),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  salaryType: z.enum(['yearly', 'monthly', 'weekly', 'hourly']).optional(),
  skillsRequired: z.array(z.string()).optional(),
  niceToHaveSkills: z.array(z.string()).optional(),
  applicationDeadline: z.string().datetime().optional(),
  status: z.enum(['draft', 'active', 'paused', 'closed', 'filled']).optional(),
  isFeatured: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax'],
  }
);

// Application validation schemas
export const createJobApplicationSchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  coverLetter: z.string().max(2000).optional(),
  portfolioUrl: urlSchema,
  expectedSalary: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  availabilityDate: z.string().datetime().optional(),
});

export const updateJobApplicationSchema = z.object({
  coverLetter: z.string().max(2000).optional(),
  portfolioUrl: urlSchema,
  expectedSalary: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  availabilityDate: z.string().datetime().optional(),
  status: z.enum(['submitted', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn']).optional(),
  notes: z.string().max(1000).optional(),
});

// Job Alert validation schemas
export const createJobAlertSchema = z.object({
  name: z.string().min(1, 'Alert name is required').max(200, 'Alert name too long'),
  keywords: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  remoteType: z.enum(['office', 'remote', 'hybrid']).optional(),
  employmentType: z.array(z.enum(['full_time', 'part_time', 'contract', 'internship'])).optional(),
  experienceLevel: z.array(z.enum(['entry', 'mid', 'senior', 'lead', 'executive'])).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
}).refine(
  (data) => {
    if (data.salaryMin && data.salaryMax) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax'],
  }
);

// Search and filter validation schemas
export const jobSearchSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  location: z.string().optional(),
  remoteType: z.array(z.enum(['office', 'remote', 'hybrid'])).optional(),
  employmentType: z.array(z.enum(['full_time', 'part_time', 'contract', 'internship'])).optional(),
  experienceLevel: z.array(z.enum(['entry', 'mid', 'senior', 'lead', 'executive'])).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  companyId: z.string().uuid().optional(),
  isFeatured: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  postedWithin: z.number().int().min(1).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Password reset validation schemas
export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema,
});
