import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Globe, FileSearch, Sparkles, Cpu } from 'lucide-react';

interface AgentStatusPipelineProps {
  isSearching: boolean;
  preferredRole: string;
  platforms: string[];
}

const STAGES = [
  {
    id: 1,
    title: 'Parsing Candidate Qualifications',
    desc: 'Extracting tech stack, project outcomes, leadership traits, and experience level',
    icon: FileSearch,
  },
  {
    id: 2,
    title: 'Multi-Platform Grounded Search',
    desc: 'Querying live postings across verified career boards and company portals',
    icon: Globe,
  },
  {
    id: 3,
    title: 'Skill Compatibility & Gap Analysis',
    desc: 'Evaluating candidate strengths vs. job requirements and calculating match indices',
    icon: Cpu,
  },
  {
    id: 4,
    title: 'Synthesizing Top 3 Recommendations',
    desc: 'Generating bespoke recruiter cover notes and personalized application strategies',
    icon: Sparkles,
  },
];

export const AgentStatusPipeline: React.FC<AgentStatusPipelineProps> = ({
  isSearching,
  preferredRole,
  platforms,
}) => {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    if (!isSearching) {
      setActiveStage(1);
      return;
    }

    const timer1 = setTimeout(() => setActiveStage(2), 2200);
    const timer2 = setTimeout(() => setActiveStage(3), 5200);
    const timer3 = setTimeout(() => setActiveStage(4), 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isSearching]);

  if (!isSearching) return null;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping inline-block" />
            Agent Executing Search Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeting: <span className="text-indigo-300 font-medium">{preferredRole}</span> across {platforms.length} hiring platforms
          </p>
        </div>
        <div className="text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-lg shrink-0">
          Stage {activeStage} of 4
        </div>
      </div>

      {/* Progress Track */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {STAGES.map((stage) => {
          const isDone = activeStage > stage.id;
          const isCurrent = activeStage === stage.id;
          const isPending = activeStage < stage.id;

          const IconComponent = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                  : isDone
                  ? 'bg-slate-900/90 border-slate-700/80'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isDone
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <h4 className="text-xs font-semibold text-slate-200 mb-1 leading-snug">
                {stage.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
