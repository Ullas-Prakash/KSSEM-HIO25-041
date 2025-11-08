import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JobPlatform = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    if (!currentUser) {
      setLoading(false);
      setUserRole('none');
      return;
    }
    
    try {
      // Check if candidate
      try {
        const candResponse = await api.get('/api/candidates/profile');
        if (candResponse.data.success) {
          setUserRole('candidate');
          setLoading(false);
          return;
        }
      } catch (e) {}

      // Check if employer
      try {
        const empResponse = await api.get('/api/employers/profile');
        if (empResponse.data.success) {
          setUserRole('employer');
          setLoading(false);
          return;
        }
      } catch (e) {}

      setUserRole('none');
      setLoading(false);
    } catch (error) {
      console.error('Error checking role:', error);
      setUserRole('none');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Show options for both job seekers and employers
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-purple-600 mb-4 text-center">Job Platform</h1>
        <p className="text-center text-gray-600 mb-12">Connecting women with opportunities</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Job Seekers */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">For Job Seekers</h2>
              <p className="text-gray-600 mb-6">Find your dream job and build your career</p>
            </div>

            <div className="space-y-4">
              {userRole === 'candidate' ? (
                <>
                  <button
                    onClick={() => navigate('/candidate-profile')}
                    className="w-full bg-purple-100 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-200 transition font-semibold"
                  >
                    📝 My Profile
                  </button>
                  <button
                    onClick={() => navigate('/job-search')}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    🔍 Browse Jobs
                  </button>
                  <button
                    onClick={() => navigate('/my-applications')}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    📄 My Applications
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/candidate-profile')}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    Get Started - Create Profile
                  </button>
                  <div className="text-sm text-gray-500 text-center">
                    <p>✓ Upload your resume</p>
                    <p>✓ Get matched with jobs</p>
                    <p>✓ Apply instantly</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* For Employers */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">For Employers</h2>
              <p className="text-gray-600 mb-6">Find talented women for your team</p>
            </div>

            <div className="space-y-4">
              {userRole === 'employer' ? (
                <>
                  <button
                    onClick={() => navigate('/employer-profile')}
                    className="w-full bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition font-semibold"
                  >
                    🏢 My Company Profile
                  </button>
                  <button
                    onClick={() => navigate('/post-job')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    ➕ Post a Job
                  </button>
                  <button
                    onClick={() => navigate('/browse-candidates')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    👥 Browse Candidates
                  </button>
                  <button
                    onClick={() => navigate('/my-jobs')}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    📋 My Job Postings
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/employer-profile')}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Get Started - Create Company Profile
                  </button>
                  <div className="text-sm text-gray-500 text-center">
                    <p>✓ Post unlimited jobs</p>
                    <p>✓ Find qualified candidates</p>
                    <p>✓ Smart matching</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPlatform;
