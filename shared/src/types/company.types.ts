import { CompanySize, CompanyMemberRole, BaseUser } from './base.types';

// Re-export base types for convenience
export type { CompanySize, CompanyMemberRole } from './base.types';

// Forward declaration to avoid circular imports
interface Job {
  id: string;
  title: string;
  slug: string;
  // ... other job properties would be here in a real implementation
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  location?: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  cultureTags: string[];
  benefits: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  members?: CompanyMember[];
  jobs?: Job[];
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: CompanyMemberRole;
  title?: string;
  isActive: boolean;
  joinedAt: Date;
  // Relations
  user?: BaseUser;
  company?: Company;
}

export interface CreateCompanyDto {
  name: string;
  description?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  location?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  cultureTags?: string[];
  benefits?: string[];
}

export interface UpdateCompanyDto {
  name?: string;
  description?: string;
  industry?: string;
  size?: CompanySize;
  foundedYear?: number;
  location?: string;
  websiteUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  cultureTags?: string[];
  benefits?: string[];
}

export interface CompanyFilters {
  search?: string;
  industry?: string;
  size?: CompanySize[];
  location?: string;
  isVerified?: boolean;
}

export interface CompanySearchParams extends CompanyFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CompanySearchResult {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
