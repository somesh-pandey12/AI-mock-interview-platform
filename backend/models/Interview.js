const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    techStack: { type: String, required: true }, // e.g., "DSA in C++" or "React"
    status: { type: String, enum: ['Started', 'Completed'], default: 'Started' },
    questions: [{
        question: { type: String, required: true },
        userAnswer: { type: String, default: "" },
        aiFeedback: { type: String, default: "" },
        score: { type: Number, default: 0 }
    }],
    finalScore: { type: Number, default: 0 },
    overallFeedback: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', InterviewSchema);