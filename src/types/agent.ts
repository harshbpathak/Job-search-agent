export interface CandidateProfile {
  candidateName: string;
  headline: string;
  summary: string;
  detectedExperienceLevel: string;
  yearsOfExperience?: string;
  technicalSkills?: string[];
  productOrDesignSkills?: string[];
  softSkills?: string[];
  education?: string;
  suggestedRoles?: string[];
}

export interface JobRecommendation {
  rank: number;
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: 'Internship' | 'Full-time' | 'Co-op' | string;
  platformSource: 'LinkedIn' | 'Handshake' | 'Indeed' | 'Wellfound' | 'Glassdoor' | 'Company Careers' | string;
  sourceUrl: string;
  salaryOrStipend: string;
  matchScore: number;
  matchConfidence: string;
  matchRationale: string;
  matchingSkills: string[];
  missingSkills: string[];
  keyResponsibilities: string[];
  customCoverNote: string;
  postedDate: string;
}

export interface SearchMetrics {
  platformsScanned: string[];
  totalEvaluated: number;
  searchQueryUsed: string;
  timestamp: string;
}

export interface AgentSearchResponse {
  candidateSummary: {
    name: string;
    headline: string;
    topSkillsIdentified: string[];
    experienceLevel: string;
    searchSynthesis: string;
  };
  searchMetrics: SearchMetrics;
  top3Recommendations: JobRecommendation[];
}

export interface JobSearchParams {
  preferredRole: string;
  location: string;
  jobType: 'Internship' | 'Full-time' | 'All';
  experienceLevel: 'Internship' | 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Any';
  platforms: string[];
  additionalNotes: string;
}

export interface UploadedFileState {
  name: string;
  size: number;
  type: string;
  base64Data?: string;
  textPreview?: string;
}
