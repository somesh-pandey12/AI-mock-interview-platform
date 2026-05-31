import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api';
import Loader from '../components/Loader';

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Static Mock User ID matching our localized sandbox environment profile
  const userId = "6a1be00f130f24b0775c31c5";

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await API.get(`/api/interview/user/${userId}`);
        if (response.data && response.data.success) {
          setHistory(response.data.history);
        }
      } catch (error) {
        console.error("Failed to extract historical database logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <Loader message="Compiling historical engineering telemetry pipelines..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex font-sans antialiased">
      <Sidebar />

      <div className="flex-1 ml-64 p-10 space-y-8 overflow-y-auto">
        {/* Top Header Panel */}
        <header className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
          <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Historical Records Archive
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-3">Assessment Run History</h2>
          <p className="text-sm text-slate-400 mt-1">Review, re-verify, and track performance scores from your AI-simulated technical evaluation sandboxes.</p>
        </header>

        {/* Empty State Fallback Layout */}
        {history.length === 0 ? (
          <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto">
            <p className="text-slate-400 font-medium">No previous mock tracking schemas mapped to your account cluster context yet.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
            >
              Initialize Sandbox Session
            </button>
          </div>
        ) : (
          /* Cards Grid Wrapper Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((session) => {
              const score = session.finalScore || 0;
              let barColor = "bg-rose-500";
              if (score >= 8) barColor = "bg-cyan-400";
              else if (score >= 5) barColor = "bg-blue-500";

              return (
                <div 
                  key={session._id}
                  className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider block">TRACK ARCHITECTURE</span>
                        <h4 className="text-lg font-bold text-white tracking-wide mt-0.5">{session.techStack}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-white">{score}</span>
                        <span className="text-xs text-slate-500 font-bold">/10</span>
                      </div>
                    </div>

                    {/* Progress Score Bar Indicator */}
                    <div className="w-full bg-slate-950 h-1.5 rounded-full border border-slate-900 overflow-hidden">
                      <div className={`${barColor} h-full rounded-full`} style={{ width: `${score * 10}%` }}></div>
                    </div>

                    <div className="flex justify-between text-xs font-mono text-slate-500 pt-2">
                      <span>Status: <b className={session.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}>{session.status}</b></span>
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900/60 flex justify-end">
                    <button
                      onClick={() => {
                        if (session.status === 'In Progress') {
                          navigate(`/interview/${session._id}`);
                        } else {
                          navigate(`/results/${session._id}`);
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-4 rounded-lg border border-slate-700/60 group-hover:border-blue-500/40 group-hover:text-white transition-all cursor-pointer"
                    >
                      {session.status === 'In Progress' ? "Resume Sandbox →" : "View Telemetry Logs →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}