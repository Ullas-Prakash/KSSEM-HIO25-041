import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JobSearch = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMatches, setShowMatches] = useState(true);

  useEffect(() => {
    fetchMatches();
    searchJobs();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/api/candidates/matches?limit=10');
      setMatches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const searchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/jobs?keywords=${searchTerm}`);
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
    setLoading(false);
  };

  const applyForJob = async (jobId) => {
    if (!currentUser) {
      alert('Please log in first');
      return;
    }
    try {
      const response = await api.post('/api/applications', {
        jobId,
        coverLetter: 'I am interested in this position'
      });
      if (response.data.success) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Failed to apply'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-600">Find Jobs</h1>
          <button
            onClick={() => navigate('/job-platform')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by keywords, skills, location..."
              className="border rounded px-4 py-3 flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchJobs()}
            />
            <button
              onClick={searchJobs}
              className="bg-purple-600 text-white px-8 py-3 rounded hover:bg-purple-700 font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Toggle between Matches and All Jobs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowMatches(true)}
            className={`px-6 py-2 rounded font-semibold ${
              showMatches ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Recommended for You ({matches.length})
          </button>
          <button
            onClick={() => setShowMatches(false)}
            className={`px-6 py-2 rounded font-semibold ${
              !showMatches ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading jobs...</div>
          ) : (
            (showMatches ? matches : jobs).map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">{job.jobDetails.title}</h3>
                        <p className="text-gray-600 font-semibold">{job.employer?.companyInfo?.name}</p>
                      </div>
                      {job.matchScore && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          {job.matchScore}% Match
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <span>📍 {job.jobInfo.location.city}, {job.jobInfo.location.state}</span>
                      <span>💼 {job.jobInfo.type}</span>
                      {job.jobInfo.salary.min && (
                        <span>💰 ₹{job.jobInfo.salary.min} - ₹{job.jobInfo.salary.max}</span>
                      )}
                    </div>

                    <p className="text-gray-700 mt-4">{job.jobDetails.description.substring(0, 200)}...</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.jobDetails.requirements.skills.slice(0, 6).map((skill, i) => (
                        <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4 text-sm text-gray-600">
                      <span>🎓 {job.jobDetails.requirements.education}</span>
                      <span>📅 Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex gap-3">
                  <button
                    onClick={() => applyForJob(job._id)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-semibold"
                  >
                    Apply Now
                  </button>
                  <button
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}

          {!loading && (showMatches ? matches : jobs).length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No jobs found. Try adjusting your search or complete your profile for better matches.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
