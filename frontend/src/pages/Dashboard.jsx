import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [selectedStack, setSelectedStack] = useState('MERN Stack');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Temporary static ID for development until Google Auth returns a live database profile
  const temporaryDevUserId = "665a3b934fd2cb295c9a1234"; 

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const response = await API.post('/api/interview/start', {
        techStack: selectedStack,
        userId: temporaryDevUserId
      });
      
      // If server responds successfully, capture MongoDB _id and route to it dynamically
      const newInterviewSession = response.data;
      navigate(`/interview/${newInterviewSession._id}`);
    } catch (error) {
      console.error("Failed to generate initial AI question profile", error);
      alert("Error talking to Gemini. Check your server console log details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome back, Developer!</h2>
            <p className="text-sm text-slate-500">Launch an automated technical deep-dive assessment session.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow">
            SD
          </div>
        </header>

        {loading ? (
          <Loader message={`Gemini is generating dynamic technical questions for ${selectedStack}...`} />
        ) : (
          <div className="max-w-xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Configure New Interview</h3>
            <p className="text-sm text-slate-500 mb-6">Our AI fine-tunes specialized runtime arrays to evaluate your logic stacks.</p>

            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Select Tech Stack Target
            </label>
            <select 
              value={selectedStack}
              onChange={(e) => setSelectedStack(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-6"
            >
              <option value="MERN Stack">MERN Stack Development</option>
              <option value="DSA in C++">Data Structures & Algorithms (C++)</option>
              <option value="React.js Framework">React.js Frontend Architecture</option>
              <option value="Node.js Core Backend">Node.js Ecosystem & Databases</option>
            </select>

            <button 
              onClick={handleStartInterview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              🚀 Initialize Mock Interview Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}