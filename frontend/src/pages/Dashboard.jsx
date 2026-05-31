import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api';
import Loader from '../components/Loader';
import { Code2, PlusCircle, History, ExternalLink, Activity, Target, Zap, Search, SlidersHorizontal, Layers } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [techStackInput, setTechStackInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');

  const mockUserId = "somesh_fresher_dev"; 

  const fetchHistoricalSessions = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (scoreFilter) queryParams.append('minScore', scoreFilter);

      const response = await API.get(`/api/interview/user/${mockUserId}?${queryParams.toString()}`);
      setSessions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Analytical sync failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalSessions();
  }, [searchQuery, statusFilter, scoreFilter]);

  const handleLaunchSession = async (e) => {
    e.preventDefault();
    if (!techStackInput.trim()) return alert("Please specify a technology stack target domain.");

    setIsInitializing(true);
    try {
      const response = await API.post('/api/interview/start', {
        techStack: techStackInput.trim(),
        userId: mockUserId
      });
      
      if (response.data && response.data._id) {
        navigate(`/workspace/${response.data._id}`);
      }
    } catch (error) {
      console.error("Failed to kick off compiler initialization channel:", error);
      alert("Pipeline instantiation error.");
    } finally {
      setIsInitializing(false);
    }
  };

  if (loading && sessions.length === 0 && !searchQuery && !statusFilter && !scoreFilter) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader message="Booting core diagnostics panel and compiling aggregate user logs..." />
      </div>
    );
  }

  const completedSessions = sessions.filter(s => s.status === 'Completed');
  const globalAverageScore = completedSessions.length > 0
    ? (completedSessions.reduce((sum, s) => sum + (s.finalScore || 0), 0) / completedSessions.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 ml-64 p-8 h-screen overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-[#030712] to-[#030712]">
        
        {/* Header Block */}
        <div className="mb-8 pb-6 border-b border-slate-800/60 flex justify-between items-center backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                SYSTEM CORE // CORE TELEMETRY ENGINE
              </span>
            </div>
            <h1 className="text-4xl font-black text-white mt-3 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Developer Cockpit
            </h1>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-slate-400 shadow-xl shadow-black/40 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            CLUSTER_NODE: <span className="text-emerald-400 font-bold tracking-wider">ONLINE</span>
          </div>
        </div>

        {/* Global Analytics Cards Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-10 -right-10 p-6 opacity-5 text-blue-400 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <Activity size={160} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest block">Total Simulations</span>
              <span className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400"><Activity size={18} /></span>
            </div>
            <span className="text-4xl font-black text-white font-mono tracking-tight block">{sessions.length}</span>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/40 w-fit">
              <span>With <b className="text-emerald-400 font-mono font-bold">{completedSessions.length}</b> fully graded closures</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-10 -right-10 p-6 opacity-5 text-emerald-400 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <Target size={160} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest block">Evaluation Mean</span>
              <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400"><Target size={18} /></span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-emerald-400 font-mono tracking-tight">{globalAverageScore}</span>
              <span className="text-sm font-mono text-slate-600 font-bold">/ 10</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/40 w-fit">
              <span>Calculated performance index</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-10 -right-10 p-6 opacity-5 text-amber-400 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <Zap size={160} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest block">Active Specialization</span>
              <span className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400"><Zap size={18} /></span>
            </div>
            <span className="text-2xl font-black text-slate-100 block truncate tracking-tight py-1">
              {completedSessions.length > 0 ? completedSessions[0].techStack : "Pending Launch"}
            </span>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/40 w-fit">
              <span>Primary sandbox tech stack</span>
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Dimensional Filter Control Toolbelt */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 mb-8 grid grid-cols-12 gap-4 items-center shadow-lg backdrop-blur-md">
          <div className="col-span-6 relative">
            <Search className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historic runs by stack domain or question keywords..."
              className="w-full bg-slate-950/80 border border-slate-800/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-200 text-xs font-mono rounded-xl pl-11 pr-4 py-3 outline-none transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <div className="col-span-3 relative flex items-center">
            <SlidersHorizontal size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800/80 text-slate-400 text-xs font-mono rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none"
            >
              <option value="">Status Matrix (All)</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div className="col-span-3 relative flex items-center">
            <Layers size={14} className="absolute left-3.5 text-slate-500 pointer-events-none" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800/80 text-slate-400 text-xs font-mono rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer appearance-none"
            >
              <option value="">Rating Threshold (All)</option>
              <option value="8">High Tier (Grade ≥ 8)</option>
              <option value="5">Mid Tier (Grade ≥ 5)</option>
            </select>
          </div>
        </div>

        {/* Master Content Split Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Form Launch Workspace Container */}
          <div className="col-span-4 bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-6 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800/60">
              <PlusCircle size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold uppercase font-mono text-white tracking-wider">
                Launch Workspace
              </h3>
            </div>

            <form onSubmit={handleLaunchSession} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                  Target Domain Stack / Problem Scope
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g., MERN Stack, C++ DSA, React Node"
                  disabled={isInitializing}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-slate-200 text-xs font-mono font-medium rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-700 shadow-inner focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={isInitializing || !techStackInput.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-blue-950/50 tracking-widest uppercase transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-blue-400/20"
              >
                {isInitializing ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                    Assembling Scaffolds...
                  </>
                ) : (
                  <>
                    Initialize Code Sandbox <Code2 size={15} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Historical Logs Streams Container */}
          <div className="col-span-8 bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800/60">
              <History size={18} className="text-purple-400" />
              <h3 className="text-sm font-bold uppercase font-mono text-white tracking-wider">
                Telemetry Log & Historic Runs
              </h3>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {sessions.map((session) => {
                const isComplete = session.status === 'Completed';
                
                return (
                  <div
                    key={session._id}
                    className="bg-slate-950/60 border border-slate-800/60 p-4 rounded-xl flex justify-between items-center transition-all duration-300 hover:border-slate-700 hover:bg-slate-950 shadow-md group"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                          {session.techStack}
                        </span>
                        <span className="text-slate-700">•</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/40">
                          {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        ID_REF: <span className="text-slate-400 font-bold">{session._id.substring(0, 12)}...</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-[9px] font-mono font-extrabold tracking-widest px-2.5 py-1 rounded-md border ${
                        isComplete 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                      }`}>
                        {session.status.toUpperCase()}
                      </span>
                      
                      {isComplete && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center justify-center h-8">
                          <span className="text-sm font-mono font-black text-emerald-400">
                            {session.finalScore} <b className="text-[10px] text-slate-500 font-normal">/10</b>
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => navigate(isComplete ? `/results/${session._id}` : `/workspace/${session._id}`)}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md group-hover:bg-slate-850"
                        title={isComplete ? "View Scorecard" : "Resume Sandbox Pipeline"}
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {sessions.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl font-mono text-slate-500 text-xs bg-slate-950/20">
                  No tracking logs matched your current query criteria.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}