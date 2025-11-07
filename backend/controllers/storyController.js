const Story = require('../models/Story');

exports.getStories = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const stories = await Story.find(query)
      .populate('author', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Story.countDocuments(query);

    const storiesWithAuthor = stories.map(story => {
      const storyObj = story.toObject();
      if (storyObj.isAnonymous) {
        storyObj.author = { displayName: 'Anonymous', photoURL: null };
      }
      return storyObj;
    });

    res.json({
      stories: storiesWithAuthor,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, content, category, isAnonymous } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const story = await Story.create({
      title,
      content,
      category,
      isAnonymous: isAnonymous || false,
      author: req.user._id,
    });

    await story.populate('author', 'displayName photoURL');

    res.status(201).json({ story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

exports.likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const likeIndex = story.likes.indexOf(userId);

    if (likeIndex > -1) {
      story.likes.splice(likeIndex, 1);
    } else {
      story.likes.push(userId);
    }

    await story.save();

    res.json({
      likes: story.likes.length,
      userLiked: likeIndex === -1,
    });
  } catch (error) {
    console.error('Error liking story:', error);
    res.status(500).json({ error: 'Failed to like story' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    story.comments.push({
      author: req.user._id,
      content,
    });

    await story.save();
    await story.populate('comments.author', 'displayName photoURL');

    const newComment = story.comments[story.comments.length - 1];

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id)
      .populate('comments.author', 'displayName photoURL');

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ comments: story.comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
