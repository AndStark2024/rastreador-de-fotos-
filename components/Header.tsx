
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <i className="fas fa-eye text-2xl text-white"></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">VisionHunt AI</h1>
          <p className="text-slate-400 text-sm">Motor de Busca Visual Neural</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-full border border-slate-800">
        <span className="px-4 py-1.5 rounded-full bg-slate-800 text-xs font-medium text-slate-300">
          Tecnologia Gemini 3 Flash
        </span>
        <div className="flex items-center gap-2 pr-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema Ativo</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
