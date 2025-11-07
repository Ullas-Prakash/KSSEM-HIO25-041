import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const [stories, setStories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'stories') {
        const response = await api.get('/api/admin/stories');
        setStories(response.data.stories);
      } else if (activeTab === 'businesses') {
        const response = await api.get('/api/admin/businesses');
        setBusinesses(response.data.businesses);
      } else if (activeTab === 'stats') {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to fetch data. Make sure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/stories/${id}`);
      setStories(stories.filter((story) => story._id !== id));
      alert('Story deleted successfully');
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story');
    }
  };

  const handleDeleteBusiness = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/businesses/${id}`);
      setBusinesses(businesses.filter((business) => business._id !== id));
      alert('Business deleted successfully');
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Panel</h1>

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'stories'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Stories
            </button>
            <button
              onClick={() => setActiveTab('businesses')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'businesses'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Businesses
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'stats'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Statistics
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {activeTab === 'stories' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">
                      All Stories ({stories.length})
                    </h2>
                    {stories.length === 0 ? (
                      <p className="text-gray-500">No stories found</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left">Title</th>
                              <th className="px-4 py-3 text-left">Author</th>
                              <th className="px-4 py-3 text-left">Category</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-left">Likes</th>
                              <th className="px-4 py-3 text-left">Comments</th>
                              <th className="px-4 py-3 text-left">Date</th>
                              <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stories.map((story) => (
                              <tr key={story._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{story.title}</td>
                                <td className="px-4 py-3">
                                  {story.isAnonymous
                                    ? 'Anonymous'
                                    : story.author?.displayName || 'Unknown'}
                                </td>
                                <td className="px-4 py-3">{story.category}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      story.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {story.isActive ? 'Active' : 'Deleted'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">{story.likes?.length || 0}</td>
                                <td className="px-4 py-3">
                                  {story.comments?.length || 0}
                                </td>
                                <td className="px-4 py-3">
                                  {new Date(story.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                  {story.isActive && (
                                    <button
                                      onClick={() => handleDeleteStory(story._id)}
                                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'businesses' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">
                      All Businesses ({businesses.length})
                    </h2>
                    {businesses.length === 0 ? (
                      <p className="text-gray-500">No businesses found</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left">Name</th>
                              <th className="px-4 py-3 text-left">Owner</th>
                              <th className="px-4 py-3 text-left">Category</th>
                              <th className="px-4 py-3 text-left">City</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-left">Date</th>
                              <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {businesses.map((business) => (
                              <tr
                                key={business._id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="px-4 py-3">{business.name}</td>
                                <td className="px-4 py-3">
                                  {business.owner?.displayName || 'Unknown'}
                                </td>
                                <td className="px-4 py-3">{business.category}</td>
                                <td className="px-4 py-3">
                                  {business.address?.city || 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      business.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {business.isActive ? 'Active' : 'Deleted'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {new Date(business.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                  {business.isActive && (
                                    <button
                                      onClick={() => handleDeleteBusiness(business._id)}
                                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'stats' && stats && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Platform Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                        <p className="text-4xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-gradient-to-br from-secondary to-pink-600 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Total Stories</h3>
                        <p className="text-4xl font-bold">{stats.totalStories}</p>
                      </div>
                      <div className="bg-gradient-to-br from-accent to-yellow-600 text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">
                          Total Businesses
                        </h3>
                        <p className="text-4xl font-bold">{stats.totalBusinesses}</p>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4">Engagement Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                          <span className="text-gray-700 font-medium">
                            Total Likes
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {stats.engagement?.totalLikes || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                          <span className="text-gray-700 font-medium">
                            Total Comments
                          </span>
                          <span className="text-2xl font-bold text-secondary">
                            {stats.engagement?.totalComments || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
