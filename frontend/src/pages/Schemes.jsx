import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SchemeAIAssistant from '../components/SchemeAIAssistant';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    state_ut: '',
    level: '',
    search: '',
  });
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [aiAssistantScheme, setAiAssistantScheme] = useState(null);
  const [naturalQuery, setNaturalQuery] = useState('');
  const [naturalSearching, setNaturalSearching] = useState(false);

  useEffect(() => {
    fetchSchemes();
    fetchCategories();
    fetchStates();
  }, []);

  const fetchSchemes = async (filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filterParams);
      const response = await api.get(`/api/schemes?${params}`);
      setSchemes(response.data.schemes);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/schemes/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await api.get('/api/schemes/states');
      setStates(response.data.states);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const activeFilters = Object.entries(newFilters)
      .filter(([_, v]) => v !== '')
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    
    fetchSchemes(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      state_ut: '',
      level: '',
      search: '',
    });
    fetchSchemes();
  };

  const handleNaturalSearch = async () => {
    if (!naturalQuery.trim()) return;
    
    setNaturalSearching(true);
    try {
      const response = await api.post('/api/schemes/ai/search', {
        query: naturalQuery,
      });
      setSchemes(response.data.schemes);
    } catch (error) {
      console.error('Error in natural search:', error);
      alert('Failed to search. Please try again.');
    } finally {
      setNaturalSearching(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Education': '🎓',
      'Health': '🏥',
      'Girl Child': '👧',
      'Senior Women': '👵',
      'Widows': '👩‍🦳',
      'Rural Women': '🚜',
      'Women Farmers': '🌾',
    };
    return icons[category] || '📋';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Government Schemes</h1>
          <p className="text-gray-600">Explore welfare schemes for women across India</p>
        </div>

        {/* AI Natural Language Search */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">🤖</span>
            <div>
              <h2 className="text-xl font-bold">AI-Powered Search</h2>
              <p className="text-sm opacity-90">Ask in your own words - our AI will find the right schemes for you</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNaturalSearch()}
              placeholder="e.g., 'I'm a farmer looking for financial help' or 'Schemes for my daughter's education'"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={handleNaturalSearch}
              disabled={naturalSearching || !naturalQuery.trim()}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {naturalSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search schemes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/UT</label>
              <select
                value={filters.state_ut}
                onChange={(e) => handleFilterChange('state_ut', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Levels</option>
                <option value="Central">Central</option>
                <option value="State">State</option>
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-primary hover:text-opacity-80 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No schemes found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found {schemes.length} scheme{schemes.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme) => (
                <div
                  key={scheme._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{getCategoryIcon(scheme.category)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      scheme.level === 'Central' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {scheme.level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{scheme.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scheme.short_description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Category:</span>
                      <span className="text-primary">{scheme.category}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">State:</span>
                      <span>{scheme.state_ut}</span>
                    </div>
                    {scheme.application_mode && (
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium mr-2">Apply:</span>
                        <span>{scheme.application_mode}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAiAssistantScheme(scheme);
                      }}
                      className="px-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-opacity-90 transition"
                      title="AI Assistant"
                    >
                      🤖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* AI Assistant Modal */}
        {aiAssistantScheme && (
          <SchemeAIAssistant
            scheme={aiAssistantScheme}
            onClose={() => setAiAssistantScheme(null)}
          />
        )}

        {/* Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedScheme(null)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedScheme.name}</h2>
                <button onClick={() => setSelectedScheme(null)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600">{selectedScheme.short_description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Benefits</h3>
                  <p className="text-gray-600">{selectedScheme.benefits}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Eligibility</h3>
                  <p className="text-gray-600">{selectedScheme.eligibility_summary}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Category</h3>
                    <p className="text-gray-600">{selectedScheme.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Level</h3>
                    <p className="text-gray-600">{selectedScheme.level}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">State/UT</h3>
                    <p className="text-gray-600">{selectedScheme.state_ut}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Application Mode</h3>
                    <p className="text-gray-600">{selectedScheme.application_mode || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Ministry/Department</h3>
                  <p className="text-gray-600">{selectedScheme.ministry_department}</p>
                </div>
                
                {selectedScheme.implementing_agency && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Implementing Agency</h3>
                    <p className="text-gray-600">{selectedScheme.implementing_agency}</p>
                  </div>
                )}
                
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => {
                      setAiAssistantScheme(selectedScheme);
                      setSelectedScheme(null);
                    }}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    🤖 Get AI Help (Check Eligibility, Documents & More)
                  </button>
                  
                  <div className="flex gap-4">
                    {selectedScheme.official_url && (
                      <a
                        href={selectedScheme.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition text-center"
                      >
                        Official Website
                      </a>
                    )}
                    {selectedScheme.application_portal_url && (
                      <a
                        href={selectedScheme.application_portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition text-center"
                      >
                        Apply Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
