import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Forum() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h2 className="text-2xl font-bold text-slate-800">Community Discussion Forum</h2>
        <p className="text-slate-500 mt-2">Discuss git-conflicts, system errors, and interview responses.</p>
      </div>
    </div>
  );
}