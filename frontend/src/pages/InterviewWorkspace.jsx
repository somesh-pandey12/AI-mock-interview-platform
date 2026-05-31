import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api';
import Loader from '../components/Loader';
import Editor from '@monaco-editor/react';

export default function InterviewWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingIndex, setSubmittingIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(2700);
  
  // NEW: Tab state for professional terminal
  const [activeTab, setActiveTab] = useState('diagnostics');

  useEffect(() => {
    // ... (Keep your existing fetchInterviewSession logic here)
    setLoading(false);
  }, [id, navigate]);

  const handleSubmitAnswer = async () => {
    setSubmittingIndex(currentQuestionIndex);
    try {
      const res = await API.post('/api/interview/submit-answer', {
        interviewId: id,
        questionId: interview.questions[currentQuestionIndex]._id,
        userAnswer: answers[currentQuestionIndex]
      });
      setEvaluations(prev => ({ ...prev, [currentQuestionIndex]: res.data }));
      setActiveTab('diagnostics'); // Switch to results automatically
    } catch (e) { alert("Submission failed"); } 
    finally { setSubmittingIndex(null); }
  };

  if (loading || !interview) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  const activeQuestion = interview.questions[currentQuestionIndex];
  const isQuestionAnswered = !!evaluations[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-800">Problem {currentQuestionIndex + 1}</h2>
          <button onClick={() => navigate('/dashboard')} className="text-xs font-medium text-gray-500 hover:text-red-600">Finish</button>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* LEFT: Problem Description */}
          <div className="w-1/2 p-8 overflow-y-auto bg-white border-r border-gray-200">
            <h1 className="text-2xl font-bold mb-4">{activeQuestion?.question}</h1>
            
            {/* Terminal Tabs */}
            <div className="mt-8">
              <div className="flex gap-6 border-b border-gray-200">
                {['diagnostics', 'performance'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} 
                    className={`pb-2 text-sm font-semibold capitalize ${activeTab === tab ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-400'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="py-4">
                {activeTab === 'diagnostics' && isQuestionAnswered ? (
                  <p className="text-sm text-gray-700">{evaluations[currentQuestionIndex].feedback}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No output yet...</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Editor */}
          <div className="w-1/2 flex flex-col bg-gray-100">
            <Editor
              height="85%"
              theme="vs-light"
              value={answers[currentQuestionIndex] || ''}
              onChange={(v) => setAnswers(prev => ({...prev, [currentQuestionIndex]: v}))}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
            <div className="p-4 bg-white border-t flex justify-end">
              <button onClick={handleSubmitAnswer} disabled={isQuestionAnswered}
                className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold hover:bg-green-700">
                {submittingIndex === currentQuestionIndex ? "Compiling..." : "Run Pipeline"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}