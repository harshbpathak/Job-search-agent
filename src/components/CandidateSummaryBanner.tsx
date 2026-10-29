import React from 'react';
import { UserCheck, Sparkles, Search, Layers } from 'lucide-react';
import { AgentSearchResponse } from '../types/agent';

interface CandidateSummaryBannerProps {
  data: AgentSearchResponse;
}

export const CandidateSummaryBanner: React.FC<CandidateSummaryBannerProps> = ({
  data,
}) => {
  const { candidateSummary, searchMetrics } = data;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-md space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {candidateSummary.name || 'Candidate Profile'}
              </h2>
              <span className="text-xs text-indigo-400 font-medium">
                · {candidateSummary.experienceLevel || 'Intern / Entry'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {candidateSummary.headline || 'Profile Evaluated by Jobby Agent'}
            </p>
          </div>
        </div>

        {/* Search Audit Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800/80 shrink-0">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
              Evaluated
            </span>
            <span className="font-bold text-white tabular-nums">
              {searchMetrics?.totalEvaluated || 30}+ roles
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
              Platforms
            </span>
            <span className="font-bold text-indigo-300">
              {searchMetrics?.platformsScanned?.length || 4} Sources
            </span>
          </div>
        </div>
      </div>

      {/* Synthesis */}
      {candidateSummary.searchSynthesis && (
        <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/60">
          <span className="text-indigo-400 font-semibold">Agent Search Insight: </span>
          {candidateSummary.searchSynthesis}
        </p>
      )}

      {/* Top Skills Tags */}
      {candidateSummary.topSkillsIdentified &&
        candidateSummary.topSkillsIdentified.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Core Competencies Audited:
            </span>
            {candidateSummary.topSkillsIdentified.map((skill, i) => (
              <span
                key={i}
                className="text-xs text-slate-300 bg-slate-800/70 border border-slate-700/60 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
    </div>
  );
};
