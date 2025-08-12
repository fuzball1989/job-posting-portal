import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import apiService from '../../services/api';
import JobCard from '../../components/job/JobCard';
import JobFilters from '../../components/job/JobFilters';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

interface JobSearchParams {
  search?: string;
  categoryId?: string;
  location?: string;
  remoteType?: string[];
  employmentType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse URL parameters
  const searchParameters: JobSearchParams = useMemo(() => ({
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    location: searchParams.get('location') || undefined,
    remoteType: searchParams.getAll('remoteType'),
    employmentType: searchParams.getAll('employmentType'),
    experienceLevel: searchParams.getAll('experienceLevel'),
    salaryMin: searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
    salaryMax: searchParams.get('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  }), [searchParams]);

  // Fetch jobs
  const {
    data: jobsData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery(
    ['jobs', searchParameters],
    () => apiService.searchJobs(searchParameters),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch job categories for filters
  const { data: categoriesData } = useQuery(
    'jobCategories',
    () => apiService.getJobCategories(),
    {
      refetchOnWindowFocus: false,
    }
  );

  const updateSearchParams = (newParams: Partial<JobSearchParams>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        updatedParams.delete(key);
      } else if (Array.isArray(value)) {
        updatedParams.delete(key);
        value.forEach(v => updatedParams.append(key, v));
      } else {
        updatedParams.set(key, value.toString());
      }
    });
    
    // Reset page when changing filters
    if (Object.keys(newParams).some(key => key !== 'page' && key !== 'sortBy' && key !== 'sortOrder')) {
      updatedParams.set('page', '1');
    }
    
    setSearchParams(updatedParams);
  };

  const handleSearch = (searchTerm: string) => {
    updateSearchParams({ search: searchTerm });
  };

  const handleFilterChange = (filters: Partial<JobSearchParams>) => {
    updateSearchParams(filters);
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateSearchParams({ sortBy, sortOrder });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load jobs. Please try again.');
    }
  }, [isError, error]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchParameters.search) count++;
    if (searchParameters.categoryId) count++;
    if (searchParameters.location) count++;
    if (searchParameters.remoteType?.length) count++;
    if (searchParameters.employmentType?.length) count++;
    if (searchParameters.experienceLevel?.length) count++;
    if (searchParameters.salaryMin || searchParameters.salaryMax) count++;
    return count;
  }, [searchParameters]);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We couldn't load the job listings. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600 mb-6">
            Discover opportunities from top companies around the world
          </p>
          
          {/* Search Bar */}
          <SearchBar
            placeholder="Search for jobs, companies, or keywords..."
            value={searchParameters.search || ''}
            onSearch={handleSearch}
            className="mb-4"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>
              
              <JobFilters
                values={searchParameters}
                onChange={handleFilterChange}
                categories={categoriesData?.categories || []}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  {isLoading ? (
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">
                        {jobsData?.pagination.total || 0}
                      </span>
                      {' '}
                      {jobsData?.pagination.total === 1 ? 'job' : 'jobs'} found
                      {searchParameters.search && (
                        <span> for "<span className="font-medium">{searchParameters.search}</span>"</span>
                      )}
                    </p>
                  )}
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={`${searchParameters.sortBy}-${searchParameters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt-desc">Newest first</option>
                    <option value="createdAt-asc">Oldest first</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                    <option value="salaryMax-desc">Highest salary</option>
                    <option value="salaryMin-asc">Lowest salary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsData?.jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or removing some filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobsData?.jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {jobsData && jobsData.pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={jobsData.pagination.page}
                  totalPages={jobsData.pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={jobsData.pagination.hasNext}
                  hasPrev={jobsData.pagination.hasPrev}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
