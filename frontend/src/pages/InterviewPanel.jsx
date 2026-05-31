import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import API from '../api';

export default function InterviewPanel() {
  const { id } = useParams(); // Extracts the dynamic interviewId from the URL
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  // 1. Fetch the generated interview session from the backend on load
  useEffect(() => {
    const fetchInterviewSession = async () => {
      try {
        // We will quickly create a basic GET route next, or extract it from the payload
        const response = await API.get(`/api/interview/${id}`);
        setInterview(response.data);
      } catch (error) {
        console.error("Error loading interview data", error);
        alert("Could not load your interview session. Directing back to Dashboard.");
        navigate('/dashboard');
      } finally {
        setLoadingSession(false);
      }
    };
    fetchInterviewSession();
  }, [id, navigate]);

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <Loader message="Loading your customized technical sandbox environment..." />
        </div>
      </div>
    );
  }

  if (!interview || !interview.questions) return null;

  const activeQuestion = interview.questions[currentStep];
  const isCompleted = interview.status === 'Completed';

  // 2. Submit active answer index to Gemini evaluation microservice
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const response = await API.post('/api/interview/submit-answer', {
        interviewId: interview._id,
        questionId: activeQuestion._id,
        userAnswer: userAnswer
      });

      if (response.data.success) {
        // Dynamically update state with the feedback details returned by Atlas
        const updatedQuestions = [...interview.questions];
        updatedQuestions[currentStep] = {
          ...updatedQuestions[currentStep],
          userAnswer: userAnswer,
          aiFeedback: response.data.feedback,
          score: response.data.score
        };

        setInterview({ ...interview, questions: updatedQuestions });
        setUserAnswer("");

        // Advance to next index or trigger final calculation closure
        if (currentStep < interview.questions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Finalize session totals
          const finalizeResponse = await API.post('/api/interview/complete', { interviewId: interview._id });
          setInterview(finalizeResponse.data);
        }
      }
    } catch (error) {
      console.error("Submission evaluation error", error);
      alert("Evaluation transaction failed. Please resubmit.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800">Live Evaluation Sandbox</h2>
          <p className="text-sm text-slate-500">Stack Track: <span className="font-semibold text-blue-600">{interview.stack}</span></p>
        </header>

        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Question {currentStep + 1} of {interview.questions.length}
                </span>
                <h3 className="text-lg font-bold text-slate-800 leading-relaxed mt-4">
                  {activeQuestion?.question}
                </h3>
              </div>

              {isEvaluating ? (
                <Loader message="Gemini is analyzing your response logic strings..." />
              ) : (
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Explain your approach clearly. Mention code structures, complexities, or architectural edge cases..."
                      rows={8}
                      className="w-full bg-transparent resize-none focus:outline-none text-slate-800 text-sm leading-relaxed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!userAnswer.trim()}
                    className={`w-full font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all ${
                      userAnswer.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-blue-600/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    🚀 Submit Answer for Live Score
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit space-y-4">
              <h4 className="font-bold text-slate-800 border-b pb-2 border-slate-100">Session Progress</h4>
              <div className="space-y-3">
                {interview.questions.map((q, idx) => (
                  <div key={q._id} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === currentStep ? 'bg-blue-600 text-white' : idx < currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`truncate flex-1 ${idx === currentStep ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>
                      {q.question}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-slate-900 p-8 text-center text-white border-b border-slate-800">
              <span className="text-4xl">🏆</span>
              <h3 className="text-2xl font-bold mt-2">Evaluation Complete</h3>
              <p className="text-slate-400 text-sm mt-1">Overall Core Score: <span className="text-blue-400 font-bold text-lg">{interview.finalScore}/10</span></p>
            </div>
            
            <div className="p-8 space-y-6">
              <h4 className="text-lg font-bold text-slate-800 border-b pb-2 border-slate-100">Question Performance Logs</h4>
              <div className="space-y-4">
                {interview.questions.map((item, index) => (
                  <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex gap-4 items-start">
                    <div className="bg-slate-900 text-white font-bold px-3 py-2 rounded-lg text-center min-w-[60px]">
                      <span className="block text-[10px] uppercase opacity-70">Score</span>
                      <span className="text-base text-blue-400">{item.score}</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm mb-1">Question {index + 1}: {item.question}</h5>
                      <p className="text-xs text-slate-500 bg-white p-2 rounded border my-2 italic">" {item.userAnswer} "</p>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium"><span className="text-blue-600 font-bold">AI Analytics:</span> {item.aiFeedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}