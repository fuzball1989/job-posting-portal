import { ApplicationStatus, BaseUser } from './base.types';

// Re-export base types for convenience
export type { ApplicationStatus } from './base.types';

// Forward declarations to avoid circular imports
interface Job {
  id: string;
  title: string;
  companyId: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  currency: string;
  availabilityDate?: Date;
  status: ApplicationStatus;
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
  // Relations
  job?: Job;
  user?: BaseUser;
  statusHistory?: ApplicationStatusHistory[];
}

export interface ApplicationStatusHistory {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  notes?: string;
  changedBy?: string;
  changedAt: Date;
  // Relations
  changedByUser?: BaseUser;
}

export interface CreateJobApplicationDto {
  jobId: string;
  coverLetter?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  currency?: string;
  availabilityDate?: Date;
}

export interface UpdateJobApplicationDto {
  coverLetter?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  currency?: string;
  availabilityDate?: Date;
  status?: ApplicationStatus;
  notes?: string;
}

export interface ApplicationFilters {
  jobId?: string;
  userId?: string;
  companyId?: string;
  status?: ApplicationStatus[];
  appliedAfter?: Date;
  appliedBefore?: Date;
}

export interface ApplicationSearchParams extends ApplicationFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApplicationSearchResult {
  applications: JobApplication[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplicationStats {
  total: number;
  submitted: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  rejected: number;
  withdrawn: number;
}
