import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  remoteType: string;
  employmentType: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryType: string;
  skillsRequired: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  createdAt: string;
  applicationsCount?: number;
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    location?: string;
    isVerified: boolean;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;
    
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US').format(num);
    };
    
    const currency = job.currency || 'USD';
    const period = job.salaryType === 'yearly' ? '/year' : 
                   job.salaryType === 'monthly' ? '/month' : 
                   job.salaryType === 'weekly' ? '/week' : '/hour';
    
    if (job.salaryMin && job.salaryMax) {
      return `${currency} ${formatNumber(job.salaryMin)} - ${formatNumber(job.salaryMax)} ${period}`;
    } else if (job.salaryMin) {
      return `${currency} ${formatNumber(job.salaryMin)}+ ${period}`;
    } else if (job.salaryMax) {
      return `Up to ${currency} ${formatNumber(job.salaryMax)} ${period}`;
    }
    
    return null;
  };

  const formatEmploymentType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatRemoteType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just posted' : `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={`${job.company.name} logo`}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {job.company.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {job.company.name}
                </h3>
                {job.company.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500">{job.company.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {job.isFeatured && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {job.isUrgent && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Urgent
              </span>
            )}
          </div>
        </div>

        {/* Job Title and Description */}
        <div className="mb-4">
          <Link
            to={`/jobs/${job.id}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {job.title}
          </Link>
          <p className="text-gray-600 mt-2 line-clamp-2">
            {job.description}
          </p>
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          {job.location && (
            <div className="flex items-center space-x-1">
              <MapPinIcon className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{formatEmploymentType(job.employmentType)}</span>
          </div>
          
          {job.remoteType !== 'office' && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              {formatRemoteType(job.remoteType)}
            </span>
          )}
          
          {job.experienceLevel && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
            </span>
          )}
        </div>

        {/* Salary */}
        {formatSalary() && (
          <div className="flex items-center space-x-1 text-green-600 font-medium mb-4">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span>{formatSalary()}</span>
          </div>
        )}

        {/* Skills */}
        {job.skillsRequired.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {job.skillsRequired.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {job.skillsRequired.length > 5 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{job.skillsRequired.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{timeAgo(job.createdAt)}</span>
            {job.category && (
              <span className="text-blue-600">#{job.category.name}</span>
            )}
            {typeof job.applicationsCount === 'number' && (
              <span>{job.applicationsCount} applicant{job.applicationsCount !== 1 ? 's' : ''}</span>
            )}
          </div>
          
          <Link
            to={`/jobs/${job.id}`}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;