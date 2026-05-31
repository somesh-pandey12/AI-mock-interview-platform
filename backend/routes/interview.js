const express = require('express');
const router = express.Router();

const {
    generateQuestions,
    evaluateAnswer
} = require('../services/geminiService');

const Interview = require('../models/Interview');


// ===========================================
// @desc    Start Interview
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
        const questionsArray = await generateQuestions(techStack);

        const formattedQuestions = questionsArray.map(q => ({
            question: q
        }));

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
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({
                message: "Interview session not found."
            });
        }

        const questionItem = interview.questions.id(questionId);

        if (!questionItem) {
            return res.status(404).json({
                message: "Question entry not found in this session."
            });
        }

        const evaluation = await evaluateAnswer(
            questionItem.question,
            userAnswer
        );

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

        const totalQuestions = interview.questions.length;

        const totalScore = interview.questions.reduce(
            (sum, q) => sum + (q.score || 0),
            0
        );

        const finalAverage =
            totalQuestions > 0
                ? Math.round((totalScore / totalQuestions) * 10) / 10
                : 0;

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


// ===========================================
// @desc    Get Interview By ID
// @route   GET /api/interview/:id
// ===========================================
router.get('/:id', async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                message: "Session matching that ID not found."
            });
        }

        res.status(200).json(interview);

    } catch (error) {
        console.error("Error fetching single session:", error);

        res.status(500).json({
            message: "Server error querying session schema."
        });
    }
});


module.exports = router;