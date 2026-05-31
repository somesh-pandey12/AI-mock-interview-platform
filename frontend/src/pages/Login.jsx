import React from 'react';
import { Terminal, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

export default function Login() {
  const handleGoogleLogin = () => {
    // Connect to your passport/auth backend URI channel
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center font-sans antialiased relative overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* 🌌 High-Fidelity Futuristic Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030712] to-[#030712]"></div>
      
      {/* Decorative Grid Lines to match your Cockpit Dashboard aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* 🚀 Floating Accent Orbs for Depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] delay-1000 animate-pulse"></div>

      {/* 🛠️ Main Glassmorphic Interface Card Wrapper */}
      <div className="relative w-full max-w-md mx-4 z-10">
        
        {/* Animated Neon Laser Top Border Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80"></div>
        
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] space-y-8 relative">
          
          {/* Upper Micro Telemetry Label */}
          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              <span className="text-[10px] font-mono font-bold text-blue-400 tracking-widest uppercase">
                SECURE AUTH GATE // NODE_01
              </span>
            </div>
          </div>

          {/* Core Platform Identity Area */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl text-blue-400 shadow-inner group hover:border-blue-500/30 transition-all duration-300">
              <Terminal size={28} className="animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              AI Mock Interview
            </h1>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              Deploy your local sandboxes, challenge conversational evaluation matrices, and trace system engineering workflows.
            </p>
          </div>

          {/* 🌟 Bulleted Micro Features Grid for Recruiter/User Context */}
          <div className="grid grid-cols-1 gap-2.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
            <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
              <Cpu size={14} className="text-blue-500" />
              <span>Interactive Code Sandboxes</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
              <Sparkles size={14} className="text-emerald-500" />
              <span>Real-time Gemini Feedback Logs</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
              <ShieldCheck size={14} className="text-purple-500" />
              <span>Multi-Dimensional Metrics</span>
            </div>
          </div>

          {/* Primary Action Zone */}
          <div className="space-y-4 pt-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold font-sans text-xs py-3.5 px-4 rounded-xl tracking-wider uppercase transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 shadow-xl hover:shadow-white/5 border border-white/20 group"
            >
              {/* Clean Vector SVG Google Icon Graphic */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.934 11.934 0 0 0 12 0C7.105 0 2.898 2.654.605 6.577l4.661 3.188z"
                />
                <path
                  fill="#4285F4"
                  d="M23.745 12.273c0-.827-.074-1.623-.21-2.391H12v4.51H18.6c-.284 1.52-.1.011 1.492.936l4.47 3.473c2.614-2.41 4.116-5.952 4.116-9.528z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.266 14.235L.605 17.423A11.934 11.934 0 0 0 12 24c3.082 0 5.823-1.018 7.91-2.768l-4.47-3.473c-1.214.814-2.764 1.305-4.44 1.305-3.432 0-6.355-2.318-7.39-5.444z"
                />
                <path
                  fill="#34A853"
                  d="M.605 6.577a11.854 11.854 0 0 0 0 10.846l4.661-3.188a7.014 7.014 0 0 1 0-4.47L.605 6.577z"
                />
              </svg>
              Sign In with Google
            </button>
            
            <p className="text-[10px] text-center font-mono text-slate-600 uppercase tracking-widest pointer-events-none">
              Secured Encryption protocol active
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}