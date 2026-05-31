const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // Markdown text containing code blocks
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }], // e.g., ['gitconflict', 'npm-error']
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forum', ForumSchema);