import { JobSearchParams } from './types';

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const buildSearchFilters = (params: JobSearchParams) => {
  const filters: any = {
    status: 'ACTIVE',
  };

  if (params.search) {
    filters.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { skillsRequired: { has: params.search } },
      { company: { name: { contains: params.search, mode: 'insensitive' } } },
    ];
  }

  if (params.categoryId) {
    filters.categoryId = params.categoryId;
  }

  if (params.location) {
    filters.location = { contains: params.location, mode: 'insensitive' };
  }

  if (params.remoteType && params.remoteType.length > 0) {
    filters.remoteType = { in: params.remoteType.map(type => type.toUpperCase()) };
  }

  if (params.employmentType && params.employmentType.length > 0) {
    filters.employmentType = { in: params.employmentType.map(type => type.toUpperCase()) };
  }

  if (params.experienceLevel && params.experienceLevel.length > 0) {
    filters.experienceLevel = { in: params.experienceLevel.map(level => level.toUpperCase()) };
  }

  if (params.salaryMin) {
    filters.salaryMin = { gte: params.salaryMin };
  }

  if (params.salaryMax) {
    filters.salaryMax = { lte: params.salaryMax };
  }

  if (params.companyId) {
    filters.companyId = params.companyId;
  }

  if (params.isFeatured !== undefined) {
    filters.isFeatured = params.isFeatured;
  }

  if (params.isUrgent !== undefined) {
    filters.isUrgent = params.isUrgent;
  }

  return filters;
};

export const buildSortOrder = (sortBy: string, sortOrder: string) => {
  const validSortFields = ['createdAt', 'title', 'salaryMin', 'salaryMax', 'viewsCount', 'applicationsCount'];
  
  if (!validSortFields.includes(sortBy)) {
    return { createdAt: 'desc' as const };
  }
  
  return { [sortBy]: sortOrder as 'asc' | 'desc' };
};

export const getJobInclude = () => ({
  company: {
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      location: true,
      websiteUrl: true,
      description: true,
      isVerified: true,
      size: true,
      foundedYear: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  postedByUser: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profilePictureUrl: true,
    },
  },
  _count: {
    select: {
      applications: true,
    },
  },
});