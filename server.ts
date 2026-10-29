import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get Gemini Client with required User-Agent
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Clean JSON response helper from model text
function extractCleanJson(rawText: string): any {
  let cleaned = rawText.trim();
  // Strip code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
    cleaned = cleaned.trim();
  }
  // If wrapped with prefix or suffix text, isolate the JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

// 1. Quick Resume Parsing Endpoint
app.post('/api/agent/quick-parse', async (req, res) => {
  try {
    const { resumeText, fileData, mimeType } = req.body;

    if (!resumeText && !fileData) {
      return res.status(400).json({ error: 'Please provide resume text or a file.' });
    }

    const ai = getGeminiClient();

    const parts: any[] = [];
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: fileData,
        },
      });
    }

    const promptText = `
You are an expert technical talent recruiter. Parse the provided resume document and return a structured JSON profile.
Extract candidate name, current/recent role headline, brief 2-sentence summary, detected years or level of experience, key technical skills, design/product skills, soft skills, and notable education or achievements.

Return ONLY valid JSON with this exact structure:
{
  "candidateName": "Full Name",
  "headline": "e.g. Full-Stack Engineer & CS Student",
  "summary": "Brief 2-sentence professional synopsis.",
  "detectedExperienceLevel": "Internship | Entry-Level | Mid-Level | Senior",
  "yearsOfExperience": "e.g. 1-2 years or 0-1 years (Student)",
  "technicalSkills": ["Skill 1", "Skill 2"],
  "productOrDesignSkills": ["Skill 1", "Skill 2"],
  "softSkills": ["Communication", "Leadership"],
  "education": "University / Degree or highest education",
  "suggestedRoles": ["Suggested Role 1", "Suggested Role 2", "Suggested Role 3"]
}

${resumeText ? `Resume Text:\n${resumeText}` : ''}
`;
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = extractCleanJson(response.text || '{}');
    return res.json({ profile: parsed });
  } catch (error: any) {
    console.error('Error in /api/agent/quick-parse:', error);
    return res.status(500).json({
      error: error.message || 'Failed to parse resume.',
    });
  }
});

// 2. Main Job Search Agent Endpoint with Google Search Grounding
app.post('/api/agent/search', async (req, res) => {
  try {
    const {
      resumeText,
      fileData,
      mimeType,
      preferredRole,
      location,
      jobType,
      experienceLevel,
      platforms,
      additionalNotes,
    } = req.body;

    if (!preferredRole) {
      return res.status(400).json({ error: 'Preferred role is required.' });
    }

    if (!resumeText && !fileData) {
      return res.status(400).json({ error: 'Resume document or text is required.' });
    }

    const ai = getGeminiClient();

    const parts: any[] = [];
    if (fileData && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: fileData,
        },
      });
    }

    const targetPlatforms = (platforms && platforms.length > 0)
      ? platforms.join(', ')
      : 'LinkedIn, Handshake, Indeed, Wellfound (AngelList), Glassdoor, and Company Career Portals';

    const promptText = `
You are Jobby, an elite autonomous Job & Internship Search Agent.
Your mission:
1. Thoroughly analyze the candidate's resume (skills, tech stack, past projects, experience level, domain knowledge).
2. Use Google Search to discover real, up-to-date, active job and internship openings across popular platforms (${targetPlatforms}) for the role: "${preferredRole}".
   - Target Location: ${location || 'Any / Remote'}
   - Job Type: ${jobType || 'Internship or Full-time'}
   - Target Experience Level: ${experienceLevel || 'Internship / Entry-Level'}
   ${additionalNotes ? `- Specific User Focus/Notes: ${additionalNotes}` : ''}
3. Rigorously cross-match the candidate's qualifications with active job requirements.
4. Select and synthesize the TOP 3 HIGHEST-FIT RECOMMENDATIONS.
5. For each of the top 3 recommendations, calculate an honest Match Score (0 to 100), identify the exact matching strengths from the candidate's resume, highlight missing or development skill gaps, provide key responsibilities, and craft a bespoke, compelling ~150-word cover note / recruiter outreach message ready for the candidate to use.

Return strictly a JSON object with this exact schema:
{
  "candidateSummary": {
    "name": "Candidate's name or 'Applicant'",
    "headline": "e.g. Software Engineering Candidate",
    "topSkillsIdentified": ["React", "TypeScript", "Node.js", "Python"],
    "experienceLevel": "e.g. Student / Intern",
    "searchSynthesis": "A 2-sentence summary of candidate market positioning for this search."
  },
  "searchMetrics": {
    "platformsScanned": ["LinkedIn", "Handshake", "Indeed", "Wellfound"],
    "totalEvaluated": 42,
    "searchQueryUsed": "string query executed",
    "timestamp": "${new Date().toISOString()}"
  },
  "top3Recommendations": [
    {
      "rank": 1,
      "id": "job-1",
      "jobTitle": "Exact or Verified Job Title",
      "company": "Company Name",
      "location": "e.g. San Francisco, CA (Hybrid) or Remote (US)",
      "jobType": "Internship | Full-time | Co-op",
      "platformSource": "LinkedIn | Handshake | Indeed | Wellfound | Glassdoor | Company Careers",
      "sourceUrl": "Direct URL or Google search / careers URL to apply",
      "salaryOrStipend": "e.g. $45 - $55/hr or $110,000 - $135,000/yr or Competitive Stipend",
      "matchScore": 94,
      "matchConfidence": "Exceptional Fit | High Match | Solid Match",
      "matchRationale": "Clear 2-sentence rationale of why this candidate stands out for this specific job.",
      "matchingSkills": [
        "Exact Skill 1 matching candidate resume",
        "Exact Skill 2 matching candidate resume",
        "Exact Skill 3 matching candidate resume",
        "Exact Skill 4 matching candidate resume"
      ],
      "missingSkills": [
        "Growth skill or tool 1 that would strengthen application",
        "Preferred qualification 2 not explicitly in resume"
      ],
      "keyResponsibilities": [
        "Primary day-to-day focus 1",
        "Primary day-to-day focus 2",
        "Primary day-to-day focus 3"
      ],
      "customCoverNote": "A punchy, professional, highly tailored 120-160 word cover note / outreach letter addressed to the hiring team. Emphasize the candidate's specific projects and tools from the resume that directly solve the team's needs. Do not use generic cliches.",
      "postedDate": "e.g. Active · Posted recently"
    },
    {
      "rank": 2,
      "id": "job-2",
      "jobTitle": "Role Title",
      "company": "Company Name",
      "location": "Location",
      "jobType": "Job Type",
      "platformSource": "Platform Source",
      "sourceUrl": "URL",
      "salaryOrStipend": "Salary info",
      "matchScore": 89,
      "matchConfidence": "High Match",
      "matchRationale": "Rationale",
      "matchingSkills": ["Skill A", "Skill B", "Skill C"],
      "missingSkills": ["Gap A", "Gap B"],
      "keyResponsibilities": ["Resp 1", "Resp 2", "Resp 3"],
      "customCoverNote": "Tailored cover note...",
      "postedDate": "e.g. Active · 5 days ago"
    },
    {
      "rank": 3,
      "id": "job-3",
      "jobTitle": "Role Title",
      "company": "Company Name",
      "location": "Location",
      "jobType": "Job Type",
      "platformSource": "Platform Source",
      "sourceUrl": "URL",
      "salaryOrStipend": "Salary info",
      "matchScore": 84,
      "matchConfidence": "Solid Match",
      "matchRationale": "Rationale",
      "matchingSkills": ["Skill X", "Skill Y", "Skill Z"],
      "missingSkills": ["Gap X", "Gap Y"],
      "keyResponsibilities": ["Resp 1", "Resp 2", "Resp 3"],
      "customCoverNote": "Tailored cover note...",
      "postedDate": "e.g. Active · 1 week ago"
    }
  ]
}

${resumeText ? `Candidate Resume Content:\n${resumeText}` : ''}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" cannot be combined with googleSearch in some setups,
        // so we prompt for JSON and parse extractCleanJson cleanly.
      },
    });

    const responseText = response.text || '';
    const parsedData = extractCleanJson(responseText);

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/agent/search:', error);
    return res.status(500).json({
      error: error.message || 'Failed to execute job search agent.',
    });
  }
});

// 3. Cover Note Refiner / Tone Adjustment Endpoint
app.post('/api/agent/refine-note', async (req, res) => {
  try {
    const { jobTitle, company, candidateName, originalNote, tone } = req.body;

    const ai = getGeminiClient();
    const prompt = `
Rewrite this candidate cover note for the position of "${jobTitle}" at "${company}".
Candidate Name: ${candidateName || 'Applicant'}
Desired Tone: ${tone || 'Persuasive & Enthusiastic'} (options: 'Concise & Direct', 'Startup & Founder-Friendly', 'Polished & Corporate', 'Warm & Passionate')

Original Note:
"${originalNote}"

Guidelines:
- Keep length between 120-160 words.
- Highlight candidate value proposition clearly.
- Include a clear call to action for an interview or quick chat.
- Return ONLY the rewritten cover note text, no explanations.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ refinedNote: response.text?.trim() || originalNote });
  } catch (error: any) {
    console.error('Error in /api/agent/refine-note:', error);
    return res.status(500).json({ error: error.message || 'Failed to refine note.' });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jobby server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
