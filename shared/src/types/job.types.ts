import { 
  RemoteType, 
  EmploymentType, 
  ExperienceLevel, 
  JobStatus, 
  SalaryType,
  JobCategory,
  BaseUser
} from './base.types';

// Re-export base types for convenience
export type { 
  RemoteType, 
  EmploymentType, 
  ExperienceLevel, 
  JobStatus, 
  SalaryType,
  JobCategory
} from './base.types';

// Forward declarations to avoid circular imports
interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  location?: string;
  isVerified: boolean;
}

interface JobApplication {
  id: string;
  userId: string;
  status: string;
}

export interface Job {
  id: string;
  companyId: string;
  postedBy: string;
  categoryId?: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryType: SalaryType;
  skillsRequired: string[];
  niceToHaveSkills: string[];
  applicationDeadline?: Date;
  status: JobStatus;
  viewsCount: number;
  applicationsCount: number;
  isFeatured: boolean;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  company?: Company;
  category?: JobCategory;
  postedByUser?: BaseUser;
  applications?: JobApplication[];
}

export interface CreateJobDto {
  categoryId?: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryType?: SalaryType;
  skillsRequired?: string[];
  niceToHaveSkills?: string[];
  applicationDeadline?: Date;
  isFeatured?: boolean;
  isUrgent?: boolean;
}

export interface UpdateJobDto {
  categoryId?: string;
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryType?: SalaryType;
  skillsRequired?: string[];
  niceToHaveSkills?: string[];
  applicationDeadline?: Date;
  status?: JobStatus;
  isFeatured?: boolean;
  isUrgent?: boolean;
}

export interface JobFilters {
  search?: string;
  categoryId?: string;
  location?: string;
  remoteType?: RemoteType[];
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  companyId?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  postedWithin?: number; // days
}

export interface JobSearchParams extends JobFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: Date;
  job?: Job;
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  keywords: string[];
  location?: string;
  remoteType?: RemoteType;
  employmentType: EmploymentType[];
  experienceLevel: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  lastSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobAlertDto {
  name: string;
  keywords?: string[];
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  frequency?: 'daily' | 'weekly';
}
