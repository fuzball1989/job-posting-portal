import { validateUserCanPostJobs } from '../../../../src/services/job/validation';

// Mock Prisma
jest.mock('../../../../src/config/database', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

import prisma from '../../../../src/config/database';

describe('Job Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserCanPostJobs', () => {
    test('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(validateUserCanPostJobs('invalid-user-id')).rejects.toThrow('User not found');
    });

    test('should throw error if user is not employer', async () => {
      const mockUser = {
        id: 'user-id',
        role: 'JOB_SEEKER',
        companyMemberships: [],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(validateUserCanPostJobs('user-id')).rejects.toThrow('Only employers can post jobs');
    });

    test('should throw error if user has no company memberships', async () => {
      const mockUser = {
        id: 'user-id',
        role: 'EMPLOYER',
        companyMemberships: [],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(validateUserCanPostJobs('user-id')).rejects.toThrow(
        'You must be associated with a company to post jobs'
      );
    });

    test('should return company ID for valid employer', async () => {
      const mockUser = {
        id: 'user-id',
        role: 'EMPLOYER',
        companyMemberships: [
          {
            companyId: 'company-id',
            isActive: true,
            company: { id: 'company-id', name: 'Test Company' },
          },
        ],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await validateUserCanPostJobs('user-id');
      expect(result).toBe('company-id');
    });
  });
});