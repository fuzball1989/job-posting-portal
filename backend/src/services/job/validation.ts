import prisma from '../../config/database';

export const validateJobOwnership = async (jobId: string, userId: string): Promise<boolean> => {
  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        include: {
          members: {
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
  const isCompanyAdmin = existingJob.company.members.length > 0 && 
    existingJob.company.members.some((m: any) => 
      ['ADMIN', 'RECRUITER'].includes(m.role)
    );

  return isOwner || isCompanyAdmin;
};

export const validateUserCanPostJobs = async (userId: string): Promise<string> => {
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

  if (user.role !== 'EMPLOYER') {
    throw new Error('Only employers can post jobs');
  }

  if (!user.companyMemberships || user.companyMemberships.length === 0) {
    throw new Error('You must be associated with a company to post jobs');
  }

  return user.companyMemberships[0]?.companyId || '';
};