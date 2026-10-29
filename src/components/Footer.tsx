import React from 'react';
import { Briefcase } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Jobby</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>AI Job & Internship Search Agent</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span>LinkedIn</span>
          <span>Indeed</span>
          <span>Handshake</span>
          <span>Wellfound</span>
          <span>Glassdoor</span>
        </div>

        <p className="text-slate-600">
          Evaluates candidate fit against verified public postings.
        </p>
      </div>
    </footer>
  );
};
