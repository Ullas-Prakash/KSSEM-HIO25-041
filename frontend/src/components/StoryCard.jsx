import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StoryCard = ({ story, onLike, onComment }) => {
  const { currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(story.comments || []);

  const categoryColors = {
    Career: 'bg-blue-100 text-blue-800',
    Health: 'bg-green-100 text-green-800',
    Education: 'bg-purple-100 text-purple-800',
    Growth: 'bg-pink-100 text-pink-800',
  };

  const handleLike = () => {
    if (currentUser) {
      onLike(story._id);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() && currentUser) {
      const newComment = await onComment(story._id, commentText);
      if (newComment) {
        setComments([...comments, newComment]);
        setCommentText('');
      }
    }
  };

  const userLiked = currentUser && story.likes?.includes(currentUser.uid);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {story.author?.photoURL ? (
            <img
              src={story.author.photoURL}
              alt={story.author.displayName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              {story.author?.displayName?.[0] || 'A'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">
              {story.author?.displayName || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            categoryColors[story.category] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {story.category}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{story.title}</h3>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{story.content}</p>

      <div className="flex items-center space-x-6 border-t pt-4">
        <button
          onClick={handleLike}
          disabled={!currentUser}
          className={`flex items-center space-x-2 ${
            userLiked ? 'text-red-500' : 'text-gray-500'
          } hover:text-red-500 transition disabled:opacity-50`}
        >
          <svg
            className="w-6 h-6"
            fill={userLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{story.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500 hover:text-primary transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          <div className="space-y-3 mb-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {comment.author?.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryCard;
