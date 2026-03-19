const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/community/posts
// @desc    Get all posts
// @access  Public (or Private if you want to restrict viewing)
router.get('/posts', async (req, res) => {
  try {
    // Fetch posts and sort by newest first. Limit to 50 for now.
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
});

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { content, cropTag } = req.body;

    const newPost = new Post({
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content,
      cropTag
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating post' });
  }
});

// @route   POST /api/community/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/posts/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user already liked it
    const index = post.likes.indexOf(req.user.id);
    if (index === -1) {
      // Like
      post.likes.push(req.user.id);
    } else {
      // Unlike
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Server error liking post' });
  }
});

module.exports = router;
