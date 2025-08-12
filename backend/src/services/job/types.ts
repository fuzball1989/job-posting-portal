export interface CreateJobData {
  categoryId?: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  location?: string;
  remoteType: 'office' | 'remote' | 'hybrid';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryType: 'yearly' | 'monthly' | 'weekly' | 'hourly';
  skillsRequired: string[];
  niceToHaveSkills: string[];
  applicationDeadline?: string;
  isFeatured: boolean;
  isUrgent: boolean;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  status?: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
}

export interface JobSearchParams {
  search?: string;
  categoryId?: string;
  location?: string;
  remoteType?: string[];
  employmentType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  companyId?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'title' | 'salaryMin' | 'salaryMax' | 'viewsCount' | 'applicationsCount';
  sortOrder: 'asc' | 'desc';
}

export interface JobResult {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  location?: string | null;
  remoteType: string;
  employmentType: string;
  experienceLevel?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency: string;
  salaryType: string;
  status: string;
  skillsRequired: string[];
  niceToHaveSkills: string[];
  applicationDeadline?: Date | null;
  isFeatured: boolean;
  isUrgent: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  company: any;
  category?: any;
  postedByUser?: any;
  applicationsCount?: number;
}

export interface SearchResult {
  jobs: JobResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}