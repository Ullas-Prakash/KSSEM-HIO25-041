import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const BrowseCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    searchCandidates();
  }, []);

  const searchCandidates = async () => {
    setLoading(true);
    try {
      // For now, we'll get all candidates. In production, add search filters
      const response = await api.get('/api/admin/candidates');
      setCandidates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
    setLoading(false);
  };

  const inviteCandidate = async (candidateId, jobId) => {
    try {
      const response = await api.post(`/api/jobs/${jobId}/invite`, {
        candidateId,
        message: 'We think you would be a great fit for this position!'
      });
      if (response.data.success) {
        alert('Invitation sent successfully!');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Failed to send invitation'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Browse Candidates</h1>
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
              placeholder="Search by skills, education, location..."
              className="border rounded px-4 py-3 flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={searchCandidates}
              className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Candidate Listings */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading candidates...</div>
          ) : (
            candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800">{candidate.personalInfo.fullName}</h3>
                    <p className="text-gray-600">
                      📍 {candidate.personalInfo.location.city}, {candidate.personalInfo.location.state}
                    </p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.professionalInfo.skills.map((skill, i) => (
                          <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-6 mt-4 text-sm text-gray-600">
                      <span>🎓 {candidate.professionalInfo.education.level}</span>
                      <span>💼 {candidate.professionalInfo.experience.years} years experience</span>
                      {candidate.preferences.jobTypes.length > 0 && (
                        <span>⏰ {candidate.preferences.jobTypes.join(', ')}</span>
                      )}
                    </div>

                    {candidate.professionalInfo.experience.description && (
                      <p className="text-gray-700 mt-3 text-sm">
                        {candidate.professionalInfo.experience.description.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex gap-3">
                  <button
                    onClick={() => alert('Select a job to send invitation')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Send Invitation
                  </button>
                  <button
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))
          )}

          {!loading && candidates.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No candidates found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCandidates;
