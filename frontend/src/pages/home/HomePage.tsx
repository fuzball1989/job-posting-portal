import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../../services/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Fetch job categories for the hero section
  const { data: categoriesData } = useQuery(
    'jobCategories',
    apiService.getJobCategories,
    { staleTime: 300000 } // 5 minutes
  );

  // Fetch featured jobs
  const { data: featuredJobsData } = useQuery(
    'featuredJobs',
    () => apiService.searchJobs({ isFeatured: true, limit: 6 }),
    { staleTime: 300000 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { label: 'Active Jobs', value: '10,000+', icon: BriefcaseIcon },
    { label: 'Companies', value: '500+', icon: BuildingOfficeIcon },
    { label: 'Job Seekers', value: '50,000+', icon: UsersIcon },
    { label: 'Success Stories', value: '2,000+', icon: TrophyIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-3xl mx-auto">
              Discover thousands of job opportunities from top companies worldwide. 
              Your next career move starts here.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-none rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Location (city, state, country)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-none rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Search Jobs</span>
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2 inline-flex">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      {categoriesData?.categories && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore by Category
              </h2>
              <p className="text-xl text-gray-600">
                Find jobs in your field of expertise
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categoriesData.categories.slice(0, 10).map((category: any) => (
                <Link
                  key={category.id}
                  to={`/jobs?categoryId=${category.id}`}
                  className="group bg-gray-50 hover:bg-primary-50 border hover:border-primary-200 rounded-xl p-6 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 group-hover:bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BriefcaseIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.jobCount} jobs</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Jobs */}
      {featuredJobsData?.jobs && featuredJobsData.jobs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Jobs
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked opportunities from top companies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobsData.jobs.map((job: any) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
                >
                  <div className="flex items-start space-x-4">
                    {job.company.logoUrl ? (
                      <img
                        className="w-12 h-12 rounded-lg"
                        src={job.company.logoUrl}
                        alt={job.company.name}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.company.name}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        {job.location && (
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                        )}
                        <span className="capitalize">{job.remoteType.replace('_', ' ')}</span>
                      </div>
                      {job.salaryMin && job.salaryMax && (
                        <p className="text-primary-600 font-semibold mt-2">
                          {job.currency} {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                          <span className="text-gray-500">/{job.salaryType}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/jobs"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View All Jobs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started as Job Seeker
            </Link>
            <Link
              to="/register?role=employer"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Post Your First Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
