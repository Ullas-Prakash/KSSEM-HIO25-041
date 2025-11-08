import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EmployerProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    companyInfo: {
      name: '',
      registrationNumber: '',
      description: '',
      industry: '',
      size: '1-10',
      website: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      }
    }
  });
  const [verificationDocs, setVerificationDocs] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!currentUser) return;
    
    try {
      const response = await api.get('/api/employers/profile');
      if (response.data.success) {
        setProfile(response.data.data);
        setFormData({
          companyInfo: response.data.data.companyInfo,
          contactInfo: response.data.data.contactInfo
        });
      }
    } catch (error) {
      console.log('No profile found');
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
      const response = await api.post('/api/employers/profile', formData);
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

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (verificationDocs.length === 0 || !currentUser) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      verificationDocs.forEach(file => {
        formData.append('documents', file);
      });
      
      const response = await api.post('/api/employers/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('Verification documents submitted successfully!');
        fetchProfile();
      }
    } catch (error) {
      alert('Error submitting documents: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Employer Profile</h1>

        {/* Verification Status */}
        {profile && (
          <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${getStatusColor(profile.verification.status)}`}>
            <p className="font-semibold">
              Verification Status: <span className="uppercase">{profile.verification.status}</span>
            </p>
            {profile.verification.status === 'rejected' && profile.verification.rejectionReason && (
              <p className="text-sm mt-2">Reason: {profile.verification.rejectionReason}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Company Information */}
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Company Name *"
              className="border rounded px-3 py-2"
              value={formData.companyInfo.name}
              onChange={(e) => setFormData({
                ...formData,
                companyInfo: { ...formData.companyInfo, name: e.target.value }
              })}
              required
            />
            <input
              type="text"
              placeholder="Registration Number"
              className="border rounded px-3 py-2"
              value={formData.companyInfo.registrationNumber}
              onChange={(e) => setFormData({
                ...formData,
                companyInfo: { ...formData.companyInfo, registrationNumber: e.target.value }
              })}
            />
            <input
              type="text"
              placeholder="Industry"
              className="border rounded px-3 py-2"
              value={formData.companyInfo.industry}
              onChange={(e) => setFormData({
                ...formData,
                companyInfo: { ...formData.companyInfo, industry: e.target.value }
              })}
            />
            <select
              className="border rounded px-3 py-2"
              value={formData.companyInfo.size}
              onChange={(e) => setFormData({
                ...formData,
                companyInfo: { ...formData.companyInfo, size: e.target.value }
              })}
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
            <input
              type="url"
              placeholder="Website"
              className="border rounded px-3 py-2 md:col-span-2"
              value={formData.companyInfo.website}
              onChange={(e) => setFormData({
                ...formData,
                companyInfo: { ...formData.companyInfo, website: e.target.value }
              })}
            />
            <textarea
              placeholder="Company Description"
              className="border rounded px-3 py-2 md:col-span-2"
              rows="3"
              value={formData.companyInfo.description}
              onChange={(e) => setFormData({
                ...formData,
                companyInfo: { ...formData.companyInfo, description: e.target.value }
              })}
            />
          </div>

          {/* Contact Information */}
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="tel"
              placeholder="Phone Number *"
              className="border rounded px-3 py-2"
              value={formData.contactInfo.phone}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, phone: e.target.value }
              })}
              required
            />
            <input
              type="email"
              placeholder="Email *"
              className="border rounded px-3 py-2"
              value={formData.contactInfo.email}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: { ...formData.contactInfo, email: e.target.value }
              })}
              required
            />
            <input
              type="text"
              placeholder="Street Address"
              className="border rounded px-3 py-2 md:col-span-2"
              value={formData.contactInfo.address.street}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  address: { ...formData.contactInfo.address, street: e.target.value }
                }
              })}
            />
            <input
              type="text"
              placeholder="City *"
              className="border rounded px-3 py-2"
              value={formData.contactInfo.address.city}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  address: { ...formData.contactInfo.address, city: e.target.value }
                }
              })}
              required
            />
            <input
              type="text"
              placeholder="State *"
              className="border rounded px-3 py-2"
              value={formData.contactInfo.address.state}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  address: { ...formData.contactInfo.address, state: e.target.value }
                }
              })}
              required
            />
            <input
              type="text"
              placeholder="Zip Code"
              className="border rounded px-3 py-2"
              value={formData.contactInfo.address.zipCode}
              onChange={(e) => setFormData({
                ...formData,
                contactInfo: {
                  ...formData.contactInfo,
                  address: { ...formData.contactInfo.address, zipCode: e.target.value }
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

        {/* Verification Documents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Documents</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload company registration documents, business license, or other proof of legitimacy (up to 5 files)
          </p>
          <form onSubmit={handleVerificationSubmit}>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.jpg,.png"
              onChange={(e) => setVerificationDocs(Array.from(e.target.files))}
              className="mb-4"
            />
            <button
              type="submit"
              disabled={loading || verificationDocs.length === 0}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </form>
          {profile?.verification?.documents?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Submitted Documents:</p>
              <ul className="list-disc list-inside">
                {profile.verification.documents.map((doc, index) => (
                  <li key={index} className="text-sm text-gray-600">{doc.fileName}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
