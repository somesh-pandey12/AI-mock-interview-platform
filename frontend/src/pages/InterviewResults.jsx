import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api';
import Loader from '../components/Loader';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Award, CheckCircle, XCircle, Clock, Cpu, Code2, ArrowLeft, Terminal, Server } from 'lucide-react';

export default function InterviewResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusedQuestionIdx, setFocusedQuestionIdx] = useState(0);

  useEffect(() => {
    const fetchFinalMetrics = async () => {
      try {
        const response = await API.get(`/api/interview/${id}`);
        setSessionData(response.data);
      } catch (error) {
        console.error("Failed to recover post-session telemetry:", error);
        alert("Unable to compile scorecard parameters.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchFinalMetrics();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader message="Compiling overall performance metrics and computing scorecard analytics..." />
      </div>
    );
  }

  const questions = sessionData?.questions || [];
  const activeQuestion = questions[focusedQuestionIdx];
  
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-emerald-950/50';
    if (score >= 5) return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-amber-950/50';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10 shadow-rose-950/50';
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex font-sans antialiased">
      <Sidebar />

      {/* Main Scoring Viewport */}
      <div className="flex-1 ml-64 p-8 h-screen overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#030712] to-[#030712]">
        
        {/* Dashboard Header Bar */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                ASSESSMENT SCORECARD COMPILATION
              </span>
            </div>
            <h1 className="text-3xl font-black text-white mt-3 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Telemetry Evaluation Summary
            </h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono font-bold text-xs py-2.5 px-5 rounded-xl shadow-xl transition-all duration-200 transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Cockpit
          </button>
        </div>

        {/* Global Summary Score Widgets */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Award size={20} /></div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Global Grade</span>
              <span className="text-2xl font-black text-white font-mono">{sessionData?.finalScore || 0} <b className="text-xs text-slate-600 font-normal">/ 10</b></span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20"><Code2 size={20} /></div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Stack Domain</span>
              <span className="text-base font-extrabold text-slate-200 truncate block mt-0.5">{sessionData?.techStack}</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20"><CheckCircle size={20} /></div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Unit Tests</span>
              <span className="text-2xl font-black text-white font-mono">
                {questions.reduce((sum, q) => sum + (q.telemetry?.testCases?.filter(tc => tc.passed).length || 0), 0)}
                <b className="text-xs text-slate-600 font-normal"> / {questions.length * 3}</b>
              </span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-sm relative overflow-hidden group">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20"><Cpu size={20} /></div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Avg Compile Time</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {Math.round(questions.reduce((sum, q) => sum + (parseInt(q.telemetry?.executionTime) || 0), 0) / (questions.length || 1))}ms
              </span>
            </div>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="flex gap-8 items-start">
          
          {/* Left Selector Column */}
          <div className="w-4/12 space-y-3 shrink-0">
            <span className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase block px-1">
              PROMPT SEQUENCE INDEX
            </span>
            {questions.map((q, index) => {
              const passedCount = q.telemetry?.testCases?.filter(tc => tc.passed).length || 0;
              const isFocused = focusedQuestionIdx === index;

              return (
                <div
                  key={index}
                  onClick={() => setFocusedQuestionIdx(index)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex justify-between items-center shadow-md relative group overflow-hidden ${
                    isFocused 
                      ? 'bg-slate-900 border-slate-700 shadow-blue-950/20' 
                      : 'bg-slate-900/30 border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/50'
                  }`}
                >
                  {isFocused && <div className="absolute left-0 top-0 h-full w-[3px] bg-blue-500"></div>}
                  <div className="space-y-1.5 flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] font-black tracking-wider ${isFocused ? 'text-blue-400' : 'text-slate-500'}`}>
                        PROMPT #0{index + 1}
                      </span>
                      <span className="text-slate-700 text-[10px]">•</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {passedCount}/3 Verification Matrix
                      </span>
                    </div>
                    <p className={`text-xs font-semibold truncate ${isFocused ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {q.question}
                    </p>
                  </div>
                  
                  <div className={`w-9 h-9 rounded-xl font-mono text-xs font-black flex items-center justify-center border shadow-inner shrink-0 ${getScoreColor(q.score)}`}>
                    {q.score}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detailed Scoring Display Frame */}
          <div className="w-8/12 bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-6 relative">
            
            {/* Active Problem Segment */}
            <div className="space-y-2 pb-5 border-b border-slate-800/60">
              <span className="text-[10px] font-mono font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20 inline-block">
                Evaluated Problem Statement
              </span>
              <p className="text-base text-white font-semibold leading-relaxed tracking-tight">
                {activeQuestion?.question}
              </p>
            </div>

            {/* Micro Specs Controls */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1 shadow-inner">
                <div className="flex items-center gap-1.5 text-slate-500"><Clock size={13} />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Latency</span></div>
                <span className="text-sm font-bold text-slate-200 font-mono block">{activeQuestion?.telemetry?.executionTime || "0ms"}</span>
              </div>
              
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1 shadow-inner">
                <div className="flex items-center gap-1.5 text-slate-500"><Cpu size={13} />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Heap Boundary</span></div>
                <span className="text-sm font-bold text-slate-200 font-mono block">{activeQuestion?.telemetry?.memoryUsed || "0 MB"}</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-1 shadow-inner">
                <div className="flex items-center gap-1.5 text-slate-500"><Award size={13} />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">Assigned Segment Score</span></div>
                <span className="text-sm font-bold font-mono block text-emerald-400">{activeQuestion?.score || 0} / 10</span>
              </div>
            </div>

            {/* Custom Log Matrix Track */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
                <Terminal size={12} className="text-blue-400" /> STATIC CODE VALIDATION MATRIX
              </span>
              <div className="grid grid-cols-1 gap-2">
                {activeQuestion?.telemetry?.testCases?.map((tc) => (
                  <div key={tc.id} className="bg-slate-950/50 border border-slate-800/60 p-3.5 rounded-xl flex items-center justify-between font-mono text-xs shadow-sm transition-all hover:border-slate-700">
                    <div className="flex items-center gap-3">
                      {tc.passed ? (
                        <CheckCircle size={15} className="text-emerald-400 shrink-0 shadow-emerald-500/20" />
                      ) : (
                        <XCircle size={15} className="text-rose-400 shrink-0 shadow-rose-500/20" />
                      )}
                      <span className="text-slate-300 font-medium tracking-tight">{tc.name}</span>
                    </div>
                    <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md border ${tc.passed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {tc.passed ? `PASSED (${tc.runtime})` : "CRITICAL_LOG_FAILURE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Architectural Response Stream Frame */}
            <div className="space-y-3 pt-5 border-t border-slate-800/60">
              <span className="text-[10px] font-mono font-black text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                <Server size={12} /> SYSTEM STRUCTURAL REVIEWS & CODE MENTORSHIP LOG
              </span>
              
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 text-slate-300 text-xs font-sans leading-relaxed max-h-[350px] overflow-y-auto shadow-inner border-l-2 border-l-emerald-500/40">
                {activeQuestion?.aiFeedback ? (
                  <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({node, ...props}) => <p className="mb-4 text-slate-300 leading-relaxed font-normal text-[13px]" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-black text-emerald-400 mt-5 mb-3 font-mono uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded w-fit border border-emerald-500/10" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-xs font-bold text-slate-200 mt-4 mb-2 font-mono tracking-wide" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-300 text-[13px]" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-slate-300 text-[13px]" {...props} />,
                      li: ({node, ...props}) => <li className="pl-0.5 marker:text-emerald-500" {...props} />,
                      code: ({node, inline, ...props}) => (
                        inline 
                          ? <code className="bg-slate-900 px-1.5 py-0.5 rounded text-rose-400 font-mono text-[11px] border border-slate-800" {...props} />
                          : <pre className="bg-[#02040a] border border-slate-800/80 rounded-xl p-4 font-mono text-[11px] text-cyan-400 overflow-x-auto my-4 shadow-2xl leading-relaxed" {...props} />
                      )
                    }}
                  >
                    {activeQuestion.aiFeedback}
                  </ReactMarkdown>
                ) : (
                  <p className="text-slate-500 font-mono italic text-center py-4">
                    Candidate did not provide an answer matrix submission for this evaluation sequence parameter.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}