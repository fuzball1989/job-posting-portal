import prisma from '../../config/database';
import { CreateJobData, UpdateJobData, JobSearchParams, JobResult, SearchResult } from './types';
import { generateSlug, buildSearchFilters, buildSortOrder, getJobInclude } from './utils';
import { validateJobOwnership, validateUserCanPostJobs } from './validation';

export class JobService {
  async createJob(userId: string, data: CreateJobData): Promise<JobResult> {
    const companyId = await validateUserCanPostJobs(userId);

    const slug = generateSlug(data.title);
    let uniqueSlug = slug;
    let counter = 1;

    while (await this.checkSlugExists(companyId, uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const job = await prisma.job.create({
      data: {
        ...data,
        slug: uniqueSlug,
        companyId,
        postedBy: userId,
        remoteType: data.remoteType.toUpperCase() as any,
        employmentType: data.employmentType.toUpperCase() as any,
        experienceLevel: data.experienceLevel?.toUpperCase() as any,
        salaryType: data.salaryType.toUpperCase() as any,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
      },
      include: getJobInclude(),
    });

    return this.transformJobResult(job);
  }

  async searchJobs(params: JobSearchParams): Promise<SearchResult> {
    const filters = buildSearchFilters(params);
    const orderBy = buildSortOrder(params.sortBy, params.sortOrder);
    const skip = (params.page - 1) * params.limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: filters,
        include: getJobInclude(),
        orderBy,
        skip,
        take: params.limit,
      }),
      prisma.job.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(total / params.limit);

    return {
      jobs: jobs.map(job => this.transformJobResult(job)),
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
      include: getJobInclude(),
    });

    if (!job) return null;

    // Increment view count
    await prisma.job.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    return this.transformJobResult(job);
  }

  async updateJob(jobId: string, userId: string, data: UpdateJobData): Promise<JobResult> {
    const canEdit = await validateJobOwnership(jobId, userId);
    
    if (!canEdit) {
      throw new Error('You are not authorized to update this job');
    }

    const updateData: any = { ...data };
    if (data.applicationDeadline) {
      updateData.applicationDeadline = new Date(data.applicationDeadline);
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
      include: getJobInclude(),
    });

    return this.transformJobResult(job);
  }

  async deleteJob(jobId: string, userId: string): Promise<void> {
    const canDelete = await validateJobOwnership(jobId, userId);
    
    if (!canDelete) {
      throw new Error('You are not authorized to delete this job');
    }

    await prisma.job.delete({
      where: { id: jobId },
    });
  }

  private async checkSlugExists(companyId: string, slug: string): Promise<boolean> {
    const existing = await prisma.job.findFirst({
      where: {
        companyId,
        slug,
      },
    });
    return !!existing;
  }

  private transformJobResult(job: any): JobResult {
    return {
      ...job,
      applicationsCount: job._count.applications,
    };
  }
}

const jobService = new JobService();
export default jobService;