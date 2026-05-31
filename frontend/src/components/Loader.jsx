import React from 'react';

export default function Loader({ message = "AI is evaluating your code..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping"></div>
        {/* Inner spinning element */}
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-semibold text-slate-700 animate-pulse">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Analyzing depth metrics and optimization runtime...</p>
    </div>
  );
}