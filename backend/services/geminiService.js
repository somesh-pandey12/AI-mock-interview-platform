const { GoogleGenAI } = require("@google/genai");

// Initialize the client using the new SDK standard
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates 5 technical interview questions based on the tech stack.
 */
const generateQuestions = async (techStack) => {
    const prompt = `You are a professional technical interviewer. 
    Generate 5 challenging technical interview questions for a candidate specializing in ${techStack}.
    Return the output ONLY as a valid JSON array of strings. 
    Format: ["question 1", "question 2", "question 3", "question 4", "question 5"]`;

    try {
        // Using the modern ai.models.generateContent method
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        const text = response.text;
        
        // Clean the response if Gemini wraps it in markdown blocks
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return [
            "Explain the difference between deep copy and shallow copy in your stack.",
            "How do you optimize performance and minimize re-renders in this environment?",
            "What is your approach to handling asynchronous operations securely?",
            "Explain how memory management or garbage collection functions in this framework.",
            "How do you implement error boundaries or error handling middleware?"
        ]; // Safe fallback questions so your frontend doesn't crash if the API fails
    }
};

/**
 * Evaluates a user's answer and provides a score and feedback.
 */
const evaluateAnswer = async (question, userAnswer) => {
    const prompt = `Question: ${question}
    Candidate Answer: ${userAnswer}
    
    Evaluate this answer. Provide a score from 1 to 10 and actionable feedback for improvement.
    Return the response ONLY as a JSON object:
    { "score": number, "feedback": "string" }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        const text = response.text;
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        return { score: 0, feedback: "Could not evaluate answer due to an API timeout." };
    }
};

module.exports = { generateQuestions, evaluateAnswer };