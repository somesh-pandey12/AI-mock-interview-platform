const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Interview = require('../models/Interview');
const { GoogleGenAI, Type } = require('@google/genai');

/**
 * @private
 * Lazy-loader instance manager for enterprise Google GenAI configurations
 */
const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ CRITICAL ARCHITECTURE ERROR: GEMINI_API_KEY is missing from environment variables.");
        throw new Error("API Key Configuration Disconnected.");
    }
    return new GoogleGenAI({ apiKey: apiKey });
};

// ==========================================
// ROUTE: GET /api/interview/:id
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview workspace session not found." });
        }
        return res.status(200).json(interview);
    } catch (error) {
        console.error("❌ RUNTIME EXCEPTION [GET SESSION]:", error);
        return res.status(500).json({ success: false, message: "Internal server database retrieval error." });
    }
});

// ==========================================
// ROUTE: POST /api/interview/start
// ==========================================
router.post('/start', async (req, res) => {
    console.log("📥 INBOUND PAYLOAD [INITIALIZE SANDBOX]:", req.body);
    const { techStack, userId } = req.body;

    if (!techStack || !userId) {
        return res.status(400).json({ success: false, message: "Missing tracking criteria: techStack and userId are required." });
    }

    let rawQuestionsArray = [];

    try {
        const aiClient = getAiClient();
        console.log(`🤖 Compiling Structured Generation Trees for Domain: [${techStack}]...`);

        const aiResponse = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate exactly 3 core engineering technical interview questions evaluating proficiency in: ${techStack}. Make them challenging, practical, and highly situational.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "List of 3 engineering technical assessment questions.",
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const jsonText = aiResponse.text ? aiResponse.text.trim() : aiResponse.response.text().trim();
        rawQuestionsArray = JSON.parse(jsonText);
        console.log("✅ STRUCT SCHEMATIC GEN SUCCESSFUL:", rawQuestionsArray);

    } catch (aiError) {
        console.error("⚠️ SDK OR PARSE FAULT: Utilizing distributed pipeline fallbacks.", aiError.message);
        rawQuestionsArray = [
            `Examine the core structural life-cycle loops, data bindings, and resource allocation overhead within ${techStack}.`,
            `How do you diagnose and counter asynchronous memory overhead leaks or race condition bottlenecks within a ${techStack} pipeline?`,
            `Detail production logging procedures, load balancing configurations, and architectural guardrails required when scaling ${techStack}.`
        ];
    }

    try {
        const formattedQuestions = rawQuestionsArray.map(questionText => ({
            question: String(questionText),
            userAnswer: "",
            aiFeedback: "",
            score: 0,
            // Initialize empty structural telemetry parameters matching the frontend requirements
            telemetry: {
                executionTime: "0ms",
                memoryUsed: "0 MB",
                testCases: []
            }
        }));

        const newSession = await Interview.create({
            userId: String(userId),
            techStack: techStack,
            questions: formattedQuestions,
            finalScore: 0,
            status: "In Progress"
        });

        console.log(`🚀 INSTANCE COMMITTED SECURELY TO CLUSTER: ID [${newSession._id}]`);
        return res.status(201).json(newSession);

    } catch (dbError) {
        console.error("❌ DATA WRITE EXCEPTION:", dbError);
        return res.status(500).json({ success: false, message: "Data tier validation rejection.", error: dbError.message });
    }
});

// ==========================================
// ROUTE: POST /api/interview/submit-answer
// ==========================================
router.post('/submit-answer', async (req, res) => {
    const { interviewId, questionId, userAnswer } = req.body;
    
    if (!interviewId || questionId === undefined || userAnswer === undefined) {
        return res.status(400).json({ success: false, message: "Malformed Request. Missing contract fields." });
    }

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ success: false, message: "Session target reference lost." });

        let questionObj = null;
        if (mongoose.Types.ObjectId.isValid(String(questionId))) {
            questionObj = interview.questions.id(questionId);
        }
        
        if (!questionObj) {
            const targetIndex = parseInt(questionId, 10);
            if (!isNaN(targetIndex) && interview.questions[targetIndex]) {
                questionObj = interview.questions[targetIndex];
            }
        }

        if (!questionObj) {
            console.error(`❌ TARGET FAIL: Question ID reference matching context [${questionId}] not resolved.`);
            return res.status(404).json({ success: false, message: "Target question matching key sequence not found." });
        }

        console.log(`🤖 Evaluation Active. Analyzing Response Vector against Question: "${questionObj.question}"`);
        const aiClient = getAiClient();

        // High-precision tracking initialization benchmark to measure API request overhead
        const apiBenchmarkStart = Date.now();

        // 🚀 UPGRADED: Enforcing Native Structure Schema targeting full advanced telemetry attributes
        const aiResponse = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Critique this engineering response. 
            Context Domain Stack: [${interview.techStack}]
            Question Provided: "${questionObj.question}"
            Candidate Answer Given: "${userAnswer}"
            Provide an engineering rating out of 10, clear constructive markdown mentorship feedback, and explicitly determine the status of 3 hypothetical verification test cases matching this logic.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { 
                            type: Type.INTEGER, 
                            description: "A solid engineering metric score ranking out of 10." 
                        },
                        feedback: { 
                            type: Type.STRING, 
                            description: "Constructive architectural breakdown analysis detailing pros, cons, and code improvements using Markdown formatting layout." 
                        },
                        testCase1Passed: {
                            type: Type.BOOLEAN,
                            description: "True if the code satisfies general boundaries and base structures cleanly."
                        },
                        testCase2Passed: {
                            type: Type.BOOLEAN,
                            description: "True if the code accurately handles empty values, null elements, or bounds criteria securely."
                        },
                        testCase3Passed: {
                            type: Type.BOOLEAN,
                            description: "True if the solution exhibits high-efficiency parameters optimized for large-scale production volume datasets without execution timeout errors."
                        }
                    },
                    required: ["score", "feedback", "testCase1Passed", "testCase2Passed", "testCase3Passed"]
                }
            }
        });

        const evaluationText = aiResponse.text ? aiResponse.text.trim() : aiResponse.response.text().trim();
        const assessmentMetrics = JSON.parse(evaluationText);
        
        // Calculate the actual latency profile to populate the console log dashboard dynamically
        const calculatedLatency = Date.now() - apiBenchmarkStart;
        const simulatedHeapUsage = `${(3.4 + Math.random() * 1.4).toFixed(1)} MB`;

        // Map response schemas cleanly to fit the structured multi-tab front-end layouts
        const structuredTelemetry = {
            executionTime: `${calculatedLatency}ms`,
            memoryUsed: simulatedHeapUsage,
            testCases: [
                { 
                    id: 1, 
                    name: "Basic Structural Array Bounds", 
                    passed: assessmentMetrics.testCase1Passed, 
                    runtime: `${Math.floor(1 + Math.random() * 3)}ms` 
                },
                { 
                    id: 2, 
                    name: "Empty Object Null Constraints", 
                    passed: assessmentMetrics.testCase2Passed, 
                    runtime: `${Math.floor(1 + Math.random() * 2)}ms` 
                },
                { 
                    id: 3, 
                    name: "Scale Injection Overload Vector", 
                    passed: assessmentMetrics.testCase3Passed, 
                    runtime: `${Math.floor(6 + Math.random() * 5)}ms` 
                }
            ]
        };

        // Committing updated parameters securely to MongoDB model context instances
        questionObj.userAnswer = String(userAnswer);
        questionObj.aiFeedback = String(assessmentMetrics.feedback);
        questionObj.score = Number(assessmentMetrics.score);
        questionObj.telemetry = structuredTelemetry;

        await interview.save();
        console.log(`✅ TELEMETRY EVALUATION LOGGED: Score [${questionObj.score}/10] saved safely.`);

        // Return structured parameters matching client-side expectations exactly
        return res.status(200).json({ 
            success: true, 
            score: questionObj.score, 
            feedback: questionObj.aiFeedback,
            telemetry: questionObj.telemetry
        });

    } catch (err) {
        console.error("❌ TRANSACTION CRASH [EVALUATION BLOCK]:", err);
        return res.status(500).json({ success: false, message: "Internal evaluation parsing system exception.", error: err.message });
    }
});

// ==========================================
// ROUTE: POST /api/interview/complete
// ==========================================
router.post('/complete', async (req, res) => {
    const { interviewId } = req.body;
    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) return res.status(404).json({ success: false, message: "Session target parameters lost." });

        const computedTotalScore = interview.questions.reduce((sum, q) => sum + (q.score || 0), 0);
        
        interview.finalScore = interview.questions.length > 0 
            ? Math.round((computedTotalScore / interview.questions.length) * 10) / 10 
            : 0;
            
        interview.status = 'Completed';
        await interview.save();

        console.log(`🏁 WORKSPACE SAVED SECURELY: Session ${interviewId} closed with a total score of ${interview.finalScore}`);
        return res.status(200).json(interview);
    } catch (err) {
        console.error("❌ CRITICAL COMPLETION PIPELINE INTERRUPTION:", err);
        return res.status(500).json({ success: false, message: "System finalize cycle exception encountered." });
    }
});

module.exports = router;