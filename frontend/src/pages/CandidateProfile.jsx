import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CandidateProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      age: '',
      phone: '',
      location: { city: '', state: '', country: 'India' }
    },
    professionalInfo: {
      skills: [],
      education: { level: '10th', field: '', institution: '' },
      experience: { years: 0, description: '' }
    },
    preferences: {
      jobTypes: [],
      preferredLocations: [],
      expectedSalary: { min: '', max: '', currency: 'INR' }
    }
  });
  const [skillInput, setSkillInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!currentUser) return;
    
    try {
      const response = await api.get('/api/candidates/profile');
      if (response.data.success) {
        setProfile(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.log('No profile found, creating new one');
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
      const response = await api.post('/api/candidates/profile', formData);
      if (response.data.success) {
        alert('Profile saved successfully! Redirecting to job platform...');
        setProfile(response.data.data);
        setTimeout(() => navigate('/job-platform'), 1500);
      }
    } catch (error) {
      alert('Error saving profile: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile || !currentUser) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const response = await api.post('/api/candidates/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('Resume uploaded successfully!');
        fetchProfile();
      }
    } catch (error) {
      alert('Error uploading resume: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        professionalInfo: {
          ...formData.professionalInfo,
          skills: [...formData.professionalInfo.skills, skillInput.trim()]
        }
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    const newSkills = formData.professionalInfo.skills.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      professionalInfo: { ...formData.professionalInfo, skills: newSkills }
    });
  };

  const addLocation = () => {
    if (locationInput.trim()) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          preferredLocations: [...formData.preferences.preferredLocations, locationInput.trim()]
        }
      });
      setLocationInput('');
    }
  };

  const toggleJobType = (type) => {
    const current = formData.preferences.jobTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, jobTypes: updated }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Candidate Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Personal Information */}
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Full Name *"
              className="border rounded px-3 py-2"
              value={formData.personalInfo.fullName}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, fullName: e.target.value }
              })}
              required
            />
            <input
              type="number"
              placeholder="Age"
              className="border rounded px-3 py-2"
              value={formData.personalInfo.age}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, age: e.target.value }
              })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="border rounded px-3 py-2"
              value={formData.personalInfo.phone}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, phone: e.target.value }
              })}
            />
            <input
              type="text"
              placeholder="City *"
              className="border rounded px-3 py-2"
              value={formData.personalInfo.location.city}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  location: { ...formData.personalInfo.location, city: e.target.value }
                }
              })}
              required
            />
            <input
              type="text"
              placeholder="State *"
              className="border rounded px-3 py-2"
              value={formData.personalInfo.location.state}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: {
                  ...formData.personalInfo,
                  location: { ...formData.personalInfo.location, state: e.target.value }
                }
              })}
              required
            />
          </div>

          {/* Professional Information */}
          <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
          
          {/* Skills */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Skills *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a skill (e.g., Typing, MS Word)"
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
              {formData.professionalInfo.skills.map((skill, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)} className="text-purple-900 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={formData.professionalInfo.education.level}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: {
                  ...formData.professionalInfo,
                  education: { ...formData.professionalInfo.education, level: e.target.value }
                }
              })}
              required
            >
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Graduate">Graduate</option>
              <option value="Post-Graduate">Post-Graduate</option>
            </select>
            <input
              type="text"
              placeholder="Field of Study"
              className="border rounded px-3 py-2"
              value={formData.professionalInfo.education.field}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: {
                  ...formData.professionalInfo,
                  education: { ...formData.professionalInfo.education, field: e.target.value }
                }
              })}
            />
            <input
              type="text"
              placeholder="Institution"
              className="border rounded px-3 py-2"
              value={formData.professionalInfo.education.institution}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: {
                  ...formData.professionalInfo,
                  education: { ...formData.professionalInfo.education, institution: e.target.value }
                }
              })}
            />
          </div>

          {/* Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="number"
              placeholder="Years of Experience"
              className="border rounded px-3 py-2"
              value={formData.professionalInfo.experience.years}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: {
                  ...formData.professionalInfo,
                  experience: { ...formData.professionalInfo.experience, years: e.target.value }
                }
              })}
            />
            <textarea
              placeholder="Experience Description"
              className="border rounded px-3 py-2"
              value={formData.professionalInfo.experience.description}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: {
                  ...formData.professionalInfo,
                  experience: { ...formData.professionalInfo.experience, description: e.target.value }
                }
              })}
            />
          </div>

          {/* Preferences */}
          <h2 className="text-xl font-semibold mb-4">Job Preferences</h2>
          
          {/* Job Types */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Preferred Job Types *</label>
            <div className="flex flex-wrap gap-2">
              {['Full-Time', 'Part-Time', 'Freelance', 'Remote', 'Contract'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleJobType(type)}
                  className={`px-4 py-2 rounded ${
                    formData.preferences.jobTypes.includes(type)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Preferred Locations</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a location"
                className="border rounded px-3 py-2 flex-1"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
              />
              <button type="button" onClick={addLocation} className="bg-purple-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.preferences.preferredLocations.map((loc, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Expected Salary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="number"
              placeholder="Min Salary (INR)"
              className="border rounded px-3 py-2"
              value={formData.preferences.expectedSalary.min}
              onChange={(e) => setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  expectedSalary: { ...formData.preferences.expectedSalary, min: e.target.value }
                }
              })}
            />
            <input
              type="number"
              placeholder="Max Salary (INR)"
              className="border rounded px-3 py-2"
              value={formData.preferences.expectedSalary.max}
              onChange={(e) => setFormData({
                ...formData,
                preferences: {
                  ...formData.preferences,
                  expectedSalary: { ...formData.preferences.expectedSalary, max: e.target.value }
                }
              })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* Resume Upload */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resume Upload</h2>
          <form onSubmit={handleResumeUpload}>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mb-4"
            />
            <button
              type="submit"
              disabled={loading || !resumeFile}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
          {profile?.professionalInfo?.resume?.fileName && (
            <p className="mt-4 text-green-600">✓ Resume uploaded: {profile.professionalInfo.resume.fileName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
