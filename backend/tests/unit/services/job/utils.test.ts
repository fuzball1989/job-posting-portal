import { generateSlug, buildSearchFilters, buildSortOrder } from '../../../../src/services/job/utils';

describe('Job Service Utils', () => {
  describe('generateSlug', () => {
    test('should generate slug from title', () => {
      expect(generateSlug('Senior Software Engineer')).toBe('senior-software-engineer');
    });

    test('should handle special characters', () => {
      expect(generateSlug('Full-Stack Developer (React/Node.js)')).toBe('full-stack-developer-react-node-js');
    });

    test('should handle multiple spaces', () => {
      expect(generateSlug('Frontend   Developer    Position')).toBe('frontend-developer-position');
    });

    test('should trim leading and trailing hyphens', () => {
      expect(generateSlug('---JavaScript Developer---')).toBe('javascript-developer');
    });
  });

  describe('buildSearchFilters', () => {
    test('should build basic filters', () => {
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

      const filters = buildSearchFilters(params);
      expect(filters).toEqual({
        status: 'ACTIVE',
      });
    });

    test('should handle search query', () => {
      const params = {
        search: 'javascript',
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

      const filters = buildSearchFilters(params);
      expect(filters.OR).toBeDefined();
      expect(filters.OR).toHaveLength(4);
    });

    test('should handle category filter', () => {
      const params = {
        categoryId: 'test-category-id',
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

      const filters = buildSearchFilters(params);
      expect(filters.categoryId).toBe('test-category-id');
    });

    test('should handle salary range', () => {
      const params = {
        salaryMin: 50000,
        salaryMax: 100000,
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
      };

      const filters = buildSearchFilters(params);
      expect(filters.salaryMin).toEqual({ gte: 50000 });
      expect(filters.salaryMax).toEqual({ lte: 100000 });
    });
  });

  describe('buildSortOrder', () => {
    test('should return default sort for invalid field', () => {
      const result = buildSortOrder('invalid', 'asc');
      expect(result).toEqual({ createdAt: 'desc' });
    });

    test('should return correct sort for valid field', () => {
      const result = buildSortOrder('title', 'asc');
      expect(result).toEqual({ title: 'asc' });
    });

    test('should handle all valid sort fields', () => {
      const validFields = ['createdAt', 'title', 'salaryMin', 'salaryMax', 'viewsCount', 'applicationsCount'];
      
      validFields.forEach(field => {
        const result = buildSortOrder(field, 'desc');
        expect(result).toEqual({ [field]: 'desc' });
      });
    });
  });
});