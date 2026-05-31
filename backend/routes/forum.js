const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// @desc    Get all community posts
// @route   GET /api/forum
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch forum threads." });
    }
});

// @desc    Create a new community post
// @route   POST /api/forum/create
router.post('/create', async (req, res) => {
    const { userId, authorName, authorPic, title, content, tags } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content areas are required." });
    }

    try {
        const newPost = await Post.create({
            userId,
            authorName,
            authorPic,
            title,
            content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Failed to publish post." });
    }
});

// @desc    Upvote a post
// @route   POST /api/forum/:id/upvote
router.post('/:id/upvote', async (req, res) => {
    const { userId } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Thread not found." });

        // If user already upvoted, remove the upvote (toggle mechanic)
        if (post.upvotes.includes(userId)) {
            post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
        } else {
            post.upvotes.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Upvote transaction failed." });
    }
});

module.exports = router;