import React from 'react';
import { Sparkles, Briefcase, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasResults: boolean;
  isSearching: boolean;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  hasResults,
  isSearching,
  onOpenInfo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            className="text-xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            Jobby
          </a>
          <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-800 pl-3">
            Autonomous Job Search Agent
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single line, quiet hover) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={onOpenInfo}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            How It Works
          </button>
          <a
            href="#portals"
            onClick={(e) => {
              e.preventDefault();
              onOpenInfo();
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Supported Platforms
          </a>
          <a
            href="#evaluation"
            onClick={(e) => {
              e.preventDefault();
              onOpenInfo();
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Ranking Criteria
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {hasResults ? (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              New Search
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Grounded in Live Web</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
