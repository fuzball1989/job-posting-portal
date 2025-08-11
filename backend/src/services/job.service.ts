import { z } from 'zod';
import prisma from '../config/database';

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

export class JobService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private buildSearchFilters(params: JobSearchParams) {
    const filters: any = {
      status: 'ACTIVE',
    };

    if (params.search) {
      filters.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { company: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.categoryId) {
      filters.categoryId = params.categoryId;
    }

    if (params.location) {
      filters.location = { contains: params.location, mode: 'insensitive' };
    }

    if (params.remoteType?.length) {
      filters.remoteType = { in: params.remoteType.map((type: string) => type.toUpperCase()) };
    }

    if (params.employmentType?.length) {
      filters.employmentType = { in: params.employmentType.map((type: string) => type.toUpperCase()) };
    }

    if (params.experienceLevel?.length) {
      filters.experienceLevel = { in: params.experienceLevel.map((level: string) => level.toUpperCase()) };
    }

    if (params.salaryMin !== undefined || params.salaryMax !== undefined) {
      filters.AND = filters.AND || [];
      if (params.salaryMin !== undefined) {
        filters.AND.push({ salaryMax: { gte: params.salaryMin } });
      }
      if (params.salaryMax !== undefined) {
        filters.AND.push({ salaryMin: { lte: params.salaryMax } });
      }
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
  }

  private normalizeJobData(job: any): JobResult {
    return {
      ...job,
      remoteType: job.remoteType.toLowerCase(),
      employmentType: job.employmentType.toLowerCase(),
      experienceLevel: job.experienceLevel?.toLowerCase(),
      salaryType: job.salaryType.toLowerCase(),
      status: job.status.toLowerCase(),
      applicationsCount: job._count?.applications,
    };
  }

  async createJob(userId: string, data: CreateJobData): Promise<JobResult> {
    // Check if user has employer role or is associated with a company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        companyMemberships: {
          where: { isActive: true },
          include: { company: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // For employers, they must have a company association
    let companyId: string;
    if (user.role === 'EMPLOYER') {
      const activeCompany = user.companyMemberships.find(m => 
        ['ADMIN', 'RECRUITER'].includes(m.role)
      );

      if (!activeCompany) {
        throw new Error('You must be associated with a company to post jobs');
      }

      companyId = activeCompany.companyId;
    } else {
      throw new Error('Only employers can post jobs');
    }

    // Generate unique slug
    const baseSlug = this.generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.job.findFirst({ where: { companyId, slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        companyId,
        postedBy: user.id,
        categoryId: data.categoryId,
        title: data.title,
        slug,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        location: data.location,
        remoteType: data.remoteType.toUpperCase() as any,
        employmentType: data.employmentType.toUpperCase() as any,
        experienceLevel: data.experienceLevel?.toUpperCase() as any,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        currency: data.currency,
        salaryType: data.salaryType.toUpperCase() as any,
        skillsRequired: data.skillsRequired,
        niceToHaveSkills: data.niceToHaveSkills,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
        isFeatured: data.isFeatured,
        isUrgent: data.isUrgent,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            location: true,
          },
        },
        category: true,
        postedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.normalizeJobData(job);
  }

  async searchJobs(params: JobSearchParams): Promise<SearchResult> {
    const filters = this.buildSearchFilters(params);
    const skip = (params.page - 1) * params.limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: filters,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              location: true,
              isVerified: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: {
          [params.sortBy]: params.sortOrder,
        },
        skip,
        take: params.limit,
      }),
      prisma.job.count({ where: filters }),
    ]);

    const totalPages = Math.ceil(total / params.limit);

    return {
      jobs: jobs.map(job => this.normalizeJobData(job)),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1,
      },
    };
  }

  async getJobById(id: string): Promise<JobResult | null> {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            location: true,
            website: true,
            description: true,
            isVerified: true,
            employeeCount: true,
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
      },
    });

    if (!job) {
      return null;
    }

    // Increment views count
    await prisma.job.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    return this.normalizeJobData(job);
  }

  async getJobBySlug(companySlug: string, jobSlug: string): Promise<JobResult | null> {
    const job = await prisma.job.findFirst({
      where: {
        slug: jobSlug,
        company: {
          slug: companySlug,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            location: true,
            website: true,
            description: true,
            isVerified: true,
            employeeCount: true,
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
      },
    });

    if (!job) {
      return null;
    }

    // Increment views count
    await prisma.job.update({
      where: { id: job.id },
      data: { viewsCount: { increment: 1 } },
    });

    return this.normalizeJobData(job);
  }

  async updateJob(jobId: string, userId: string, data: UpdateJobData): Promise<JobResult> {
    // Verify job ownership or company admin rights
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          include: {
            memberships: {
              where: {
                userId: userId,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    const isOwner = existingJob.postedBy === userId;
    const isCompanyAdmin = existingJob.company.memberships.some(m => 
      ['ADMIN', 'RECRUITER'].includes(m.role)
    );

    if (!isOwner && !isCompanyAdmin) {
      throw new Error('You are not authorized to update this job');
    }

    // Update slug if title changed
    let slug = existingJob.slug;
    if (data.title && data.title !== existingJob.title) {
      const baseSlug = this.generateSlug(data.title);
      slug = baseSlug;
      let counter = 1;

      while (await prisma.job.findFirst({ 
        where: { 
          companyId: existingJob.companyId, 
          slug,
          id: { not: jobId }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...data,
        slug,
        remoteType: data.remoteType?.toUpperCase() as any,
        employmentType: data.employmentType?.toUpperCase() as any,
        experienceLevel: data.experienceLevel?.toUpperCase() as any,
        salaryType: data.salaryType?.toUpperCase() as any,
        status: data.status?.toUpperCase() as any,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            location: true,
          },
        },
        category: true,
        postedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.normalizeJobData(updatedJob);
  }

  async deleteJob(jobId: string, userId: string): Promise<void> {
    // Verify job ownership or company admin rights
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: {
          include: {
            memberships: {
              where: {
                userId: userId,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!existingJob) {
      throw new Error('Job not found');
    }

    const isOwner = existingJob.postedBy === userId;
    const isCompanyAdmin = existingJob.company.memberships.some(m => 
      ['ADMIN', 'RECRUITER'].includes(m.role)
    );

    if (!isOwner && !isCompanyAdmin) {
      throw new Error('You are not authorized to delete this job');
    }

    await prisma.job.delete({
      where: { id: jobId },
    });
  }

  async getUserJobs(userId: string, page: number = 1, limit: number = 10): Promise<SearchResult> {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: { postedBy: userId },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              location: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where: { postedBy: userId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      jobs: jobs.map(job => this.normalizeJobData(job)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}

export default new JobService();