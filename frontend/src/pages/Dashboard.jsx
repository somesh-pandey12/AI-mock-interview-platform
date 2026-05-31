import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [selectedStack, setSelectedStack] = useState('MERN Stack');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Structural Sidebar wrapper */}
      <Sidebar />

      {/* Main content pane offset to accommodate the fixed 64w Sidebar */}
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

        {/* Action Panel Setup */}
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
            <option value="React.js & Frontend Architecture">React.js Frontend Architecture</option>
            <option value="Node.js & Backend Architecture">Node.js Ecosystem & Databases</option>
          </select>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
            🚀 Initialize Mock Interview Session
          </button>
        </div>
      </div>
    </div>
  );
}