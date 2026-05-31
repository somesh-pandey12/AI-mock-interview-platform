const express = require('express');
const router = express.Router();
const { generateQuestions } = require('../services/geminiService');
const Interview = require('../models/Interview');

// @desc    Start a new interview & generate questions
// @route   POST /api/interview/start
router.post('/start', async (req, res) => {
    const { techStack, userId } = req.body;
    
    // Safety check: Don't call Gemini if data is missing
    if (!techStack || !userId) {
        return res.status(400).json({ message: "Missing techStack or userId fields" });
    }

    try {
        // 1. Fetch questions array from Gemini Service
        const questionsArray = await generateQuestions(techStack);
        
        // 2. Format it into an array of objects to match our Mongoose Schema
        const formattedQuestions = questionsArray.map(q => ({ question: q }));

        // 3. Create the document (Using 'stack' to match your schema definition)
        const newInterview = await Interview.create({
            userId,
            stack: techStack, // Fixed field matching
            questions: formattedQuestions
        });

        // 4. Return the newly created interview doc to the frontend
        res.status(200).json(newInterview);
    } catch (error) {
        console.error("Error in /interview/start:", error); // Log the real error for debugging
        res.status(500).json({ message: "Failed to start interview session" });
    }
});

module.exports = router;