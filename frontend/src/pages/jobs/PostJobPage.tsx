import React from 'react';

const PostJobPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Post a Job
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Job posting form will be implemented here with fields for:
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-600 space-y-1">
            <li>Job title and description</li>
            <li>Requirements and responsibilities</li>
            <li>Salary range and benefits</li>
            <li>Location and remote work options</li>
            <li>Employment type and experience level</li>
            <li>Required skills</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
