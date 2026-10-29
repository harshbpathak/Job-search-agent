import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { JobRecommendation } from '../types/agent';

interface RecommendationCardProps {
  job: JobRecommendation;
  candidateName: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  job,
  candidateName,
}) => {
  const [copiedNote, setCopiedNote] = useState(false);
  const [showFullNote, setShowFullNote] = useState(false);
  const [currentNote, setCurrentNote] = useState(job.customCoverNote);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState<'match' | 'coverNote'>('match');

  const handleCopyNote = async () => {
    try {
      await navigator.clipboard.writeText(currentNote);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleRefineTone = async (tone: string) => {
    try {
      setIsRefining(true);
      const res = await fetch('/api/agent/refine-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.jobTitle,
          company: job.company,
          candidateName,
          originalNote: currentNote,
          tone,
        }),
      });
      const data = await res.json();
      if (data.refinedNote) {
        setCurrentNote(data.refinedNote);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  // Rank Styling
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          label: '1st Best Match',
          badgeClass: 'text-indigo-400 bg-indigo-950/70 border-indigo-500/40',
          accentBorder: 'border-indigo-500/40',
        };
      case 2:
        return {
          label: '2nd Best Match',
          badgeClass: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40',
          accentBorder: 'border-emerald-500/30',
        };
      default:
        return {
          label: '3rd Best Match',
          badgeClass: 'text-amber-400 bg-amber-950/70 border-amber-500/40',
          accentBorder: 'border-amber-500/30',
        };
    }
  };

  const rankInfo = getRankBadge(job.rank);

  // Compute verify link: if sourceUrl is a valid URL, use it; else fallback to a direct query link
  const applyUrl = job.sourceUrl && job.sourceUrl.startsWith('http')
    ? job.sourceUrl
    : `https://www.google.com/search?q=${encodeURIComponent(
        `${job.company} ${job.jobTitle} ${job.location} apply jobs`
      )}`;

  return (
    <div
      className={`rounded-2xl bg-slate-900 border ${rankInfo.accentBorder} p-6 space-y-5 transition-all duration-200 hover:border-slate-700 shadow-lg relative`}
    >
      {/* Top Bar: Rank & Match Score */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${rankInfo.badgeClass}`}
          >
            {rankInfo.label}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {job.platformSource}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-xs text-slate-500">{job.postedDate}</span>
        </div>

        {/* Match Score Display */}
        <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Fit Index</div>
            <div className="text-[11px] text-indigo-400 font-medium">
              {job.matchConfidence || 'High Match'}
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-white flex items-baseline">
            {job.matchScore}
            <span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Role Title & Company Header */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight hover:text-indigo-300 transition-colors">
          {job.jobTitle}
        </h3>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-1.5">
          <span className="flex items-center gap-1 font-semibold text-slate-200">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            {job.company}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {job.location}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-indigo-300 font-medium">{job.jobType}</span>
          {job.salaryOrStipend && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono tabular-nums font-medium">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                {job.salaryOrStipend}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Rationale Quote */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-indigo-300">Agent Rationale: </span>
        {job.matchRationale}
      </div>

      {/* Tab Switcher: Match Breakdown vs Tailored Pitch Note */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
        <button
          onClick={() => setActiveTab('match')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'match'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Skill Match Breakdown
        </button>
        <button
          onClick={() => setActiveTab('coverNote')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'coverNote'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          Tailored Cover Note
        </button>
      </div>

      {/* TAB 1: Skill Match & Gap Analysis */}
      {activeTab === 'match' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Matching Qualifications ({job.matchingSkills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.matchingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Gap Analysis / Growth Areas */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Skill Gaps / Nice-to-Have
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.missingSkills && job.missingSkills.length > 0 ? (
                  job.missingSkills.map((gap, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded"
                    >
                      {gap}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">
                    No major skill gaps detected! High baseline coverage.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold text-slate-300">
                Core Responsibilities:
              </div>
              <ul className="space-y-1">
                {job.keyResponsibilities.map((resp, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-400 flex items-start gap-2"
                  >
                    <span className="text-indigo-400 font-bold shrink-0">·</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Custom Tailored Cover Note / Recruiter Pitch */}
      {activeTab === 'coverNote' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Personalized Application Pitch:
            </span>
            {/* Tone refinement buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Tone:</span>
              <button
                disabled={isRefining}
                onClick={() => handleRefineTone('Startup & Direct')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Startup
              </button>
              <button
                disabled={isRefining}
                onClick={() => handleRefineTone('Corporate & Polished')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Corporate
              </button>
              <button
                disabled={isRefining}
                onClick={() => handleRefineTone('Passionate & Creative')}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Passionate
              </button>
            </div>
          </div>

          {/* Cover note content */}
          <div className="relative p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
            {isRefining ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-indigo-400">
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400">
                  Refining cover note tone with Gemini...
                </span>
              </div>
            ) : (
              <>
                <p>
                  {showFullNote || currentNote.length <= 320
                    ? currentNote
                    : `${currentNote.slice(0, 320)}...`}
                </p>
                {currentNote.length > 320 && (
                  <button
                    onClick={() => setShowFullNote(!showFullNote)}
                    className="mt-2 text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {showFullNote ? (
                      <>
                        Show less <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Read full note <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCopyNote}
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedNote ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Copy Cover Note
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Source: <span className="text-slate-400">{job.platformSource}</span>
        </div>
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
        >
          <span>Apply on {job.platformSource}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
