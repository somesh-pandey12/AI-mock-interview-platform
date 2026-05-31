import React from 'react';
import Sidebar from '../components/Sidebar';

export default function InterviewPanel() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h2 className="text-2xl font-bold text-slate-800">Active Interview Session</h2>
        <p className="text-slate-500 mt-2">AI is analyzing your current technical execution track.</p>
      </div>
    </div>
  );
}