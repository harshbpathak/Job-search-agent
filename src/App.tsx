import React, { useState } from 'react';
import { Header } from './components/Header';
import { ResumeDropzone } from './components/ResumeDropzone';
import { SearchControls } from './components/SearchControls';
import { AgentStatusPipeline } from './components/AgentStatusPipeline';
import { RecommendationCard } from './components/RecommendationCard';
import { CandidateSummaryBanner } from './components/CandidateSummaryBanner';
import { InfoModal } from './components/InfoModal';
import { Footer } from './components/Footer';
import { SampleResume } from './data/sampleResumes';
import {
  AgentSearchResponse,
  CandidateProfile,
  JobSearchParams,
  UploadedFileState,
} from './types/agent';
import { Sparkles, ArrowRight, AlertTriangle, RefreshCw, Briefcase, Award } from 'lucide-react';

export default function App() {
  // Input states
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [parsedProfile, setParsedProfile] = useState<CandidateProfile | null>(null);
  const [isParsingQuick, setIsParsingQuick] = useState<boolean>(false);

  // Search parameter states
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    preferredRole: '',
    location: 'Remote, US',
    jobType: 'Internship',
    experienceLevel: 'Internship',
    platforms: ['LinkedIn', 'Handshake', 'Indeed', 'Wellfound'],
    additionalNotes: '',
  });

  // Agent execution state
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<AgentSearchResponse | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Handle Quick Resume Parsing for immediate feedback
  const handleQuickParse = async (text: string, file?: UploadedFileState) => {
    try {
      setIsParsingQuick(true);
      const res = await fetch('/api/agent/quick-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          fileData: file?.base64Data,
          mimeType: file?.type,
        }),
      });
      const data = await res.json();
      if (data.profile) {
        setParsedProfile(data.profile);
      }
    } catch (e) {
      console.warn('Quick parse background hint:', e);
    } finally {
      setIsParsingQuick(false);
    }
  };

  // Handle file drop/upload
  const handleFileSelect = (fileState: UploadedFileState, textContent: string) => {
    setUploadedFile(fileState);
    setResumeText(textContent);
    setSelectedSampleId(null);
    setSearchError(null);
    handleQuickParse(textContent, fileState);
  };

  // Handle sample candidate selection
  const handleSelectSample = (sample: SampleResume) => {
    setUploadedFile({
      name: `${sample.candidateName.replace(' ', '_')}_Resume.pdf`,
      size: 42000,
      type: 'application/pdf',
      textPreview: sample.text.slice(0, 300),
    });
    setResumeText(sample.text);
    setSelectedSampleId(sample.id);
    setSearchParams((prev) => ({
      ...prev,
      preferredRole: sample.targetRole,
    }));
    setSearchError(null);

    // Set sample profile directly
    setParsedProfile({
      candidateName: sample.candidateName,
      headline: sample.headline,
      summary: `Candidate profile for ${sample.candidateName} targeting ${sample.targetRole}.`,
      detectedExperienceLevel: 'Internship / Student',
      technicalSkills:
        sample.domain === 'Tech'
          ? ['TypeScript', 'React', 'Python', 'Go', 'Docker', 'PostgreSQL', 'Redis', 'AWS']
          : sample.domain === 'Product'
          ? ['PRD Drafting', 'Roadmap Planning', 'SQL', 'A/B Testing', 'Amplitude', 'Linear']
          : ['Figma', 'Design Systems', 'WCAG Accessibility', 'Rapid Prototyping', 'Tailwind CSS'],
    });
  };

  const handleClearResume = () => {
    setUploadedFile(null);
    setResumeText('');
    setSelectedSampleId(null);
    setParsedProfile(null);
  };

  const handleResetSearch = () => {
    setResults(null);
    setSearchError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Run the Main Job Search Agent
  const handleRunAgent = async () => {
    if (!resumeText.trim() && !uploadedFile?.base64Data) {
      setSearchError('Please upload a resume or select a sample candidate profile.');
      return;
    }
    if (!searchParams.preferredRole.trim()) {
      setSearchError('Please provide a preferred role to search for.');
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      setResults(null);

      // Scroll to agent pipeline area
      const pipelineElement = document.getElementById('pipeline-area');
      if (pipelineElement) {
        pipelineElement.scrollIntoView({ behavior: 'smooth' });
      }

      const res = await fetch('/api/agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          fileData: uploadedFile?.base64Data,
          mimeType: uploadedFile?.type,
          preferredRole: searchParams.preferredRole,
          location: searchParams.location,
          jobType: searchParams.jobType,
          experienceLevel: searchParams.experienceLevel,
          platforms: searchParams.platforms,
          additionalNotes: searchParams.additionalNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to complete job search.');
      }

      setResults(data);

      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } catch (err: any) {
      console.error('Agent search error:', err);
      setSearchError(
        err.message ||
          'The search agent encountered an error querying live job platforms. Please verify your role and try again.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const canSubmit = (!!resumeText.trim() || !!uploadedFile) && !!searchParams.preferredRole.trim();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar Header */}
      <Header
        onReset={handleResetSearch}
        hasResults={!!results}
        isSearching={isSearching}
        onOpenInfo={() => setShowInfoModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-medium text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Autonomous Recruiter & Match Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Find the Top 3 job opportunities engineered for your exact resume.
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            Upload your resume and state your target role. Jobby searches across
            LinkedIn, Handshake, Indeed, and Wellfound to compute your 3 best-fit roles
            with deep skill gap audits and tailored recruiter cover notes.
          </p>
        </div>

        {/* Input Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Resume Ingestion */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <ResumeDropzone
              uploadedFile={uploadedFile}
              resumeText={resumeText}
              onFileSelect={handleFileSelect}
              onTextChange={setResumeText}
              onClear={handleClearResume}
              parsedProfile={parsedProfile}
              isParsingQuick={isParsingQuick}
              onSelectSample={handleSelectSample}
              selectedSampleId={selectedSampleId}
            />
          </div>

          {/* Right Column: Search Specifications */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <SearchControls
              params={searchParams}
              onChange={(updated) => setSearchParams((prev) => ({ ...prev, ...updated }))}
              onSubmit={handleRunAgent}
              isSearching={isSearching}
              canSubmit={canSubmit}
            />
          </div>
        </div>

        {/* Search Pipeline Status Display */}
        <div id="pipeline-area">
          <AgentStatusPipeline
            isSearching={isSearching}
            preferredRole={searchParams.preferredRole}
            platforms={searchParams.platforms}
          />
        </div>

        {/* Error Notification */}
        {searchError && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3 shadow-md">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-rose-300">Search Agent Issue</p>
              <p className="leading-relaxed">{searchError}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div id="results-section" className="space-y-8 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Top 3 Curated Job Recommendations
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ranked by multi-factor qualification overlap, platform availability, and candidate impact.
                </p>
              </div>
              <button
                onClick={handleRunAgent}
                disabled={isSearching}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSearching ? 'animate-spin' : ''}`} />
                Re-scan Portals
              </button>
            </div>

            {/* Candidate Summary & Search Audit Banner */}
            <CandidateSummaryBanner data={results} />

            {/* Top 3 Job Cards Stack */}
            <div className="space-y-6">
              {results.top3Recommendations && results.top3Recommendations.length > 0 ? (
                results.top3Recommendations.map((job) => (
                  <RecommendationCard
                    key={job.id || job.rank}
                    job={job}
                    candidateName={results.candidateSummary.name || 'Candidate'}
                  />
                ))
              ) : (
                <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
                  <h4 className="text-base font-semibold text-white">No active matches found</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try broadening your target role title or loosening your location constraint to search across more opportunities.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Info / How it Works Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}
