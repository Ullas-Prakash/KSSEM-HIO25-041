const Story = require('../models/Story');
const Business = require('../models/Business');
const User = require('../models/User');

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ stories });
  } catch (error) {
    console.error('Error fetching all stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.isActive = false;
    await story.save();

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find()
      .populate('owner', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Error fetching all businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    business.isActive = false;
    await business.save();

    res.json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ error: 'Failed to delete business' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStories = await Story.countDocuments({ isActive: true });
    const totalBusinesses = await Business.countDocuments({ isActive: true });

    const stories = await Story.find({ isActive: true });
    const totalLikes = stories.reduce((sum, story) => sum + story.likes.length, 0);
    const totalComments = stories.reduce((sum, story) => sum + story.comments.length, 0);

    res.json({
      totalUsers,
      totalStories,
      totalBusinesses,
      engagement: {
        totalLikes,
        totalComments,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
