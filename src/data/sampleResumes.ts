export interface SampleResume {
  id: string;
  label: string;
  domain: 'Tech' | 'Product' | 'Design';
  targetRole: string;
  candidateName: string;
  headline: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'swe-intern',
    label: 'Tech: Software Engineer Intern',
    domain: 'Tech',
    targetRole: 'Software Engineer Intern',
    candidateName: 'Alex Rivera',
    headline: 'Junior CS Major at UC Berkeley · Full-Stack & Systems',
    text: `ALEX RIVERA
Berkeley, CA • alex.rivera@berkeley.edu • github.com/arivera-code • linkedin.com/in/alexrivera-swe

EDUCATION
University of California, Berkeley — Expected Graduation: May 2026
B.S. in Computer Science, Minor in Data Science (GPA: 3.84/4.0)
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems, Computer Networks, Machine Learning.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, C++, SQL, HTML/CSS
Frameworks & Libraries: React, Next.js, Node.js, Express, FastAPI, Tailwind CSS, PyTorch
Tools & Infrastructure: Git, Docker, PostgreSQL, Redis, AWS (S3, Lambda), Linux, REST APIs, GraphQL

EXPERIENCE & PROJECTS
Software Engineering Fellow — Open Source Tech Collective (Summer 2025)
• Architected a high-throughput webhook dispatch pipeline in Go & Redis handling 15,000+ events/min with 99.98% delivery reliability.
• Built interactive analytics dashboards using React 19, TypeScript, and Tailwind CSS, reducing team diagnostic latency by 45%.
• Integrated automated CI/CD GitHub Actions test suites improving code coverage from 68% to 92%.

Full-Stack Lead — CalHacks Award Winner: DevPulse (Fall 2025)
• Developed a real-time developer metrics aggregator using Next.js, Node.js, and PostgreSQL for 1,200+ hackathon participants.
• Implemented WebSocket live sync and indexed database queries, achieving sub-40ms response times on concurrent queries.
• Deployed microservices using Docker containers on AWS ECS with auto-scaling triggers.

Open-Source Contributor — VectorDB Client Library
• Contributed TypeScript type definitions and connection retry pooling mechanisms adopted by 800+ weekly NPM downloaders.
• Resolved race condition in chunked payload streaming buffer, decreasing memory footprint by 24%.

LEADERSHIP & AWARDS
• Director of Technology, Upsilon Pi Epsilon (Berkeley CS Honor Society)
• 1st Place, CalHacks 11.0 (Track: Cloud & Developer Tooling)
`,
  },
  {
    id: 'apm-candidate',
    label: 'Product: Associate Product Manager',
    domain: 'Product',
    targetRole: 'Associate Product Manager Intern',
    candidateName: 'Maya Chen',
    headline: 'Product Strategy & Analytics · Former Product Analyst Intern',
    text: `MAYA CHEN
New York, NY • maya.chen@columbia.edu • linkedin.com/in/mayachen-pm • (555) 349-8120

EDUCATION
Columbia University — B.A. in Information Science & Economics (May 2025)
Honors: Dean's List, Tech & Society Scholar (GPA: 3.88/4.0)
Coursework: Product Management, User-Centered Design, Applied Econometrics, Database Systems, Agile Methodologies.

PRODUCT & STRATEGY SKILLS
Product Competencies: PRD Drafting, Roadmap Planning, User Journey Mapping, A/B Testing, User Interviews, Backlog Grooming, Competitive Analysis
Analytics & Tools: SQL (BigQuery/PostgreSQL), Amplitude, Mixpanel, Jira, Linear, Figma, Google Analytics, Excel/Google Sheets Modeling

EXPERIENCE
Product Analyst Intern — FinTech Growth Lab (Summer 2025)
• Conducted 35+ customer discovery interviews and analyzed 120,000 onboarding drop-off funnels in Amplitude, identifying a friction point in KYC identity verification.
• Authored comprehensive PRD for streamlined 2-step verification, collaborating with 4 engineers and 2 UX designers.
• Designed and evaluated randomized A/B test rollout across 40,000 active users, resulting in a 14.8% increase in onboarding conversion and +$180k annualized volume.
• Championed weekly agile sprint ceremonies, backlog prioritization, and cross-functional bug triages using Linear.

Product Research Lead — Columbia Venture Incubator (Fall 2024 - Spring 2025)
• Partnered with 3 student-led B2B SaaS startups to define ICP (Ideal Customer Profile) and initial product-market fit metrics.
• Formulated Go-To-Market strategy, pricing tiers, and metric dashboards tracking weekly active teams (WAU) and retention cohorts.

Product Lead — Campus Eats Community App (Academic Project)
• Led end-to-end product lifecycle for a campus surplus meal redistribution platform serving 4,500 active student users.
• Spearheaded roadmap prioritization matrix (RICE framework) balancing feature requests against technical complexity.
`,
  },
  {
    id: 'design-lead',
    label: 'Design: Product & UX/UI Designer',
    domain: 'Design',
    targetRole: 'Product Designer Intern / Junior UX Designer',
    candidateName: 'Jordan Vance',
    headline: 'Product Designer · Design Systems, Accessibility & Interaction',
    text: `JORDAN VANCE
Seattle, WA • jordan@vancedesign.co • portfolio: jordanvance.design • linkedin.com/in/jordanvance-design

EDUCATION
University of Washington, Seattle — B.S. in Human Centered Design & Engineering (HCDE)
Expected Graduation: June 2026 • Magna Cum Laude

CORE COMPETENCIES
Design: UI/UX Design, Design Systems, Wireframing, Rapid Prototyping, Accessibility (WCAG 2.1 AA/AAA), Information Architecture, Micro-interactions
Tools: Figma, FigJam, Principle, Framer, Adobe Creative Cloud, Miro, Notion
Technical: HTML5, CSS3, Tailwind CSS, Basic React & Component Architecture, Git workflows

EXPERIENCE
UX/UI Design Intern — CloudScale Software (Summer 2025)
• Spearheaded redesign of the enterprise RBAC permissions module, cutting task completion time for sysadmins by 38%.
• Contributed 45+ accessible tokens, typography scales, and responsive components to the company's Core Design System in Figma.
• Conducted 18 moderated usability sessions and tree-testing studies, translating qualitative insights into high-fidelity prototype iterations.
• Partnered closely with front-end React engineers via Zeplin and Figma inspect mode to ensure pixel-perfect token implementation.

Lead Product Designer — Husky Health Mobile App (Campus Initiative)
• Designed end-to-end iOS & Android student mental wellness check-in flow adopted by 3,800+ university students.
• Built WCAG AA-compliant high-contrast color palette, scalable typography, and micro-haptic feedback cues in Figma and Framer.
• Nominated for Best UX in UW Design Showcase 2025.

Freelance Interaction Designer (2024 - Present)
• Delivered responsive brand identities, design systems, and web apps for 4 early-stage seed startups.
• Authored comprehensive component documentation and Figma interactive auto-layout component libraries.
`,
  },
];
