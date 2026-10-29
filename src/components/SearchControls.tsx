import React from 'react';
import { Search, MapPin, Briefcase, Globe, Filter, Sparkles, Building2 } from 'lucide-react';
import { JobSearchParams } from '../types/agent';

interface SearchControlsProps {
  params: JobSearchParams;
  onChange: (updated: Partial<JobSearchParams>) => void;
  onSubmit: () => void;
  isSearching: boolean;
  canSubmit: boolean;
}

const COMMON_ROLE_SUGGESTIONS = [
  'Software Engineer Intern',
  'Full-Stack Engineer',
  'Associate Product Manager (APM)',
  'Product Designer Intern',
  'Frontend Engineer',
  'Data Science / ML Intern',
  'UI/UX Designer',
];

const AVAILABLE_PLATFORMS = [
  { id: 'LinkedIn', label: 'LinkedIn Jobs' },
  { id: 'Handshake', label: 'Handshake' },
  { id: 'Indeed', label: 'Indeed' },
  { id: 'Wellfound', label: 'Wellfound (AngelList)' },
  { id: 'Glassdoor', label: 'Glassdoor' },
  { id: 'Company Careers', label: 'Company Careers' },
];

export const SearchControls: React.FC<SearchControlsProps> = ({
  params,
  onChange,
  onSubmit,
  isSearching,
  canSubmit,
}) => {
  const togglePlatform = (platformId: string) => {
    const current = params.platforms;
    if (current.includes(platformId)) {
      if (current.length > 1) {
        onChange({ platforms: current.filter((p) => p !== platformId) });
      }
    } else {
      onChange({ platforms: [...current, platformId] });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit && !isSearching) {
          onSubmit();
        }
      }}
      className="space-y-5"
    >
      {/* 1. Preferred Role Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">
          Preferred Role <span className="text-indigo-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            value={params.preferredRole}
            onChange={(e) => onChange({ preferredRole: e.target.value })}
            placeholder="e.g. Software Engineer Intern, Associate Product Manager, Product Designer..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-xs text-slate-500">Suggestions:</span>
          {COMMON_ROLE_SUGGESTIONS.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => onChange({ preferredRole: role })}
              className={`text-[11px] px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                params.preferredRole === role
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grid: Location & Job Type & Experience Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Target Location
          </label>
          <input
            type="text"
            value={params.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. Remote, San Francisco, New York..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Job Type Segmented Control */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Opportunity Type
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['Internship', 'Full-time', 'All'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ jobType: type })}
                className={`py-1.5 text-xs font-medium rounded transition-colors cursor-pointer text-center ${
                  params.jobType === type
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Experience Level
          </label>
          <select
            value={params.experienceLevel}
            onChange={(e) =>
              onChange({
                experienceLevel: e.target.value as JobSearchParams['experienceLevel'],
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="Internship">Internship / Student</option>
            <option value="Entry-Level">Entry-Level (0 - 2 years)</option>
            <option value="Mid-Level">Mid-Level (2 - 5 years)</option>
            <option value="Senior">Senior (5+ years)</option>
            <option value="Any">Any Experience</option>
          </select>
        </div>
      </div>

      {/* 3. Target Platforms Checkbox Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          Search Across Popular Platforms
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {AVAILABLE_PLATFORMS.map((plat) => {
            const isChecked = params.platforms.includes(plat.id);
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => togglePlatform(plat.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-slate-800/90 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                <span className="truncate block">{plat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Additional Custom Focus / Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Additional Focus or Keywords (Optional)
        </label>
        <input
          type="text"
          value={params.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="e.g. Early-stage AI startups, YC companies, high-velocity engineering, mentorship focus..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSubmit || isSearching}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            !canSubmit || isSearching
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.99] border border-indigo-400/30'
          }`}
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Agent Searching Across Job Portals...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Job Search Agent & Get Top 3 Recommendations</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
