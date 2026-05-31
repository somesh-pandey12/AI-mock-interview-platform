import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react'; // 👈 Monaco Editor का जादू
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import API from '../api';

const LANGUAGE_BOILERPLATES = {
  cpp: `// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your logic goes here\n    return 0;\n}`,
  javascript: `// Write your JavaScript solution here\nfunction solution() {\n    // Your logic goes here\n}`,
  python: `# Write your Python solution here\ndef solution():\n    # Your logic goes here\n    pass`,
  java: `// Write your Java solution here\npublic class Solution {\n    public static void main(String[] args) {\n        // Your logic goes here\n    }\n}`
};

export default function InterviewPanel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState('cpp');
  const [codeValue, setCodeValue] = useState(LANGUAGE_BOILERPLATES['cpp']);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const fetchInterviewSession = async () => {
      try {
        const response = await API.get(`/api/interview/${id}`);
        setInterview(response.data);
      } catch (error) {
        console.error("Error loading interview data", error);
        alert("Could not load interview session.");
        navigate('/dashboard');
      } finally {
        setLoadingSession(false);
      }
    };
    fetchInterviewSession();
  }, [id, navigate]);

  // जब यूजर लैंग्वेज बदले, तो एडिटर का बॉयलरप्लेट कोड भी बदल जाए
  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setCodeValue(LANGUAGE_BOILERPLATES[lang]);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!codeValue.trim()) return;

    setIsEvaluating(true);
    try {
      const activeQuestion = interview.questions[currentStep];
      const response = await API.post('/api/interview/submit-answer', {
        interviewId: interview._id,
        questionId: activeQuestion._id,
        userAnswer: `[Language: ${selectedLang}]\n\n${codeValue}` // लैंग्वेज टैग के साथ कोड भेजना
      });

      if (response.data.success) {
        const updatedQuestions = [...interview.questions];
        updatedQuestions[currentStep] = {
          ...updatedQuestions[currentStep],
          userAnswer: codeValue,
          aiFeedback: response.data.feedback,
          score: response.data.score
        };

        setInterview({ ...interview, questions: updatedQuestions });
        
        if (currentStep < interview.questions.length - 1) {
          setCurrentStep(currentStep + 1);
          setCodeValue(LANGUAGE_BOILERPLATES[selectedLang]); // रिसेट टू बॉयलरप्लेट
        } else {
          const finalizeResponse = await API.post('/api/interview/complete', { interviewId: interview._id });
          setInterview(finalizeResponse.data);
        }
      }
    } catch (error) {
      console.error("Submission evaluation error", error);
      alert("Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <Loader message="Booting up professional developer sandbox environment..." />
        </div>
      </div>
    );
  }

  if (!interview || !interview.questions) return null;

  const activeQuestion = interview.questions[currentStep];
  const isCompleted = interview.status === 'Completed';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6 flex flex-col h-screen overflow-hidden">
        {/* Top Header Row */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Advanced Live Sandbox IDE</h2>
            <p className="text-xs text-slate-400">Track: <span className="text-blue-400 font-semibold">{interview.stack}</span></p>
          </div>
          {!isCompleted && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Runtime Environments:</label>
              <select
                value={selectedLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-semibold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cpp">C++ (GCC 14)</option>
                <option value="javascript">JavaScript (Node v20)</option>
                <option value="python">Python (3.11)</option>
                <option value="java">Java (OpenJDK 21)</option>
              </select>
            </div>
          )}
        </header>

        {!isCompleted ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0 pb-4">
            {/* Left 2 Columns: Question Display Card */}
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex-1 overflow-y-auto space-y-4 shadow-xl">
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                  Question {currentStep + 1} of {interview.questions.length}
                </span>
                <h3 className="text-lg font-bold text-white leading-relaxed pt-2">
                  {activeQuestion?.question}
                </h3>
                <div className="border-t border-slate-800/80 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Metrics:</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">• Optimization complexity benchmarks apply.</p>
                  <p className="text-xs text-slate-400 leading-relaxed">• Ensure corner cases (e.g., empty structures, null values) are explicitly validated.</p>
                </div>
              </div>
            </div>

            {/* Right 3 Columns: Real Pro-IDE Monaco Code Editor Workspace */}
            <div className="lg:col-span-3 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-0">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-mono text-slate-500 ml-2">editor_workspace.{selectedLang === 'cpp' ? 'cpp' : selectedLang === 'javascript' ? 'js' : selectedLang === 'python' ? 'py' : 'java'}</span>
                </div>
              </div>

              <div className="flex-1 min-h-0 relative">
                {isEvaluating ? (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex items-center justify-center p-6">
                    <Loader message="Gemini AI compiling execution tree and scanning memory complexity..." />
                  </div>
                ) : null}
                
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language={selectedLang === 'cpp' ? 'cpp' : selectedLang === 'javascript' ? 'javascript' : selectedLang === 'python' ? 'python' : 'java'}
                  value={codeValue}
                  onChange={(val) => setCodeValue(val)}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollbar: { vertical: 'visible', horizontal: 'visible' },
                    automaticLayout: true,
                    tabSize: 4,
                  }}
                />
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={isEvaluating || !codeValue.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Submit Code Solution for Analysis
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Premium AI Report Card View */
          <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full pb-10 space-y-6">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 text-center rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
              <span className="text-5xl">🏆</span>
              <h3 className="text-3xl font-extrabold text-white mt-3">SaaS AI Evaluation Complete</h3>
              <p className="text-slate-400 text-sm mt-1">Overall Core Assessment Score:</p>
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-3xl font-black px-6 py-2 rounded-2xl mt-4">
                {interview.finalScore} / 10
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white tracking-wide">Deep Diagnostics Report</h4>
              {interview.questions.map((item, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex gap-5 items-start">
                  <div className="bg-slate-950 border border-slate-800 text-blue-400 font-black px-4 py-3 rounded-xl text-center min-w-[70px]">
                    <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Score</span>
                    <span className="text-xl">{item.score}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h5 className="font-extrabold text-white text-base">Question {index + 1}: {item.question}</h5>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-xs text-slate-300 max-h-40 overflow-y-auto whitespace-pre">
                      {item.userAnswer}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl">
                      <span className="text-blue-400 font-extrabold block mb-1">🤖 AI Feedback Metrics:</span> 
                      {item.aiFeedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}