
import React from 'react';
import { MatchResult } from '../types';

interface ResultsGridProps {
  matches: (MatchResult & { url: string; name: string })[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ matches }) => {
  if (matches.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
      {matches.map((match, idx) => (
        <div 
          key={match.id + idx} 
          className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col"
        >
          <div className="relative aspect-square">
            <img 
              src={match.url} 
              alt={match.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              {Math.round(match.similarityScore)}% SIMILAR
            </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xs font-mono text-slate-300 truncate mb-2" title={match.name}>
              {match.name}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
              {match.reason}
            </p>
            <div className="mt-auto pt-4 flex items-center justify-between">
              <button 
                onClick={() => window.open(match.url, '_blank')}
                className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Ver Imagem Cheia
              </button>
              <i className="fas fa-check-circle text-green-500 text-sm"></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsGrid;
