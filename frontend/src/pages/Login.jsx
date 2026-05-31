import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">🤖 AI Mock Interview</h1>
        <p className="text-slate-500 mb-8">Practice coding and system design with conversational AI.</p>
        <a 
          href="http://localhost:5000/auth/google" 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all shadow flex items-center justify-center gap-2"
        >
          🚀 Sign In with Google
        </a>
      </div>
    </div>
  );
}