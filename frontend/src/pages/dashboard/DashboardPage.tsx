import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {user?.firstName}!
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            Your personalized dashboard will be implemented here with:
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-600 space-y-1">
            <li>Job application tracking</li>
            <li>Saved jobs</li>
            <li>Profile completion status</li>
            <li>Recent activity</li>
            {user?.role === 'employer' && (
              <>
                <li>Posted jobs management</li>
                <li>Application reviews</li>
                <li>Company analytics</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
