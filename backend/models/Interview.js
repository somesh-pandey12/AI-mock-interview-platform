const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    userAnswer: {
        type: String,
        default: ""
    },
    aiFeedback: {
        type: String,
        default: ""
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },

    // 🚀 Enterprise Telemetry Block
    telemetry: {
        executionTime: {
            type: String,
            default: "0ms"
        },
        memoryUsed: {
            type: String,
            default: "0 MB"
        },
        testCases: [
            {
                id: Number,
                name: String,
                passed: Boolean,
                runtime: String
            }
        ]
    }
}, { timestamps: true });

const InterviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true // Indexed for rapid performance lookups per user
    },

    techStack: {
        type: String,
        required: true
    },

    questions: [QuestionSchema],

    finalScore: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: 'In Progress',
        enum: ['In Progress', 'Completed', 'Aborted']
    },

    // 🚀 Enterprise Analytics Metric Hook
    completedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true }); // Automatically creates createdAt and updatedAt

module.exports = mongoose.model('Interview', InterviewSchema);