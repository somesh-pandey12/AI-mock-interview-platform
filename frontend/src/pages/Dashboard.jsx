// 1. Add useAuth to your top imports array
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext'; // 👈 Import our context hook

export default function Dashboard() {
  const { user } = useAuth(); // 👈 Call the hook to pull user profile data from session
  const [selectedStack, setSelectedStack] = useState('MERN Stack');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    // Validation check: Make sure a guest can't trigger generation without logging in
    if (!user || !user._id) {
      alert("Please authenticate using Google Sign In to store records.");
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/api/interview/start', {
        techStack: selectedStack,
        userId: user._id // 👈 Pass the dynamic, authenticated User ID from Atlas!
      });
      
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
            {/* Dynamic Welcome Heading */}
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome back, {user?.name || "Developer"}!
            </h2>
            <p className="text-sm text-slate-500">Launch an automated technical deep-dive assessment session.</p>
          </div>
          {/* Dynamic Profile Pic Element */}
          <img 
            src={user?.profilePic || "https://api.dicebear.com/7.x/bottts/svg"} 
            className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
            alt="profile"
          />
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