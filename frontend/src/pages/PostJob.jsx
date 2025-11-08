import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PostJob = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobDetails: {
      title: '',
      description: '',
      responsibilities: [],
      requirements: {
        skills: [],
        education: 'Any',
        experience: { min: 0, max: 5 }
      }
    },
    jobInfo: {
      type: 'Full-Time',
      location: {
        city: '',
        state: '',
        country: 'India',
        isRemote: false
      },
      salary: {
        min: '',
        max: '',
        currency: 'INR',
        isNegotiable: false
      }
    }
  });
  const [skillInput, setSkillInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        jobDetails: {
          ...formData.jobDetails,
          requirements: {
            ...formData.jobDetails.requirements,
            skills: [...formData.jobDetails.requirements.skills, skillInput.trim()]
          }
        }
      });
      setSkillInput('');
    }
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData({
        ...formData,
        jobDetails: {
          ...formData.jobDetails,
          responsibilities: [...formData.jobDetails.responsibilities, responsibilityInput.trim()]
        }
      });
      setResponsibilityInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in first');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/jobs', formData);
      if (response.data.success) {
        alert('Job posted successfully!');
        navigate('/job-platform');
      }
    } catch (error) {
      alert('Error posting job: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Post a Job</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Job Details */}
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Job Title *"
              className="w-full border rounded px-3 py-2"
              value={formData.jobDetails.title}
              onChange={(e) => setFormData({
                ...formData,
                jobDetails: { ...formData.jobDetails, title: e.target.value }
              })}
              required
            />
            <textarea
              placeholder="Job Description *"
              className="w-full border rounded px-3 py-2"
              rows="4"
              value={formData.jobDetails.description}
              onChange={(e) => setFormData({
                ...formData,
                jobDetails: { ...formData.jobDetails, description: e.target.value }
              })}
              required
            />

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium mb-2">Responsibilities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a responsibility"
                  className="border rounded px-3 py-2 flex-1"
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                />
                <button type="button" onClick={addResponsibility} className="bg-purple-600 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
              <ul className="list-disc list-inside">
                {formData.jobDetails.responsibilities.map((resp, i) => (
                  <li key={i} className="text-sm text-gray-700">{resp}</li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium mb-2">Required Skills *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  className="border rounded px-3 py-2 flex-1"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="bg-purple-600 text-white px-4 py-2 rounded">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.jobDetails.requirements.skills.map((skill, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="border rounded px-3 py-2"
                value={formData.jobDetails.requirements.education}
                onChange={(e) => setFormData({
                  ...formData,
                  jobDetails: {
                    ...formData.jobDetails,
                    requirements: { ...formData.jobDetails.requirements, education: e.target.value }
                  }
                })}
              >
                <option value="Any">Any Education</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduate">Graduate</option>
                <option value="Post-Graduate">Post-Graduate</option>
              </select>
              <input
                type="number"
                placeholder="Min Experience (years)"
                className="border rounded px-3 py-2"
                value={formData.jobDetails.requirements.experience.min}
                onChange={(e) => setFormData({
                  ...formData,
                  jobDetails: {
                    ...formData.jobDetails,
                    requirements: {
                      ...formData.jobDetails.requirements,
                      experience: { ...formData.jobDetails.requirements.experience, min: e.target.value }
                    }
                  }
                })}
              />
              <input
                type="number"
                placeholder="Max Experience (years)"
                className="border rounded px-3 py-2"
                value={formData.jobDetails.requirements.experience.max}
                onChange={(e) => setFormData({
                  ...formData,
                  jobDetails: {
                    ...formData.jobDetails,
                    requirements: {
                      ...formData.jobDetails.requirements,
                      experience: { ...formData.jobDetails.requirements.experience, max: e.target.value }
                    }
                  }
                })}
              />
            </div>
          </div>

          {/* Job Information */}
          <h2 className="text-xl font-semibold mb-4">Job Information</h2>
          <div className="space-y-4 mb-6">
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.jobInfo.type}
              onChange={(e) => setFormData({
                ...formData,
                jobInfo: { ...formData.jobInfo, type: e.target.value }
              })}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Freelance">Freelance</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City *"
                className="border rounded px-3 py-2"
                value={formData.jobInfo.location.city}
                onChange={(e) => setFormData({
                  ...formData,
                  jobInfo: {
                    ...formData.jobInfo,
                    location: { ...formData.jobInfo.location, city: e.target.value }
                  }
                })}
                required
              />
              <input
                type="text"
                placeholder="State *"
                className="border rounded px-3 py-2"
                value={formData.jobInfo.location.state}
                onChange={(e) => setFormData({
                  ...formData,
                  jobInfo: {
                    ...formData.jobInfo,
                    location: { ...formData.jobInfo.location, state: e.target.value }
                  }
                })}
                required
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.jobInfo.location.isRemote}
                onChange={(e) => setFormData({
                  ...formData,
                  jobInfo: {
                    ...formData.jobInfo,
                    location: { ...formData.jobInfo.location, isRemote: e.target.checked }
                  }
                })}
              />
              <span>Remote Position</span>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min Salary (INR)"
                className="border rounded px-3 py-2"
                value={formData.jobInfo.salary.min}
                onChange={(e) => setFormData({
                  ...formData,
                  jobInfo: {
                    ...formData.jobInfo,
                    salary: { ...formData.jobInfo.salary, min: e.target.value }
                  }
                })}
              />
              <input
                type="number"
                placeholder="Max Salary (INR)"
                className="border rounded px-3 py-2"
                value={formData.jobInfo.salary.max}
                onChange={(e) => setFormData({
                  ...formData,
                  jobInfo: {
                    ...formData.jobInfo,
                    salary: { ...formData.jobInfo.salary, max: e.target.value }
                  }
                })}
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.jobInfo.salary.isNegotiable}
                onChange={(e) => setFormData({
                  ...formData,
                  jobInfo: {
                    ...formData.jobInfo,
                    salary: { ...formData.jobInfo.salary, isNegotiable: e.target.checked }
                  }
                })}
              />
              <span>Salary Negotiable</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
