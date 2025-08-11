import { Request, Response } from 'express';
import { z } from 'zod';
import jobService from '../services/job.service';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';

// Validation schemas
const createJobSchema = z.object({
  categoryId: z.string().uuid().optional(),
  title: z.string().min(1, 'Job title is required').max(200),
  description: z.string().min(1, 'Job description is required').max(10000),
  requirements: z.string().max(5000).optional(),
  responsibilities: z.string().max(5000).optional(),
  benefits: z.string().max(3000).optional(),
  location: z.string().max(200).optional(),
  remoteType: z.enum(['office', 'remote', 'hybrid']).default('office'),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  currency: z.string().length(3).default('USD'),
  salaryType: z.enum(['yearly', 'monthly', 'weekly', 'hourly']).default('yearly'),
  skillsRequired: z.array(z.string()).default([]),
  niceToHaveSkills: z.array(z.string()).default([]),
  applicationDeadline: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
});

const updateJobSchema = createJobSchema.partial().extend({
  status: z.enum(['draft', 'active', 'paused', 'closed', 'filled']).optional(),
});

const jobSearchSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  location: z.string().optional(),
  remoteType: z.array(z.enum(['office', 'remote', 'hybrid'])).optional(),
  employmentType: z.array(z.enum(['full_time', 'part_time', 'contract', 'internship'])).optional(),
  experienceLevel: z.array(z.enum(['entry', 'mid', 'senior', 'lead', 'executive'])).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  companyId: z.string().uuid().optional(),
  isFeatured: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
  sortBy: z.enum(['createdAt', 'title', 'salaryMin', 'salaryMax', 'viewsCount', 'applicationsCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});


export const createJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createJobSchema.parse(req.body);
    const job = await jobService.createJob(req.user!.id, validatedData);

    res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      if (error.message === 'You must be associated with a company to post jobs' ||
          error.message === 'Only employers can post jobs') {
        res.status(403).json({
          error: 'Access forbidden',
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      error: 'Failed to create job',
      message: 'Internal server error',
    });
  }
};

export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = jobSearchSchema.parse({
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
      salaryMin: req.query.salaryMin ? parseInt(req.query.salaryMin as string) : undefined,
      salaryMax: req.query.salaryMax ? parseInt(req.query.salaryMax as string) : undefined,
      remoteType: req.query.remoteType ? (Array.isArray(req.query.remoteType) ? req.query.remoteType : [req.query.remoteType]) : undefined,
      employmentType: req.query.employmentType ? (Array.isArray(req.query.employmentType) ? req.query.employmentType : [req.query.employmentType]) : undefined,
      experienceLevel: req.query.experienceLevel ? (Array.isArray(req.query.experienceLevel) ? req.query.experienceLevel : [req.query.experienceLevel]) : undefined,
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      isUrgent: req.query.isUrgent === 'true' ? true : req.query.isUrgent === 'false' ? false : undefined,
    });

    const result = await jobService.searchJobs(params);

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid search parameters',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({
      error: 'Search failed',
      message: 'Internal server error',
    });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await jobService.getJobById(id);

    if (!job) {
      res.status(404).json({
        error: 'Job not found',
        message: 'The requested job listing does not exist',
      });
      return;
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get job',
      message: 'Internal server error',
    });
  }
};

export const updateJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateJobSchema.parse(req.body);
    
    const job = await jobService.updateJob(id, req.user!.id, validatedData);

    res.json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      if (error.message === 'Job not found') {
        res.status(404).json({
          error: 'Job not found',
          message: 'The requested job listing does not exist',
        });
        return;
      }
      if (error.message === 'You are not authorized to update this job') {
        res.status(403).json({
          error: 'Access forbidden',
          message: 'You do not have permission to edit this job',
        });
        return;
      }
    }

    res.status(500).json({
      error: 'Failed to update job',
      message: 'Internal server error',
    });
  }
};

export const deleteJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await jobService.deleteJob(id, req.user!.id);

    res.json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Job not found') {
        res.status(404).json({
          error: 'Job not found',
          message: 'The requested job listing does not exist',
        });
        return;
      }
      if (error.message === 'You are not authorized to delete this job') {
        res.status(403).json({
          error: 'Access forbidden',
          message: 'You do not have permission to delete this job',
        });
        return;
      }
    }

    res.status(500).json({
      error: 'Failed to delete job',
      message: 'Internal server error',
    });
  }
};

export const getJobCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.jobCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        _count: {
          select: {
            jobs: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    });

    res.json({
      categories: categories.map(category => ({
        ...category,
        jobCount: category._count.jobs,
      })),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      message: 'Internal server error',
    });
  }
};
