import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Start Interview', path: '/dashboard', icon: '🎯' }, // Directs to setup triggers
    { name: 'Community Forum', path: '/forum', icon: '💬' },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400 flex items-center gap-2">
          🤖 AI-Interviewer
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <a 
          href="http://localhost:5000/auth/logout"
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
        >
          <span>🚪</span> Sign Out
        </a>
      </div>
    </div>
  );
}