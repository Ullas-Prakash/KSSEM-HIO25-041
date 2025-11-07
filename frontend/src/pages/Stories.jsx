import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import api from '../services/api';

const Stories = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Career',
    isAnonymous: false,
  });

  const categories = ['Career', 'Health', 'Education', 'Growth'];

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await api.get('/api/stories', { params });
      setStories(response.data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login to share your story');
      return;
    }

    try {
      const response = await api.post('/api/stories', formData);
      setStories([response.data.story, ...stories]);
      setFormData({
        title: '',
        content: '',
        category: 'Career',
        isAnonymous: false,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story');
    }
  };

  const handleLike = async (storyId) => {
    try {
      const response = await api.put(`/api/stories/${storyId}/like`);
      setStories(
        stories.map((story) =>
          story._id === storyId
            ? {
                ...story,
                likes: response.data.userLiked
                  ? [...(story.likes || []), currentUser.uid]
                  : (story.likes || []).filter((id) => id !== currentUser.uid),
              }
            : story
        )
      );
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const handleComment = async (storyId, content) => {
    try {
      const response = await api.post(`/api/stories/${storyId}/comments`, {
        content,
      });
      return response.data.comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Story Hub</h1>
          {currentUser && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {showForm ? 'Cancel' : 'Share Your Story'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Story
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({ ...formData, isAnonymous: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="anonymous" className="text-gray-700">
                  Post anonymously
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                Share Story
              </button>
            </form>
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === ''
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              No stories yet. Be the first to share!
            </p>
          </div>
        ) : (
          <div>
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
