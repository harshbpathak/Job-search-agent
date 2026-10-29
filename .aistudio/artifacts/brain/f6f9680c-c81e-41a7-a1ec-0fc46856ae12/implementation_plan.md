# AI Job & Internship Search Agent

An autonomous job search and evaluation agent that ingests candidate resumes, searches across premier hiring platforms (LinkedIn, Indeed, Handshake, Wellfound, Glassdoor, and company job portals), and delivers the top 3 optimal role recommendations complete with match scoring, skill gap breakdown, and tailored application notes.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and govern the implementation:

- **Confirmed Decision 1 (Target Roles)**: Broad coverage across Tech (Software, DevOps, Data), Product (Product Management, Growth), and Design (Product Design, UX/UI), supporting both internship and entry/mid-level opportunities.
- **Confirmed Decision 2 (Resume Ingestion)**: File upload-first workflow supporting PDF and text-based resume documents (`.pdf`, `.docx`, `.txt`), with instant sample resume profiles provided for immediate testing.
- **Confirmed Decision 3 (Recommendation Deliverables)**: Top 3 recommendations accompanied by match scores, matching core competencies, missing/gap skills, key requirements, source job board citations, and an automated, tailored cover note / elevator pitch.
- **Backend Architecture**: Full-stack application utilizing an Express server (`server.ts`) powered by the official `@google/genai` SDK with `gemini-3.8-flash` and Google Search Grounding to discover real, up-to-date active listings.

---

### 1. Overview & Core Concept

- **What It Does**: The user uploads their resume and specifies their preferred role (e.g., "Product Designer Intern", "Full-Stack Engineer", "Associate Product Manager"), target location, and job type. The agent parses the resume into structured skills and experience, searches across leading hiring and internship boards, evaluates candidate suitability, and computes the top 3 highest-match recommendations with detailed analysis and tailored pitch letters.
- **Target Audience**: Students seeking summer/fall internships, early-career engineers, product managers, and designers seeking high-conviction job matches without wading through hundreds of generic job listings.
- **Key Value**: Saves hours of job hunting by substituting manual portal searches with an intelligent, grounded agent that reads your actual experience, verifies real job postings, and tells you exactly why you match and what you need to emphasize.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Upload & Preference Specification**:
     - Modern drag-and-drop resume upload zone accepting PDF, DOCX, and TXT files, with visual file inspection and quick-start demo profiles (e.g., "Full-Stack Engineer Intern", "Product Design Lead", "APM Candidate").
     - Search configuration bar: Target Role input, Location preference (Remote, Hybrid, City), and Experience tier (Internship, Entry-level, Mid/Senior).
  2. **Autonomous Agent Execution Pipeline**:
     - Visual 4-stage live progress pipeline showing the agent's real-time phases:
       - `1. Resume Analysis`: Extracting core tech stack, frameworks, leadership traits, and domain experience.
       - `2. Multi-Portal Search`: Querying active postings across LinkedIn, Indeed, Handshake, Wellfound, and employer careers portals.
       - `3. Match Scoring & Gap Analysis`: Cross-referencing qualifications against role requirements.
       - `4. Top 3 Synthesis`: Generating custom elevator pitches and rank ordering.
  3. **Top 3 Recommendations Presentation**:
     - Clean, distinctive side-by-side or stacked comparative view for the Top 3 positions.
     - Rich role metadata (Company, Location, Salary estimate/range, Verified Portal Source, Date posted).
     - Match Score dial (`tabular-nums` percentage) with confidence tier.
     - Two-column skill audit: **Matching Strengths** (in green) and **Skill Gaps / Growth Areas** (in amber).
     - **Tailored Application Note**: One-click expandable, personalized cover note ready to copy or export for the application.
     - Direct external apply links with source verification badges.
  4. **Resume Skill Matrix Drawer**:
     - Interactive side-drawer summarizing parsed skills, years of experience, and extracted education for candidate review.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Refined modern SaaS workspace inspired by linear, craft-first enterprise tools. Clean slate surfaces, subtle hairline borders, and intentional accents without noisy gradients or decorative pills.
  - *Typography*: `Plus Jakarta Sans` for clean, professional headings and navigation; `DM Sans` for body copy and readable job descriptions; `JetBrains Mono` / `tabular-nums` for match percentages and dates.
  - *Color Palette*:
    - Canvas: Deep slate neutral (`bg-slate-950` / `bg-slate-900` dark posture or clean neutral light surface).
    - Structural Surfaces: Flat cards with hairline boundaries (`border-slate-800` / `border-slate-200`).
    - Accent: Electric indigo (`indigo-600` / `indigo-500`) for primary agent actions and verified source links; emerald (`emerald-600`) for matching skills; amber (`amber-600`) for gap alerts.
  - *Anti-Slop Discipline*: Zero static pill tags (metadata uses quiet `·` separators); no fake compiler status logs or arbitrary telemetry tickers; no thick left accent borders.

- **Interactive Feedback & Motion**:
  - Drag-and-drop dropzone hover states with subtle border accent transition.
  - Real-time animated pipeline progress indicators during agent execution.
  - Smooth tab switching between Overview, Skill Match Breakdown, and Tailored Pitch Note.
  - Instant copy-to-clipboard toast for cover notes and application links.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Server with Gemini 3.8 Flash + Search Grounding**:
  - *Chosen Approach*: Implement an Express backend (`server.ts`) with `@google/genai` utilizing `gemini-3.8-flash` and Google Search Grounding to find real-time, active job postings across LinkedIn, Handshake, Wellfound, Indeed, and company sites.
  - *Why*: Client-side Gemini calls expose API keys and cannot leverage search grounding effectively. Server-side execution is secure, robust, and supports rich streaming or structured outputs.
  - *Alternatives Considered*: Hardcoded static job datasets (rejected: fails to meet user requirement to search across popular intern/job websites).

- **Decision 2: Comprehensive Document Ingestion & Fallback Samples**:
  - *Chosen Approach*: Support direct PDF parsing (extracting text from binary PDFs using standard client/server extraction) and text file uploads, augmented with 3 pre-built realistic candidate profiles (Tech, Product, Design).
  - *Why*: Allows instant testing without needing an immediate personal resume PDF file on hand, while fully honoring the user's choice of document file upload.

- **Decision 3: Structured Top 3 Recommendation Schema**:
  - *Chosen Approach*: Enforce strict JSON schema for agent evaluation to return exactly 3 ranked opportunities with standardized match score (0-100), key qualifications, matching competencies, missing competencies, rationale, and a bespoke application note.
  - *Why*: Prevents unstructured wall-of-text responses and guarantees that the UI can render rich interactive comparison cards and skill matrices.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Frontend (Vite)                        │
│                                                                        │
│  ┌───────────────────────┐      ┌───────────────────────────────────┐  │
│  │ Resume Upload Zone    │      │ Search Parameters Control         │  │
│  │ (PDF/DOCX/TXT Parser) │      │ (Role, Location, Type, Level)     │  │
│  └───────────┬───────────┘      └─────────────────┬─────────────────┘  │
│              │                                    │                    │
│              ▼                                    ▼                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │            Agent Execution Controller & Pipeline Tracker         │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ POST /api/agent/search
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express Server (server.ts)                        │
│                                                                        │
│  ┌────────────────────────┐              ┌───────────────────────────┐ │
│  │ Resume Parsing Engine  │              │ Google GenAI SDK Client   │ │
│  │ & Skills Extractor     │─────────────▶│ (@google/genai)           │ │
│  └────────────────────────┘              └─────────────┬─────────────┘ │
│                                                        │               │
│                                                        ▼               │
│                                          ┌───────────────────────────┐ │
│                                          │ Gemini 3.8 Flash          │ │
│                                          │ + Google Search Grounding │ │
│                                          └─────────────┬─────────────┘ │
│                                                        │               │
│                                                        ▼               │
│                                          ┌───────────────────────────┐ │
│                                          │ Top 3 Job Ranking &       │ │
│                                          │ Tailored Pitch Generator  │ │
│                                          └─────────────┬─────────────┘ │
└────────────────────────────────────────────────────────┼───────────────┘
                                                         │ Returns Top 3
                                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Interactive Results View                        │
│                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────┐ │
│  │ 1st Best Match (Card)│  │ 2nd Best Match (Card)│  │ 3rd Best (Card)│
│  │ - 96% Match Score    │  │ - 91% Match Score    │  │ - 87% Match   │ │
│  │ - Matching Skills    │  │ - Matching Skills    │  │ - Skills      │ │
│  │ - Gap Analysis       │  │ - Gap Analysis       │  │ - Gap         │ │
│  │ - Custom Cover Note  │  │ - Custom Cover Note  │  │ - Cover Note  │ │
│  │ - Source Apply Link  │  │ - Source Apply Link  │  │ - Apply Link  │ │
│  └──────────────────────┘  └──────────────────────┘  └───────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & Schema**:
  - `CandidateProfile`: Parsed name, target role, summary, extracted skills (`technical`, `tools`, `soft`), experience highlights, and education.
  - `JobSearchQuery`: `role`, `locationPreference` (remote/hybrid/onsite), `experienceLevel` (internship/entry/mid), `additionalNotes`.
  - `JobRecommendation`:
    - `id`: Unique identifier
    - `rank`: 1, 2, or 3
    - `jobTitle`: Title of the role
    - `company`: Company name
    - `location`: Workplace location or "Remote"
    - `jobType`: "Internship" | "Full-time" | "Contract"
    - `platformSource`: "LinkedIn" | "Indeed" | "Handshake" | "Wellfound" | "Company Careers"
    - `sourceUrl`: Real URL / Search referral link
    - `salaryOrStipend`: Estimated compensation if available
    - `matchScore`: Numerical integer (0 to 100)
    - `matchRationale`: 2-sentence rationale for the recommendation
    - `matchingSkills`: Array of matched candidate skills
    - `missingSkills`: Array of missing or bonus skills to address
    - `customCoverNote`: 150-word targeted pitch ready to send to the recruiter
    - `postedDate`: Relative posting recency (e.g., "Active · Posted 3 days ago")
