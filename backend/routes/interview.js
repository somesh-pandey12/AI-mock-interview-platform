const express = require('express');
const router = express.Router();

const {
    generateQuestions,
    evaluateAnswer
} = require('../services/geminiService');

const Interview = require('../models/Interview');


// ===========================================
// @desc    Start a new interview
// @route   POST /api/interview/start
// ===========================================
router.post('/start', async (req, res) => {
    const { techStack, userId } = req.body;

    if (!techStack || !userId) {
        return res.status(400).json({
            message: "Missing techStack or userId fields"
        });
    }

    try {
        // Generate questions from Gemini
        const questionsArray = await generateQuestions(techStack);

        // Convert to schema format
        const formattedQuestions = questionsArray.map(q => ({
            question: q
        }));

        // Create interview session
        const newInterview = await Interview.create({
            userId,
            stack: techStack,
            questions: formattedQuestions
        });

        res.status(200).json(newInterview);

    } catch (error) {
        console.error("Error in /interview/start:", error);

        res.status(500).json({
            message: "Failed to start interview session"
        });
    }
});


// ===========================================
// @desc    Submit answer for evaluation
// @route   POST /api/interview/submit-answer
// ===========================================
router.post('/submit-answer', async (req, res) => {
    const { interviewId, questionId, userAnswer } = req.body;

    if (!interviewId || !questionId || !userAnswer) {
        return res.status(400).json({
            message: "Missing required tracking fields."
        });
    }

    try {
        // Find interview
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                message: "Interview session not found."
            });
        }

        // Find question
        const questionItem = interview.questions.id(questionId);

        if (!questionItem) {
            return res.status(404).json({
                message: "Question entry not found in this session."
            });
        }

        // Evaluate answer using Gemini
        const evaluation = await evaluateAnswer(
            questionItem.question,
            userAnswer
        );

        // Save evaluation
        questionItem.userAnswer = userAnswer;
        questionItem.aiFeedback = evaluation.feedback;
        questionItem.score = evaluation.score;

        await interview.save();

        res.status(200).json({
            success: true,
            questionId,
            score: evaluation.score,
            feedback: evaluation.feedback
        });

    } catch (error) {
        console.error("Error in /submit-answer:", error);

        res.status(500).json({
            message: "Failed to evaluate answer entry securely."
        });
    }
});


// ===========================================
// @desc    Complete interview and calculate score
// @route   POST /api/interview/complete
// ===========================================
router.post('/complete', async (req, res) => {
    const { interviewId } = req.body;

    if (!interviewId) {
        return res.status(400).json({
            message: "Interview ID is required."
        });
    }

    try {
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                message: "Interview session not found."
            });
        }

        // Calculate average score
        const totalQuestions = interview.questions.length;

        const totalScore = interview.questions.reduce(
            (sum, q) => sum + (q.score || 0),
            0
        );

        const finalAverage =
            totalQuestions > 0
                ? Math.round((totalScore / totalQuestions) * 10) / 10
                : 0;

        // Update interview
        interview.finalScore = finalAverage;
        interview.status = 'Completed';

        interview.overallFeedback =
            `You scored an average of ${finalAverage}/10. ` +
            `Keep polishing your architectural and depth concepts ` +
            `across your chosen ecosystem.`;

        await interview.save();

        res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {
        console.error("Error in /complete:", error);

        res.status(500).json({
            message: "Failed to finalize interview details."
        });
    }
});


module.exports = router;