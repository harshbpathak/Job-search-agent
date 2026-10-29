import React from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            How Jobby Agent Works
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous hiring search and intelligent candidate-job pairing system.
          </p>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              1. Deep Resume Ingestion
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Jobby accepts full PDF, DOCX, and TXT resumes. The agent analyzes
              every project bullet point, framework, programming language,
              leadership role, and metric to build a multidimensional candidate profile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-indigo-400" />
              2. Multi-Platform Grounded Search
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Using real-time Google Search Grounding with Gemini 3.8 Flash, Jobby queries
              live active job boards including LinkedIn Jobs, Handshake, Indeed, Wellfound (AngelList),
              Glassdoor, and employer career portals (Greenhouse, Lever, Ashby).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. Top 3 Match & Tailored Application Pitch
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Rather than overwhelming you with dozens of low-signal listings, Jobby isolates
              the top 3 highest-probability matches. It provides a detailed qualification audit
              (matching strengths vs. skill gaps) and authors a tailored outreach note ready
              to copy into your application or recruiter messages.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
