import React, { useMemo, useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Code2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Home,
  Instagram,
  LineChart,
  Linkedin,
  Mail,
  Medal,
  MessageCircle,
  NotebookText,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Activity,
  CheckCircle2,
  X,
  ChevronDown,
  Layers,
  Clock,
  Brain,
  Terminal,
  Server,
  Globe,
} from 'lucide-react'

import headshot from './assets/founder-headshot.webp'
import higginsDigitalLogo from './assets/higgins-digital-logo.png'
import kewauneeLogo from './assets/kewaunee-logo.png'
import kewauneeScientificLogo from './assets/experience-kewaunee-logo.png'
import oneChaptrLogo from './assets/experience-one-chaptr-logo.webp'
import pdtLogo from './assets/experience-pdt-logo.png'
import hbgLogo from './assets/experience-hbg-logo-white.png'
import tusLogo from './assets/experience-tus-logo.png'
import lakesideLogo from './assets/experience-lakeside-logo.png'
import dhLogo from './assets/dhtrans.png'
import projectCadeLogo from './assets/project-cade.png'
import projectContenderLogo from './assets/project-contender.png'
import projectFlowcastLogo from './assets/project-flowcast.png'
import projectDhlmLogo from './assets/project-dhlm.png'
import projectHigginsDigitalLogo from './assets/project-higgins-digital.png'
import projectProspectIqLogo from './assets/project-prospectiq.png'
import projectDhLogo from './assets/project-dh.png'
import projectCuratedNotesLogo from './assets/curated-notes-logo.png'
import projectCrownCodeLogo from './assets/crowncode-logo.png'
import anthropologyAward from './assets/anthropologycert.png'
import thecreek from './assets/thecreek.png'
import unccLogo from './assets/uncclogotrans.png'
import cvccLogo from './assets/cvcctrans2!.png'

const NAV_ITEMS = [
  { label: 'Home', key: 'home', icon: Home },
  { label: 'Experience', key: 'experience', icon: Briefcase },
  { label: 'Projects', key: 'projects', icon: Code2 },
  { label: 'Education', key: 'education', icon: GraduationCap },
  { label: 'Skills', key: 'skills', icon: Layers },
  { label: 'Impact', key: 'skills-proof', icon: ShieldCheck },
  { label: 'Resume', key: 'resume', icon: NotebookText },
  { label: 'Contact', key: 'contact', icon: Mail },
]

// Sections that show the decorative accent glow behind their content.
const ACCENT_PAGES = new Set(['education', 'skills', 'skills-proof', 'resume', 'contact'])

const STATS = [
  { value: '3.9', label: 'UNCC GPA' },
  { value: '20+', label: 'Executive Dashboards' },
  { value: '10+', label: 'Production Products Shipped' },
  { value: '1+ yr', label: 'Professional Analytics Experience' },
]

const LIVE_STATUS = [
  { name: 'Contender', url: 'https://contender.davishiggins.com', status: 'online' },
  { name: 'Higgins Digital', url: 'https://higginsd.com/', status: 'online' },
  { name: 'Phi Delt Chaplain', url: 'https://phideltchaplain.vercel.app/', status: 'online' },
]

const NOW_LEARNING = {
  learning: 'Advanced SQL Queries & Maximizing AI Output',
  reading: 'Designing Data-Intensive Applications',
  course: 'UNCC ITCS 3162 / Intro to Data Mining',
}

const SKILLS_MATRIX = {
  Languages: {
    icon: Terminal,
    items: ['Python', 'SQL', 'R', 'Java'],
  },
  'Analytics & BI': {
    icon: LineChart,
    items: ['Zoho Analytics', 'Power BI', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  'ML & Stats': {
    icon: Brain,
    items: ['scikit-learn', 'Random Forest', 'Ridge Regression', 'Chi-Square', 'Logistic Regression', 'ANOVA'],
  },
  Infrastructure: {
    icon: Server,
    items: ['Streamlit', 'Supabase', 'Postgres', 'Railway', 'GitHub'],
  },
}

const SKILLS_PROFICIENCY = [
  {
    name: 'Python',
    level: 90,
    years: 3,
    description: 'Primary language for data analysis, ML, and full-stack apps.',
    libraries: ['Pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'Streamlit', 'nba_api'],
    projects: ['Contender', 'Flowcast', 'NYPD Crime Data Analysis', 'Census Data Analysis'],
    projectCount: 4,
  },
  {
    name: 'SQL',
    level: 85,
    years: 2,
    description: 'Production database work at Kewaunee and Contender.',
    libraries: ['PostgreSQL', 'Supabase', 'CRM queries', 'Joins', 'Window functions', 'Aggregations'],
    projects: ['Kewaunee CRM Audit', 'Contender data store and saved history', 'Database coursework'],
    projectCount: 3,
  },
  {
    name: 'Zoho Analytics',
    level: 88,
    years: 1.5,
    description: 'Built 20+ executive dashboards and 100+ visualizations.',
    libraries: ['Dashboards', 'KPI tracking', 'Data dictionary builds', 'Stakeholder workflows'],
    projects: ['Kewaunee Scientific dashboards', 'Sales reporting automation'],
    projectCount: 2,
  },
  {
    name: 'Machine Learning',
    level: 78,
    years: 3,
    description: 'Applied ML for prediction, classification, and prop probability modeling.',
    libraries: ['Random Forest Regressor', 'Ridge Regression', 'Logistic Regression', 'Feature engineering', 'Backtesting'],
    projects: ['Contender projection engine', 'Flowcast XGBoost demand forecasting', 'NYPD Crime predictive modeling'],
    projectCount: 3,
  },
  {
    name: 'Statistics',
    level: 82,
    years: 4,
    description: 'Hypothesis testing, regression, and exploratory analysis.',
    libraries: ['Chi-Square', 'ANOVA', 'Correlation', 'Regression', 'EDA', 'Distributions'],
    projects: ['Census Data Analysis', 'NYPD Crime Data Analysis', 'UNCC coursework'],
    projectCount: 3,
  },
  {
    name: 'R',
    level: 70,
    years: 2,
    description: 'Statistical analysis and academic coursework.',
    libraries: ['dplyr', 'ggplot2', 'Statistical testing'],
    projects: ['UNCC statistics courses', 'Independent analysis work'],
    projectCount: 2,
  },
  {
    name: 'Power BI',
    level: 75,
    years: 1,
    description: 'Dashboard prototyping and BI reporting.',
    libraries: ['DAX', 'Data modeling', 'Visualization'],
    projects: ['Coursework dashboards', 'Internal reporting'],
    projectCount: 2,
  },
  {
    name: 'Java',
    level: 65,
    years: 3,
    description: 'Object-oriented programming and algorithms.',
    libraries: ['OOP', 'Data structures', 'Algorithm design'],
    projects: ['UNCC CS coursework'],
    projectCount: 1,
  },
  {
    name: 'Web Development',
    level: 78,
    years: 1,
    description: 'Founded Higgins Digital. Built this portfolio and client sites.',
    libraries: ['React', 'Tailwind', 'Framer Motion', 'Responsive design'],
    projects: ['Higgins Digital', 'This portfolio', 'Phi Delt Chaplain platform'],
    projectCount: 3,
  },
  {
    name: 'Git & GitHub',
    level: 80,
    years: 2,
    description: 'Version control and collaborative workflows across every project.',
    libraries: ['Branching', 'Commits', 'Pull requests', 'Merge conflicts', 'Repo management', 'Releases'],
    projects: ['Contender', 'Higgins Digital', 'NYPD Crime Analysis', 'Personal portfolio'],
    projectCount: 4,
  },
  {
    name: 'APIs',
    level: 75,
    years: 2,
    description: 'Consuming and integrating external APIs across data, ML, and product layers.',
    libraries: ['REST', 'JSON', 'Auth flows', 'Rate limiting', 'nba_api', 'GitHub API', 'Supabase client'],
    projects: ['Contender (nba_api)', 'Portfolio GitHub Activity widget', 'Higgins Digital integrations'],
    projectCount: 3,
  },
  {
    name: 'Generative AI',
    level: 85,
    years: 4,
    description: 'Daily power user, integrating AI into product workflows.',
    libraries: ['Prompt engineering', 'Workflow automation', 'AI-assisted dev'],
    projects: ['DHLM personal knowledge system', 'Portfolio chat widget', 'Daily development'],
    projectCount: 3,
  },
]

const PORTFOLIO_KB = {
  identity:
    "Davis Higgins is a Data Science major with an Artificial Intelligence minor at UNC Charlotte (B.S., expected May 2027). He has a 3.9 GPA, has made the Chancellor's List twice and Dean's List once, and earned a 4.0 at Catawba Valley Community College through dual enrollment (4x President's List). He's based in Charlotte, NC.",
  currentRole:
    "Davis is currently a Data Analyst Intern at Kewaunee Scientific Corp. (June 2025 to present). He engineers and maintains 20+ executive dashboards and 100+ visualizations in Zoho Analytics, audits 2,000+ project and quote records in CRM systems, and built a centralized data dictionary covering 30+ datasets. He works directly with executives to translate business questions into reporting tools.",
  contender:
    "Contender is Davis's full-stack NBA player-prop and parlay analysis platform, live at contender.davishiggins.com. He rebuilt his original Streamlit prototype into a production product: a FastAPI backend with a versioned API, a Next.js and TypeScript frontend, Supabase Postgres, Clerk authentication, and Stripe subscriptions. The engine blends a rules-based projection with a Random Forest model (Ridge regression fallback) over data ingested from stats.nba.com, covers 23 prop markets, analyzes single props and 2, 3, and 4-leg parlays, and auto-settles saved picks against final box scores. Parity tests against recorded NBA data verified the port, and every probability is labeled by calibration status rather than presented as calibrated.",
  flowcast:
    "Flowcast is Davis's end-to-end AWS machine learning platform, live at flowcastweb.vercel.app. It forecasts hourly taxi pickup demand for all 262 NYC taxi zones 1, 6, and 24 hours ahead. He built an S3 data lake of 116M+ NYC TLC trips plus NOAA hourly weather, leakage-safe time-series features, and a SageMaker Pipeline that trains one global XGBoost model and only registers it if it passes a quality gate. On five held-out months it cut WAPE by 24.8% versus a 168-hour seasonal baseline (0.186 vs. 0.247, R² 0.958). A serverless endpoint behind Lambda and API Gateway scores the whole city in one request, shown on a Next.js and MapLibre forecast map with SHAP drivers and calibrated intervals.",
  dhlm:
    "DHLM is Davis's private, Gemini-powered personal AI knowledge system, live at dhlm.davishiggins.com. It answers from a living Markdown knowledge base plus live Gmail, Calendar, and Drive data, with cited sources. A deterministic router decides which sources each question needs before any model call, memory updates are proposed and only written after he approves them, and any Gmail draft or Calendar event requires a single-use, five-minute confirmation. It also includes a Career workspace for job discovery, fit scoring, resume tailoring, and application tracking. Built with Next.js, TypeScript, the Gemini API, Google Workspace APIs, and Supabase.",
  higginsDigital:
    "Higgins Digital is Davis's freelance software and web development company, founded January 2026. He builds fast, responsive, production-ready websites for real business clients, with a focus on performance optimization, brand systems, and clean UX. Site: higginsd.com.",
  hateCrime:
    "The NYPD Crime Data Analysis project used Python and SQL to analyze NYPD hate crime datasets across pre-COVID, during-COVID, and post-COVID periods. Davis cleaned the data, built visualizations of bias patterns over time, and applied Chi-Square testing and logistic regression to extend the analysis into predictive insight. GitHub: github.com/DavisHiggins/HateCrimeDataAnalysis.",
  census:
    "The Census Data Analysis project analyzed U.S. Census data to identify which demographic and socioeconomic factors most strongly influence salary outcomes. Education emerged as the strongest predictor. Davis used correlation analysis, ANOVA, and Chi-Square techniques alongside Python visualizations.",
  python:
    "Python is Davis's primary language. He uses it daily for data analysis (Pandas, NumPy), visualization (Matplotlib), machine learning (scikit-learn including Random Forest and Ridge Regression), and full-stack apps (Streamlit). Contender's backend, Flowcast's forecasting pipeline, the NYPD Crime analysis, and the Census analysis are all built in Python. He has roughly 3 years of Python experience.",
  sql: "Davis has hands-on SQL experience from his Kewaunee Scientific internship (auditing 2,000+ CRM project and quote records, supporting reporting workflows) and from academic database coursework (full marks on his database midterm covering HR, CO, OE, and AD schemas). Contender stores ingested NBA data, saved analyses, and subscription records in Supabase Postgres. He's currently learning advanced SQL queries.",
  r: "Davis has used R for statistical analysis and academic coursework alongside Python and SQL. His Census Data Analysis project applied correlation, ANOVA, and Chi-Square testing, and he uses R for statistical modeling in his UNCC courses.",
  java: "Davis has Java experience from his UNCC computer science coursework, focused on object-oriented programming, data structures, and algorithm design.",
  ml: "Davis has built ML systems for real production use. Contender blends a rules-based projection with a Random Forest Regressor and a Ridge regression fallback. Flowcast trains a global XGBoost model in an AWS SageMaker Pipeline that forecasts demand for all 262 NYC taxi zones and beats a seasonal baseline by 24.8% on held-out data. He has also applied logistic regression and Chi-Square testing in his NYPD Crime Data Analysis, and correlation and ANOVA in the Census project. He is minoring in AI at UNC Charlotte.",
  ai: "Davis is minoring in Artificial Intelligence at UNC Charlotte and uses AI daily for development, problem solving, and product building. His current learning focus includes maximizing AI output. DHLM, his Gemini-powered personal knowledge system, reflects his applied AI work, and he integrated AI directly into this portfolio (the chat widget you're using right now).",
  dashboards:
    "At Kewaunee Scientific, Davis has built 20+ executive dashboards and 100+ visualizations in Zoho Analytics. His broader BI toolkit includes Zoho Analytics, Power BI, and Matplotlib. He meets directly with executives to translate business requests into dashboards and reporting automations, including a complex project-expiration tracker the platform initially couldn't support.",
  education:
    "Davis is pursuing a B.S. in Data Science with a minor in Artificial Intelligence at UNC Charlotte (August 2024 to May 2027). He has a 3.9 GPA, made the Chancellor's List twice and the Dean's List once. Before transferring, he attended Catawba Valley Community College (August 2022 to May 2024) on a dual-enrollment program, earning a 4.0 GPA and making the President's List four times.",
  leadership:
    "Davis serves as both Vice President of Philanthropy (since January 2026) and Chaplain (since April 2026) for Phi Delta Theta at UNCC. As VP of Philanthropy, he has led fundraising generating $3,000+ for the Live Like Lou Foundation. As Chaplain, he leads weekly Bible studies and runs a semester-long scripture and engagement plan for the chapter. He also won the Public Anthropology Award for Excellence in Writing on Public Issues in April 2025.",
  apparel:
    "From January 2023 to May 2024, Davis co-founded and operated a mobile custom apparel business at AAU basketball tournaments across the Carolinas. He handled inventory, transactions, on-demand production, and fulfillment for 100+ orders per event, adjusting product mix and pricing in real time. When his business partner was sick one weekend, Davis ran the table solo and generated $1,500+ in two days.",
  warehouse:
    "From December 2022 to May 2024, Davis worked as a Warehouse Specialist at Touch-Up Solutions, handling high-volume inventory, order fulfillment, and on-time shipment processing.",
  construction:
    "In summer 2024, Davis worked as Assistant to the Project Manager at Higgins Building Group, coordinating project documentation, timelines, materials, and logistics for construction operations.",
  contact:
    "Davis can be reached at davishiggins@icloud.com, on LinkedIn at linkedin.com/in/davishiggins, or by phone at (828) 578-0262. He typically responds within 24 hours. He is currently interviewing for Summer 2026 internships in data analytics, data science, and product analytics.",
  interests:
    "Outside of work and school, Davis is into weightlifting, soccer, basketball, football (he was a 1x All-State, 3x All-Conference athlete in high school), faith, philanthropy through the Live Like Lou Foundation and Habitat for Humanity, and building products that use data well.",
  goals:
    "Davis is actively interviewing for Summer 2026 internships in data analytics, data science, and product analytics. He is also continuing to expand Contender, grow Higgins Digital, and develop technically through coursework and self-directed learning (currently focused on advanced SQL queries and maximizing AI output).",
  tools:
    "Davis works across Python, SQL, R, Java, Zoho Analytics, Power BI, Streamlit, Supabase, Postgres, Railway, GitHub, and the standard Python data stack (Pandas, NumPy, Matplotlib, scikit-learn). He is most proficient in Python, SQL, dashboard development in Zoho Analytics, and statistical analysis.",
  whyDavis:
    "Davis combines real internship experience (Kewaunee Scientific), shipped products (Contender, Flowcast, DHLM, Higgins Digital), academic rigor (3.9 GPA at UNCC, 4.0 at CVCC), and demonstrated leadership (Phi Delt VP of Philanthropy and Chaplain). He thinks like a builder, not just an analyst. He ships products, not just notebooks. The Public Anthropology Award also shows he can communicate technical and complex ideas clearly in writing.",
  caseStudy:
    "Davis built a detailed Contender case study covering the problem, approach, architecture, key engineering decisions, tradeoffs, and results. It's the best place to see how he thinks about end-to-end product and analytics work. You can find it under Contender on the Projects page of this portfolio.",
}

const KB_ROUTES = [
  { kws: ['who is davis', 'about davis', 'tell me about davis', 'introduce', 'background', 'who are you'], key: 'identity' },
  { kws: ['kewaunee', 'current job', 'current role', 'current work', 'where does davis work', 'working now', 'employed'], key: 'currentRole' },
  { kws: ['internship', 'intern'], key: 'currentRole' },
  { kws: ['contender', 'nba', 'prop analytics', 'sports betting', 'sports analytics', 'prizepicks', 'sportsbook', 'parlay'], key: 'contender' },
  { kws: ['flowcast', 'forecast', 'taxi', 'sagemaker', 'aws', 'xgboost', 'demand'], key: 'flowcast' },
  { kws: ['dhlm', 'gemini', 'knowledge system', 'personal ai', 'second brain'], key: 'dhlm' },
  { kws: ['higgins digital', 'freelance', 'web develop', 'website busin', 'web agency'], key: 'higginsDigital' },
  { kws: ['hate crime', 'nypd', 'covid analysis'], key: 'hateCrime' },
  { kws: ['census', 'salary', 'demographics', 'socioeconomic'], key: 'census' },
  { kws: ['python', 'pandas', 'numpy'], key: 'python' },
  { kws: ['sql', 'database', 'postgres', 'supabase', 'query'], key: 'sql' },
  { kws: ['r ', 'r,', 'r.', 'r program', 'rstudio'], key: 'r' },
  { kws: ['java '], key: 'java' },
  { kws: ['ml ', 'machine learning', 'model', 'random forest', 'scikit', 'sklearn', 'regression', 'classification', 'predict'], key: 'ml' },
  { kws: ['ai', 'artificial intelligence', 'genai', 'generative', 'llm', 'chatgpt', 'claude'], key: 'ai' },
  { kws: ['dashboard', 'visualization', 'power bi', 'zoho', 'reporting', 'kpi', 'bi '], key: 'dashboards' },
  { kws: ['education', 'school', 'college', 'uncc', 'unc charlotte', 'gpa', 'university', 'degree', 'major', 'minor', 'graduate', 'graduation', 'cvcc', 'catawba'], key: 'education' },
  { kws: ['leadership', 'fraternity', 'phi delt', 'philanthropy', 'chaplain', 'vp', 'live like lou', 'award', 'anthropology', 'writing award'], key: 'leadership' },
  { kws: ['apparel', 'tshirt', 't-shirt', 'aau', 'tournament', 'rock hill', 'mobile business', 'shirts'], key: 'apparel' },
  { kws: ['warehouse', 'touch-up', 'touch up'], key: 'warehouse' },
  { kws: ['construction', 'higgins building'], key: 'construction' },
  { kws: ['contact', 'email', 'reach', 'hire', 'linkedin', 'phone', 'message', 'connect', 'get in touch', 'recruit'], key: 'contact' },
  { kws: ['interest', 'hobby', 'hobbies', 'outside', 'personal', 'sport', 'weightlift', 'gym', 'faith', 'religion', 'jesus', 'church', 'basketball', 'soccer', 'football'], key: 'interests' },
  { kws: ['goal', 'future', 'plan', 'looking for', 'next', 'summer 2026', 'looking to', 'seeking', 'want to'], key: 'goals' },
  { kws: ['tool', 'tech stack', 'technologies', 'languages', 'skills', 'what does davis know', 'capable', 'proficient'], key: 'tools' },
  { kws: ['why davis', 'why hire', 'what makes davis', 'strength', 'unique', 'stand out', 'differentiat'], key: 'whyDavis' },
  { kws: ['case study', 'deep dive', 'long form', 'detailed write'], key: 'caseStudy' },
  { kws: ['experience', 'work history', 'jobs', 'resume', 'career'], key: 'currentRole' },
  { kws: ['project'], key: 'contender' },
]

function answerQuestion(question) {
  const q = question.toLowerCase().trim()
  if (!q) return PORTFOLIO_KB.identity

  const scores = KB_ROUTES.map((route) => {
    const matches = route.kws.filter((k) => q.includes(k)).length
    return { key: route.key, score: matches }
  }).filter((r) => r.score > 0)

  if (scores.length === 0) {
    // Best-guess pass: scan question for any signal word that loosely maps to a topic
    const guessSignals = [
      { words: ['how', 'long', 'when', 'time', 'old', 'age', 'year'], key: 'identity', label: "I'm guessing you wanted to know something about Davis's background or timeline" },
      { words: ['build', 'built', 'create', 'made', 'developed', 'shipped'], key: 'contender', label: "Sounds like you're asking what Davis has built" },
      { words: ['work', 'company', 'role', 'position', 'office'], key: 'currentRole', label: "Sounds like you're asking about his work" },
      { words: ['good', 'best', 'strong', 'great', 'top'], key: 'whyDavis', label: "Sounds like you're asking what makes him stand out" },
      { words: ['code', 'program', 'developer', 'engineer'], key: 'tools', label: "Sounds like you're asking about his technical side" },
      { words: ['where', 'live', 'location', 'from'], key: 'identity', label: "I'm guessing you're asking where Davis is based" },
      { words: ['data', 'analyst', 'analysis', 'analytics'], key: 'currentRole', label: "Sounds like you're asking about his analytics work" },
      { words: ['build with', 'use', 'using', 'stack'], key: 'tools', label: "Sounds like you're asking what he works with" },
    ]
    for (const sig of guessSignals) {
      if (sig.words.some((w) => q.includes(w))) {
        return `${sig.label}, so here's my best guess at what you meant:\n\n${PORTFOLIO_KB[sig.key]}\n\nIf that wasn't what you were after, try rephrasing or asking about something specific.`
      }
    }
    return "I cannot answer that exact question at the moment. Ask about his experience, projects (Contender, Flowcast, DHLM, Higgins Digital), tech stack (Python, SQL, R, ML), education at UNC Charlotte, leadership roles, what he's looking for next, or how to reach him."
  }

  scores.sort((a, b) => b.score - a.score)

  if (scores.length === 1 || scores[0].score > scores[1].score) {
    return PORTFOLIO_KB[scores[0].key]
  }

  const uniqueKeys = [...new Set(scores.slice(0, 2).map((s) => s.key))]
  return uniqueKeys.map((k) => PORTFOLIO_KB[k]).join('\n\n')
}

const PROJECTS = [
  {
    tag: 'Agentic AI System',
    title: 'Cade',
    subtitle: 'Claude-powered personal agentic operating system with persistent, structured memory across my projects, priorities, and recurring work.',
    description:
      'Built a personal agentic operating system that connects Claude Code to a structured Obsidian memory vault, retrieves the context each task requires, and preserves useful outcomes across sessions. Cade turns disconnected conversations into a continuous working system that becomes more useful as decisions, corrections, and project knowledge accumulate.',
    bullets: [
      'Designed a five-stage operating loop, Orient, Retrieve, Prime, Execute, and Persist, that gives every session a consistent process for locating context, completing work, and preserving valuable outcomes.',
      'Built a layered memory architecture using a concise boot configuration, a central vault index, contextual project folders, active priorities, daily notes, reusable Jobs, and interconnected Markdown references.',
      'Created reusable Jobs that define the procedure, quality standard, linked knowledge, and durable lessons for recurring work across analytics, software development, business operations, education, content, and career preparation.',
      'Developed an interactive public case-study website with Next.js, TypeScript, GSAP, and Three.js that explains the system’s architecture while protecting private vault content and sensitive project information.',
    ],
    stack: ['Claude Code', 'Obsidian', 'Next.js', 'TypeScript', 'GSAP', 'Three.js', 'Markdown', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://cade.davishiggins.com' },
    secondary: { label: 'GitHub Repository', href: 'https://github.com/DavisHiggins/cade' },
    accent: 'from-violet-500/20 via-indigo-500/10 to-white/5',
    logo: projectCadeLogo,
  },
  {
    tag: 'Product Platform',
    title: 'Contender',
    subtitle: 'Full-stack NBA player-prop and parlay analysis platform that shows the evidence behind every estimate.',
    description:
      'Rebuilt my original Streamlit prototype into Contender, a production sports-analytics product with a FastAPI backend, a versioned API, and a Next.js frontend. Contender analyzes single props and 2, 3, and 4-leg parlays by blending a rules engine with a Random Forest projection model (Ridge fallback), and keeps projections, historical hit rates, matchup context, and probability estimates visibly separate so a polished number never outruns its source.',
    bullets: [
      'Ported the legacy prediction engine into a typed FastAPI service and verified it with parity tests against recorded NBA data: 68 metrics preserved exactly and 18 corrected with documented before-and-after examples.',
      'Built an ingestion pipeline from stats.nba.com into a normalized Supabase Postgres store, covering 23 prop markets with over and under sides; the three-season backfill completed 433 jobs with zero failures.',
      'Shipped 2, 3, and 4-leg parlay analysis that states its independence assumption beside dependence bounds and linked-leg flags, plus saved history stored as immutable snapshots and auto-settled against final box scores by a background worker.',
      'Productionized the platform with Clerk authentication, Stripe subscriptions backed by a durable webhook ledger and reconciliation, quota-enforced Free, Pro, and Sharp plans, and 580+ automated backend tests.',
      'Built MLB and NFL modules on a shared multi-sport foundation, shipped dark behind feature flags with a staged rollout plan and walk-forward rules for admitting trained models.',
    ],
    stack: ['Python', 'FastAPI', 'scikit-learn', 'nba_api', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Postgres', 'Clerk', 'Stripe', 'Render', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://contender.davishiggins.com' },
    accent: 'from-lime-400/20 via-lime-500/10 to-white/5',
    logo: projectContenderLogo,
  },
  {
    tag: 'Machine Learning Platform',
    title: 'Flowcast',
    subtitle: 'End-to-end AWS forecasting platform that predicts hourly taxi demand for every NYC taxi zone 1, 6, and 24 hours ahead.',
    description:
      'Built Flowcast to answer one question for any forecast hour: how many pickups should each NYC taxi zone expect, how uncertain is that, and what is driving it. The platform ingests 116M+ NYC TLC trips and NOAA hourly weather into an S3 data lake, trains one global XGBoost model in a SageMaker Pipeline behind a baseline quality gate, and serves citywide forecasts through a serverless endpoint and an interactive geospatial web app.',
    bullets: [
      'Forecasts all 262 five-borough NYC taxi zones at 1, 6, and 24-hour horizons from 31 months of trip records (January 2024 through July 2026) joined with NOAA hourly weather.',
      'Cut held-out WAPE by 24.8% versus a 168-hour seasonal-naive baseline (0.186 vs. 0.247, R² 0.958) across 2.9M test predictions spanning five months, beating the baseline in every borough and at every horizon.',
      'Engineered leakage-safe time-series features with shifted lags and rolling windows, train-only encodings, and prediction intervals calibrated on validation only (83% test coverage for the 80% band, 96% for the 95% band).',
      'Automated the ML lifecycle in a SageMaker Pipeline (preprocessing, training, evaluation with SHAP and drift checks, quality gate, Model Registry) and served it through a serverless endpoint, Lambda, and API Gateway that scores all 262 zones in one batched request.',
      'Shipped a Next.js and TypeScript product with a citywide MapLibre forecast map, per-zone SHAP drivers, a model-performance dashboard, and a public model card, covered by pytest, Vitest, and Playwright tests.',
    ],
    stack: ['Python', 'XGBoost', 'Pandas', 'SHAP', 'AWS SageMaker', 'S3', 'Lambda', 'API Gateway', 'Next.js', 'TypeScript', 'MapLibre', 'Recharts', 'GSAP', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://flowcastweb.vercel.app' },
    accent: 'from-cyan-500/20 via-blue-600/10 to-white/5',
    logo: projectFlowcastLogo,
  },
  {
    tag: 'Personal AI System',
    title: 'DHLM',
    subtitle: 'Private, Gemini-powered personal knowledge system that connects my notes, projects, and live Google data into one cited command center.',
    description:
      'Built DHLM as a single-user intelligence system grounded in a living Markdown knowledge base and live Gmail, Calendar, and Drive data. A deterministic router decides which sources each question needs before any model call, answers stream with knowledge and live-data citations side by side, and nothing becomes permanent memory until I approve it.',
    bullets: [
      'Designed a rule-based router that answers generic questions directly, retrieves personal context for project questions, and fetches live Google data in parallel only when needed, using a fast default model and a deeper model only on request and within a daily budget.',
      'Built ranked retrieval over the knowledge base with an explicit precedence order (current priorities, recent changes, active projects, profile) and optional Gemini File Search, synced incrementally by content hash.',
      'Implemented a human-approved memory workflow: DHLM proposes updates with evidence and confidence, then validates, versions, audits, and re-syncs only the changed files once approved.',
      'Secured the app with single-account Google sign-in using PKCE, read-only scopes by default, an AES-256-GCM encrypted refresh-token cookie, and single-use, five-minute confirmations for any Gmail draft or Calendar event.',
      'Added a Career workspace with job discovery from Greenhouse and Lever, deterministic fit scoring, truthful resume tailoring, an application CRM, and rule-based classification of recruiter and interview email.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Gemini API', 'Gmail API', 'Google Calendar API', 'Google Drive API', 'Supabase', 'Zod', 'Tailwind CSS', 'Vitest', 'Playwright', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://dhlm.davishiggins.com' },
    accent: 'from-sky-400/20 via-blue-500/10 to-white/5',
    logo: projectDhlmLogo,
  },
  {
    tag: 'E-Commerce Platform & Brand System',
    title: 'Lakeside Sport Club',
    subtitle: 'Premium lifestyle apparel brand and direct-to-consumer commerce platform centered on sport, leisure, and life by the water.',
    description:
      'Founded Lakeside Sport Club in 2026 and developed it from an original concept into a full brand system and e-commerce platform. Built the broader brand — not only the storefront — spanning brand strategy, creative direction, visual identity, product concepts, collection architecture, merchandising, campaign presentation, website development, commerce operations, customer experience, and launch planning to remain distinctive and consistent across every customer touchpoint.',
    bullets: [
      'Created a complete brand identity in forest green, gold, and cream with original positioning, voice, visual direction, and a proprietary tagline that anchors every touchpoint.',
      'Architected seven coordinated collections with distinct product and design directions, each merchandised against production feasibility, vendor capabilities, pricing, and brand consistency.',
      'Developed a responsive Next.js and TypeScript storefront for men’s and women’s apparel with collection, category, and individual product experiences, variants, color selections, quick-view interactions, pricing, and detailed product presentation.',
      'Shipped a pre-order model with clear production and fulfillment communication, secure Stripe checkout and customer order flows, and full FAQ, contact, sizing, privacy, shipping, and returns resources.',
      'Layered in editorial storytelling through campaign imagery, collection copy, and The Journal alongside email capture for early access, releases, and brand updates.',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'GitHub', 'Cloudflare', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://lakesidesportclub.com' },
    accent: 'from-emerald-800/25 via-amber-500/10 to-white/5',
    logo: lakesideLogo,
  },
  {
    tag: 'Executive Analytics Suite',
    title: 'Executive Sales & Bidding Analytics Suite',
    subtitle: 'Enterprise reporting system of 20+ executive dashboards and 100+ visualizations that power sales, quoting, and project-lifecycle decisions at Kewaunee Scientific.',
    description:
      'Engineered a connected suite of executive dashboards and visualizations that turns raw CRM, quoting, and project data into decision-ready reporting for sales, operations, and leadership. Built directly against real business requests and refined through recurring stakeholder meetings so every view answers a question an executive actually asks.',
    bullets: [
      'Designed and maintained 20+ executive dashboards and 100+ visualizations covering sales performance, bidding activity, quote conversion, project pipelines, and expiration tracking across enterprise datasets.',
      'Audited 2,000+ project and quote records through CRM systems to strengthen data accuracy, integrity, and reporting reliability across the suite.',
      'Built automated KPI reporting workflows and a centralized data dictionary to improve data governance, cross-team usability, and long-term reporting consistency.',
      'Engineered a project-expiration tracking system the analytics platform originally could not support, working through documentation, iteration, and workarounds until leadership had a live dashboard they now actively use.',
      'Translated executive-level requests into practical dashboards and automations by meeting directly with sales leadership and stakeholders, then delivering reporting assets that are both technically useful and professionally polished.',
    ],
    stack: ['Zoho Analytics', 'Power BI', 'SQL', 'CRM Data', 'KPI Automation', 'Data Governance'],
    primary: { label: 'Employer Website', href: 'https://www.kewaunee.com/' },
    accent: 'from-red-500/20 via-blue-500/10 to-white/5',
    logo: kewauneeScientificLogo,
  },
  {
    tag: 'Freelance Company',
    title: 'Higgins Digital',
    subtitle: 'Software and web development company focused on high-performance websites for real businesses.',
    description:
      'Higgins Digital is a software and web development company I created to build fast, modern, reliable websites that strengthen trust, improve first impressions, and help real companies look as strong online as they do in person.',
    bullets: [
      'Built the brand, website, service structure, portfolio presentation, and client-ready quote workflow around professional website development, domain transition support, performance optimization, and brand systems.',
      'Focused the platform on responsive layouts, polished UX, clearer information hierarchy, and direct conversion paths so businesses can communicate credibility and quality online.',
      'Created the company as a monetized web-services platform with reusable design systems, scalable delivery processes, and a public-facing professional presence at higginsd.com.',
    ],
    stack: ['Web Development', 'Responsive UX', 'Performance Optimization', 'Brand Systems', 'Domain Support', 'Client Delivery'],
    primary: { label: 'Live Website', href: 'https://higginsd.com/' },
    accent: 'from-blue-600/20 via-cyan-400/10 to-white/5',
    logo: projectHigginsDigitalLogo,
  },
  {
    tag: 'AI Website Builder',
    title: 'CrownCode AI',
    subtitle: 'Premium Claude-powered AI website builder that generates a production-ready website package from a structured intake.',
    description:
      'Built CrownCode AI as a premium website builder under Higgins Digital that guides users through a structured intake, generates a complete production-ready website package from their answers, and provides a second guided revision workflow to refine copy, UI/UX, branding, layout, and deployment readiness.',
    bullets: [
      'Designed the end-to-end flow: landing page → structured intake wizard → Claude generation → website package → guided revision → manual GitHub and Vercel deployment.',
      'Each generation returns a structured package rather than raw text: project name and brand summary, website strategy, sitemap, design system, generated pages with section copy, file tree, deployable code files, README, deployment guide, and revision prompt template.',
      'Built a multi-step intake wizard (Business Basics → Brand Direction → Website Structure → Content Details → Build Preferences → Final Review) with localStorage auto-save so a refresh never loses answers.',
      'Engineered a secure Anthropic Claude integration in server-side Next.js API routes, with validated request bodies, length limits, server-only error logging, and a revision engine that improves only what the user asks and preserves the rest.',
      'Delivered a premium navy-and-gold UI with a generation loading experience, collapsible result sections, per-file copy buttons, a full-project JSON export, and a plain-English GitHub and Vercel deployment guide for non-technical users.',
    ],
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Anthropic Claude API', 'lucide-react', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://crowncode.higginsd.com' },
    accent: 'from-yellow-500/20 via-slate-800/20 to-white/5',
    logo: projectCrownCodeLogo,
  },
  {
    tag: 'Digital Website Transformation',
    title: 'Higgins Building Group',
    subtitle: 'Modern website transformation for an established Hickory, North Carolina residential contractor specializing in custom-built luxury homes.',
    description:
      'Led the strategy, design, development, and deployment of a modern website transformation for Higgins Building Group. Company leadership commissioned the project to replace an outdated digital presence with a platform that better represents the quality, credibility, craftsmanship, and client experience associated with the business. Evaluated the existing site, gathered stakeholder requirements, reorganized content, and translated the company’s services and reputation into a clearer, more professional experience.',
    bullets: [
      'Independently managed the engagement through Higgins Digital, from stakeholder discovery and requirements gathering to project planning, content auditing, copy organization, and information architecture.',
      'Delivered a complete visual, structural, and responsive redesign with clearer presentation of custom-home capabilities, company history, projects, testimonials, and contact information.',
      'Strengthened use of project photography and brand-consistent visual storytelling while simplifying navigation and creating direct paths for prospective clients to explore the company and make contact.',
      'Optimized the platform across mobile, tablet, and desktop and ran development, quality assurance, stakeholder review, revisions, and deployment.',
      'Handled Vercel configuration and preparation for the production domain transition, aligning the company’s online presence with the standard of its real-world work.',
    ],
    stack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Vercel', 'GitHub'],
    primary: { label: 'Live Website', href: 'https://higginsbuildinggroup.com' },
    accent: 'from-yellow-500/20 via-blue-500/10 to-white/5',
    logo: hbgLogo,
  },
  {
    tag: 'AI Workflow System',
    title: 'Davis Intelligence',
    subtitle: 'Practical AI-assisted workflow system for planning, coding, documenting, reviewing, and shipping better work.',
    description:
      'Built Davis Intelligence as a public platform for practical AI workflows aimed at builders, analysts, students, and business-minded creators. The site translates the systems I use every day into repeatable methods for planning, coding, documenting, reviewing, and shipping better work with AI.',
    bullets: [
      'Designed a curated library of AI workflows and playbooks that turn generic model output into reliable, structured, high-quality deliverables across development, analytics, writing, and business operations.',
      'Documented the Claude Code operating system I use for real projects, including memory patterns, project scaffolding, review loops, and shipping practices that generalize beyond any single tool.',
      'Built a fast, responsive single-page experience for the platform with SEO-ready metadata, Open Graph and Twitter previews, and a Vite and React stack deployed on Vercel behind ai.davishiggins.com.',
      'Integrated a Stripe-backed access layer with test-mode infrastructure, environment-variable-driven configuration, and a downloadable resources area for playbooks, prompts, and templates.',
      'Positioned the platform as a monetized, always-improving system rather than a one-time content drop, with room to layer additional workflows, courses, and premium resources over time.',
    ],
    stack: ['React', 'Vite', 'JavaScript', 'Stripe', 'Vercel', 'SEO'],
    accent: 'from-sky-500/25 via-indigo-500/10 to-white/5',
    logo: projectDhLogo,
  },
  {
    tag: 'Open-Source Data Pipeline',
    title: 'ProspectIQ',
    subtitle: 'Open-source Python CLI for collecting, normalizing, enriching, scoring, and exporting publicly available lead data.',
    description:
      'Engineered a modular lead-intelligence pipeline that unifies eight public sources behind one interface and transforms inconsistent profile data into structured, auditable records. ProspectIQ emphasizes transparent provenance, responsible collection, explainable scoring, local data ownership, and clear distinctions between observed, inferred, and verified contact information.',
    bullets: [
      'Built source modules for Instagram, TikTok, LinkedIn, GitHub, YouTube, Twitch, Pinterest, and link-in-bio platforms, with every source returning a consistent lead structure through one CLI.',
      'Developed an enrichment pipeline that analyzes websites, resolves company domains, detects published contact information, infers email patterns, performs optional SMTP verification, and identifies catch-all domains.',
      'Created a transparent 0 to 100 lead-quality score in which every point maps to a documented signal, then exported results through a stable CSV schema with provenance, confidence, and formula-injection protection.',
      'Implemented an offline demo, typed error handling, conservative request pacing, 272 automated tests, Ruff linting, mypy type checking, and continuous integration across Python 3.10, 3.11, and 3.12.',
    ],
    stack: ['Python', 'HTTPX', 'Rich', 'dnspython', 'pytest', 'Ruff', 'mypy', 'GitHub Actions'],
    primary: { label: 'GitHub Repository', href: 'https://github.com/davishiggins/prospectiq' },
    accent: 'from-teal-500/20 via-emerald-400/10 to-white/5',
    logo: projectProspectIqLogo,
  },
  {
    tag: 'Personal Platform',
    title: 'davishiggins.com',
    subtitle: 'Motion-driven personal website connecting my work across data, AI, analytics, web development, and digital product design.',
    description:
      'Designed and developed davishiggins.com as the central public home for my professional identity and project ecosystem. The platform combines recruiter-facing information, categorized project discovery, current experience, technical skills, writing, and direct contact paths inside a polished, highly interactive web experience.',
    bullets: [
      'Built a structured Work system that presents projects by category, development status, purpose, technology stack, and destination across AI systems, analytics platforms, websites, writing, e-commerce, and community tools.',
      'Organized my current positions, professional focus, verified accomplishments, technical skills, project history, resume, and contact information into a clear experience for recruiters, collaborators, and prospective clients.',
      'Developed a custom interaction system with smooth scrolling, animated transitions, cursor effects, responsive project galleries, loading sequences, and a contrast toggle while maintaining readable content and direct navigation.',
      'Connected the wider Davis Higgins ecosystem through dedicated destinations for my portfolio, GitHub, LinkedIn, writing, AI tools, photography, client work, and independently deployed project sites.',
    ],
    stack: ['Astro', 'TypeScript', 'GSAP', 'Lenis', 'SCSS', 'Responsive Design', 'SEO', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://davishiggins.com' },
    accent: 'from-indigo-500/20 via-sky-400/10 to-white/5',
    logo: projectDhLogo,
  },
  {
    tag: 'Personal Publishing Platform',
    title: 'Curated Notes',
    subtitle: 'Personal notes platform for publishing organized, readable, and visually polished writing through a clean MDX-based interface.',
    description:
      'Built Curated Notes as a custom notes website for storing and presenting written content in a simple, searchable, and professional format. The platform is designed around clarity, fast navigation, and a polished reading experience, and serves as the home for my ongoing published notes at notes.davishiggins.com.',
    bullets: [
      'Structured the site around MDX so every note is written like a document but rendered with reusable components, consistent typography, and a distraction-free reading interface.',
      'Built a custom Curated Notes brand and layout system with reusable UI components, responsive design, and a clean editorial aesthetic tuned for long-form reading.',
      'Organized note content for fast navigation with clear hierarchy, so a reader can move between topics without losing context or breaking the reading flow.',
      'Shipped the platform as a public, standalone destination separate from my main portfolio so notes can grow into their own body of work over time.',
    ],
    stack: ['Next.js', 'TypeScript', 'MDX', 'Tailwind CSS', 'CSS Modules', 'Vercel'],
    primary: { label: 'Live Website', href: 'https://notes.davishiggins.com' },
    secondary: { label: 'GitHub Repository', href: 'https://github.com/DavisHiggins/curated-notes' },
    accent: 'from-amber-500/20 via-slate-500/10 to-white/5',
    logo: projectCuratedNotesLogo,
  },
  {
    tag: 'Statistical Analysis',
    title: 'NYPD Crime Data Analysis',
    subtitle: 'In-depth analysis of social issues and their impact across different time periods, offense categories, and demographic patterns.',
    description:
      'This project used Python and SQL to analyze NYPD hate crime datasets across pre-COVID, during-COVID, and post-COVID periods in order to understand how major external events affected crime patterns and bias-related incident behavior.',
    bullets: [
      'Cleaned and structured raw data so the analysis would be reliable, consistent, and usable.',
      'Built visualizations to identify changes in frequency, offense categories, and bias patterns across time periods.',
      'Applied Chi-Square testing and logistic regression to extend the project beyond description into statistical and predictive insight.',
    ],
    stack: ['Python', 'Pandas', 'SQL', 'Matplotlib', 'Chi-Square', 'Logistic Regression'],
    primary: { label: 'GitHub Repository', href: 'https://github.com/DavisHiggins/HateCrimeDataAnalysis' },
    accent: 'from-sky-400/20 via-cyan-400/10 to-white/5',
    logo: projectDhLogo,
  },
  {
    tag: 'Research Project',
    title: 'Census Data Analysis',
    subtitle: 'Demographic and socioeconomic analysis of salary outcomes using education, age, race, and sex as predictors.',
    description:
      'This project analyzed U.S. Census data to identify which demographic and socioeconomic factors most strongly influence salary outcomes, with education emerging as the strongest predictor.',
    bullets: [
      'Applied correlation analysis, ANOVA, and Chi-Square techniques to evaluate relationships among variables.',
      'Built visualizations that made income patterns and disparities easier to interpret.',
      'Connected findings to broader real-world discussion around inequality, opportunity, and socioeconomic outcomes.',
    ],
    stack: ['Python', 'Visualization', 'Correlation', 'ANOVA', 'Chi-Square'],
    primary: { label: 'Final Paper', href: '/docs/Census_Data_Analysis_Paper.pdf' },
    accent: 'from-sky-400/20 via-cyan-400/10 to-white/5',
    logo: projectDhLogo,
  },
]

// Each employer holds one logo and one or more nested roles, rendered with an
// internal vertical timeline when multiple roles share the same employer.
const EXPERIENCE = [
  {
    company: 'One Chaptr Creative',
    logo: oneChaptrLogo,
    subtitle: 'Holding Company',
    roles: [
      {
        period: 'Aug 2026 - Present',
        title: 'Software Engineer',
        detail: 'Storefront Platform · Web Development · Frontend UI/UX',
        bullets: [
          'Co-developing a multi-tenant e-commerce storefront platform for One Chaptr Creative using Next.js and TypeScript',
          'Architecting reusable university and client storefront templates within a single scalable codebase, enabling each organization to deliver a distinct branded shopping experience',
          'Building a 63-component UI system with responsive customer-facing routes, accessible interactions, polished motion, and complete loading, empty, error, and success states',
          'Creating typed data models, mock providers, and integration boundaries that prepare the storefront for future InkSoft commerce and backend integrations',
        ],
      },
    ],
  },
  {
    company: 'Kewaunee Scientific Corp.',
    logo: kewauneeScientificLogo,
    subtitle: 'Laboratory Manufacturing',
    accent: 'from-blue-500/10 via-red-500/10 to-white/5',
    roles: [
      {
        period: 'Jun 2025 – Present',
        title: 'Data Analyst Intern',
        detail: 'Dashboard Development · KPI Reporting · Data Automation',
        bullets: [
          'Engineer and maintain 20+ executive dashboards and 100+ visualizations that improve reporting quality, readability, and decision-making for leadership.',
          'Audit 2,000+ project and quote records through CRM systems to strengthen data accuracy, integrity, and reporting reliability across enterprise datasets.',
          'Build automated KPI reporting workflows and a centralized data dictionary to improve data governance, cross-team usability, and long-term reporting consistency.',
          'Meet directly with executives and stakeholders to understand what reports, dashboards, and automations would make their jobs easier, then translate those business requests into practical solutions.',
          'Support cleaner communication between raw data, business questions, and final executive output by building reporting assets that are both technically useful and professionally polished.',
        ],
      },
    ],
  },
  {
    company: 'Higgins Digital',
    logo: higginsDigitalLogo,
    website: 'https://higginsd.com/',
    subtitle: 'Freelance',
    accent: 'from-blue-600/20 via-cyan-400/10 to-white/5',
    roles: [
      {
        period: 'Jan 2026 – Present',
        title: 'Founder & Web Developer',
        detail: 'Responsive Websites · Production Deployment · UI/UX Optimization',
        bullets: [
          'Design and develop responsive, production-ready websites for real business clients, translating requirements into clean, scalable solutions.',
          'Deploy and manage applications, ensuring performance, reliability, and cross-device compatibility.',
          'Optimize UI/UX and site functionality to deliver intuitive, high-quality user experiences aligned with business needs.',
        ],
        link: { label: 'Company Website', href: 'https://higginsd.com/' },
      },
      {
        period: 'Jan 2026 – Present',
        title: 'Personal Branding & Career Consultant',
        detail: 'Resume Strategy · LinkedIn Optimization · Personal Branding',
        bullets: [
          'Redesign and optimize resumes for students and early-career professionals targeting internships and full-time roles.',
          'Audit and rewrite LinkedIn profiles to improve recruiter visibility, keyword alignment, and professional narrative.',
          'Develop cohesive personal brand strategy across resume, LinkedIn, and online presence to maximize hiring outcomes.',
        ],
      },
    ],
  },
  {
    company: 'Lakeside Sport Club',
    logo: lakesideLogo,
    website: 'https://lakesidesportclub.com',
    subtitle: 'Sport & Lifestyle Apparel',
    accent: 'from-blue-900/25 via-amber-500/10 to-white/5',
    roles: [
      {
        period: 'Jun 2026 – Present',
        title: 'Creative Director',
        bullets: [
          'Lead the creative direction and digital commerce strategy for a premium sport and lifestyle apparel brand. Oversee brand identity, product presentation, website experience, campaign assets, and data-informed improvements across the customer journey.',
          'Designed and developed the brand’s e-commerce platform, creating a cohesive, conversion-focused experience across product discovery, merchandising, and checkout.',
        ],
      },
    ],
  },
  {
    company: 'Phi Delta Theta',
    logo: pdtLogo,
    subtitle: 'NC Epsilon',
    accent: 'from-sky-400/10 via-yellow-400/10 to-white/5',
    roles: [
      {
        period: 'Jan 2026 – Present',
        title: 'Vice President of Philanthropy',
        detail: 'Leadership · Commitment · NC Epsilon',
        bullets: [
          'Lead fundraising strategy and execution, generating $3,000+ for the Live Like Lou Foundation.',
          'Coordinate philanthropy initiatives that improve member engagement and community impact.',
        ],
      },
      {
        period: 'Apr 2026 – Present',
        title: 'Chaplain',
        detail: 'Faith Leadership · Brotherhood · Chapter Culture',
        bullets: [
          'Lead weekly Bible studies focused on faith, discipline, and brotherhood.',
          'Develop and implement a semester-long scripture plan and engagement system to strengthen chapter culture, leadership, and personal development.',
        ],
        link: { label: 'Chaplain Platform', href: 'https://phideltchaplain.vercel.app/' },
      },
    ],
  },
  {
    company: 'Higgins Building Group, Inc.',
    logo: hbgLogo,
    subtitle: 'Construction',
    accent: 'from-yellow-400/10 via-blue-500/10 to-white/5',
    roles: [
      {
        period: 'May 2024 – Aug 2024',
        title: 'Assistant to Project Manager',
        detail: 'Operational Oversight · Timeline Documentation',
        bullets: [
          'Coordinated project documentation and cross-functional workflows to support construction operations.',
          'Monitored timelines, materials, and logistics to improve project execution and efficiency.',
        ],
      },
    ],
  },
  {
    company: 'Teesly LLC',
    logo: '/docs/teeslylogo.png',
    subtitle: 'Custom Apparel Business',
    accent: 'from-orange-500/10 via-slate-500/10 to-white/5',
    roles: [
      {
        period: 'Jan 2023 – May 2024',
        title: 'Co-Founder & Operations Lead',
        detail: 'Self-employed · Retail Sales · Business Ownership',
        bullets: [
          'Ran a mobile retail operation across regional AAU basketball tournaments, optimizing pricing, revenue splits, and product mix using live sales data.',
          'Managed end-to-end operations including inventory, transactions, on-demand production, and fulfillment for 100+ custom orders per event.',
          'Adjusted offerings in real time based on customer demand, event context, and buying behavior to maximize revenue and improve execution under pressure.',
          'Operated the business with an owner mindset by balancing speed, service quality, logistics, and profitability in live-event environments.',
        ],
      },
    ],
  },
  {
    company: 'Touch-Up Solutions',
    logo: tusLogo,
    subtitle: 'Manufacturing & Distribution',
    accent: 'from-yellow-400/10 via-sky-500/10 to-white/5',
    roles: [
      {
        period: 'Dec 2022 – May 2024',
        title: 'Warehouse Specialist',
        detail: 'Order Fulfillment · Production · Shipment Handling',
        bullets: [
          'Executed high-volume inventory handling and order fulfillment with accuracy and efficiency.',
          'Ensured on-time shipment processing, supporting productive and reliable warehouse operations.',
        ],
      },
    ],
  },
]

const PROOF_OF_SKILLS = [
  {
    eyebrow: 'TECHNICAL EXECUTION',
    title: 'Problem-Solving and Commitment to Success',
    outcome: 'Built a dashboard the analytics platform technically could not support.',
    traits: ['Dedication', 'Initiative', 'Adaptability'],
    text:
      "At Kewaunee, I regularly met with the sales team to figure out what dashboards would actually help them make better calls. In one of those meetings, the VP of Sales pitched a complex idea where he wanted to track projects expiring across a bunch of timelines (day, week, month, year) plus a ton of other components on top of that. Right away I could tell the structure didn't really line up with what our analytics platform could do, but I didn't want to push back and give up. I wanted to figure it out. A lot of trial and error, a lot of digging through documentation, a lot of bouncing ideas off coworkers, and using AI to speed up the parts I was stuck on. Eventually I found a workaround that let the data show up the way he originally pictured it. What started as something that probably wasn't possible ended up being a dashboard leadership actually uses. That pretty much sums up how I try to handle things: don't bail when something seems impossible, just keep working at it until you figure it out.",
  },
  {
    eyebrow: 'PRESSURE PERFORMANCE',
    title: 'Perseverance Through Adversity',
    outcome: 'Generated $1,500+ solo across a two-day weekend after my partner went down with a fever.',
    traits: ['Self-Reliance', 'Work Ethic', 'Accountability'],
    text:
      "Back in May 2023, I was heading to Rock Hill, SC for a tournament weekend to sell shirts and promote the apparel business. My usual partner couldn't make it, so I brought another friend with sales experience to run the table. Friday went well, but Saturday morning he woke up with a high fever and was out for the rest of the weekend. The tournament ran 7 AM to 8 PM each day, so I had two full days left. Honestly, I thought about packing it up and heading home. It would've been the easy move. But I stuck it out solo. It was rougher: tracking orders, managing inventory, pulling people over, printing designs, running transactions, and packing everything into my Honda Accord at the end of each day with almost no breaks. After paying the tournament owner and covering costs, I cleared just over $1,500 across Saturday and Sunday by myself. I could've taken the easy route. I'm glad I didn't.",
  },
  {
    eyebrow: 'SYSTEM ARCHITECTURE',
    title: 'Engineering a Decision Engine',
    outcome: 'Turned a curious thought into a production analytics platform with a working ML engine.',
    traits: ['Innovation', 'Product Thinking', 'Technical Execution', 'System Design'],
    text:
      "Contender pretty much shows how I like to work. Build with real structure, think through how a user is actually going to experience it, protect what's proprietary, and create something that can grow into more than just a class project. The idea came from being into AI and sports at the same time. I have a lot of friends and family who place wagers, and I kept thinking there has to be a better way than going off vibes or random takes. Data could probably estimate this stuff way more accurately. I looked at what was already out there and noticed a gap: platforms throw stats and insights at you, but almost none give you a clean, engine-generated probability for whether something will actually happen. So I started building. I spun up a Streamlit app with nba_api to pull player data and built an internal engine that turns the inputs into structured probability outputs, factoring in distributions and which performance factors matter most. Then I rebuilt it as Contender, with a FastAPI backend, a Next.js frontend, parlays, and saved picks that settle themselves. From a random thought to a real analytics platform and decision engine, all from scratch. It's wild how far you can get when you just start.",
  },
]

// ---------------------------------------------------------------------------
// Table of contents — section registries
//
// Derived from the content arrays above so a rail can never drift from the page
// it describes. Declared at module scope so the identities stay stable across
// renders and the scrollspy effect is not torn down on every parent re-render.
// ---------------------------------------------------------------------------

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const EXPERIENCE_SECTIONS = EXPERIENCE.map((employer) => ({
  id: `exp-${slugify(employer.company)}`,
  label: employer.company,
  meta: employer.subtitle,
}))

const PROJECT_SECTIONS = PROJECTS.map((project) => ({
  id: `proj-${slugify(project.title)}`,
  label: project.title,
  meta: project.tag,
}))

const IMPACT_SECTIONS = PROOF_OF_SKILLS.map((item) => ({
  id: `impact-${slugify(item.title)}`,
  label: item.title,
  meta: item.eyebrow,
}))

const EDUCATION_SECTIONS = [
  { id: 'edu-academic-background', label: 'Academic Background', meta: 'UNC Charlotte · Catawba Valley' },
  { id: 'edu-honors', label: 'Honors', meta: 'Public Anthropology Award' },
]

const SKILLS_SECTIONS = [
  { id: 'skills-tech-stack-matrix', label: 'Tech Stack Matrix', meta: 'Grouped for fast scanning' },
  {
    id: 'skills-proficiency-drill-down',
    label: 'Proficiency Drill-Down',
    meta: `${SKILLS_PROFICIENCY.length} skills`,
  },
]

// Keyed by `activePage`. Pages absent from this map get no rail. Note Impact's
// page key is 'skills-proof', not 'impact'.
const TOC_SECTIONS = {
  experience: EXPERIENCE_SECTIONS,
  projects: PROJECT_SECTIONS,
  education: EDUCATION_SECTIONS,
  skills: SKILLS_SECTIONS,
  'skills-proof': IMPACT_SECTIONS,
}

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'davishiggins@icloud.com',
    href: 'mailto:davishiggins@icloud.com',
    icon: Mail,
    glow: 'from-sky-500/25 to-cyan-400/10',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/davishiggins',
    href: 'https://www.linkedin.com/in/davishiggins',
    icon: Linkedin,
    glow: 'from-blue-500/25 to-sky-400/10',
    external: true,
  },
  {
    label: 'Phone',
    value: '+1 (828) 578-0262',
    href: 'tel:+18285780262',
    icon: Phone,
    glow: 'from-violet-500/25 to-fuchsia-400/10',
  },
  {
    label: 'Instagram',
    value: 'instagram.com/daviscoded',
    href: 'https://instagram.com/daviscoded',
    icon: Instagram,
    glow: 'from-emerald-500/25 to-teal-400/10',
    external: true,
  },
  {
    label: 'GitHub',
    value: 'github.com/davishiggins',
    href: 'https://github.com/davishiggins',
    icon: Github,
    glow: 'from-slate-400/25 to-slate-200/10',
    external: true,
  },
  {
    label: 'Website',
    value: 'davishiggins.com',
    href: 'https://davishiggins.com',
    icon: Globe,
    glow: 'from-cyan-500/25 to-sky-400/10',
    external: true,
  },
]

function SectionHeader({ eyebrow, title, subtitle, showSubtitle = true }) {
  return (
    <div className="mb-10 max-w-4xl">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && showSubtitle ? <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{subtitle}</p> : null}
    </div>
  )
}

function Pill({ children }) {
  return <span className="chip">{children}</span>
}

// A single role inside an employer card (period, title, detail, bullets, link).
function RoleBlock({ role }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300 sm:text-sm">{role.period}</div>
      <h4 className="mt-2 break-words text-xl font-semibold leading-tight text-white sm:mt-3 sm:text-2xl">{role.title}</h4>
      {role.detail ? <div className="mt-1 text-xs text-slate-500 sm:text-sm">{role.detail}</div> : null}
      <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300 sm:mt-6">
        {role.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {role.link ? (
        <div className="mt-6">
          <a href={role.link.href} target="_blank" rel="noreferrer" className="secondary-btn">
            {role.link.label}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Table of contents rail — fixed right sidebar with scrollspy (>=1280px)
//
// Rendered as a sibling of <main>, deliberately OUTSIDE <AnimatePresence>. Two
// reasons: the content column keeps its own layout with no grid wrapper, and
// nothing in the rail can register with the presence tree (see SectionNav).
//
// The rail is pinned to the viewport's right edge and never reflows content on
// its own. Pages that show it opt into `.rail-reserve` (index.css), which yields
// ground only on viewports under 1560px — see that rule for the arithmetic.
// ---------------------------------------------------------------------------

// One number, three places: the rail's `top-28`, every target's `scroll-mt-28`,
// and the programmatic scroll landing point. The sticky header measures ~93px.
const SCROLL_OFFSET = 112
// The "you are here" line sits below the landing point on purpose. If they were
// equal, sub-pixel rounding after a click could resolve the *previous* section
// the instant the scroll lock releases, flicking the highlight backwards.
const SPY_TRIGGER = 136

// Flat, document-ordered list of the ids the spy tracks.
const spyIds = (sections) =>
  sections.flatMap((section) => [section.id, ...(section.children ?? []).map((child) => child.id)])

function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)
  const lockRef = useRef(false)
  const idsKey = ids.join('|')

  // Held in a ref so the observer and listeners always call the latest closure
  // without being torn down and rebuilt.
  const resolve = useRef(() => {})
  resolve.current = () => {
    if (lockRef.current) return

    // Short trailing sections (Education's "Honors", the last Impact card) can
    // never reach the trigger line because the page bottoms out first.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      setActiveId(ids[ids.length - 1] ?? null)
      return
    }

    // "The last section whose top has crossed the line." Height-agnostic, which
    // matters because a Projects card is taller than the viewport while an
    // Education heading is 40px — any ratio-based rule picks the short one.
    let next = ids[0] ?? null
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= SPY_TRIGGER) next = id
      else break
    }
    setActiveId((prev) => (prev === next ? prev : next))
  }

  useEffect(() => {
    if (ids.length === 0) return
    const run = () => resolve.current()

    // The observer is only an event source: it says *when* to recompute, and the
    // resolver above answers *what* from live rects. This also covers accordions
    // expanding, which reflow the page without emitting a scroll event.
    const observer = new IntersectionObserver(run, {
      rootMargin: `-${SPY_TRIGGER}px 0px -40% 0px`,
      threshold: [0, 1],
    })
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // The observer can stay silent through the last stretch of the document if
    // no boundary crosses the band, so the bottom clamp needs a real scroll signal.
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        run()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    run()
    // getBoundingClientRect() includes transforms, so the staggered entry
    // animations offset reads by up to 16px for ~0.6s. Re-resolve once settled.
    const settle = window.setTimeout(run, 700)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(settle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  const goTo = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return

    lockRef.current = true
    setActiveId(id) // optimistic, so the clicked entry lights up immediately

    window.scrollTo({
      top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET),
      // 'instant', not 'auto' — `auto` defers to html { scroll-behavior: smooth }
      // in index.css and would still animate.
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })

    // Move the reading cursor with the viewport for keyboard and screen readers.
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })

    // Release the lock on whichever signal arrives first. `scrollend` is precise
    // but only landed in Safari recently, so the idle debounce is the workhorse;
    // it also handles the user grabbing the wheel mid-animation.
    let idle = 0
    let hardStop = 0
    const onTick = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(release, 130)
    }
    function release() {
      lockRef.current = false
      window.clearTimeout(idle)
      window.clearTimeout(hardStop)
      window.removeEventListener('scrollend', release)
      window.removeEventListener('scroll', onTick)
      resolve.current()
    }
    if ('onscrollend' in window) window.addEventListener('scrollend', release, { once: true })
    window.addEventListener('scroll', onTick, { passive: true })
    idle = window.setTimeout(release, 130) // covers "already there, no scroll fires"
    hardStop = window.setTimeout(release, 1400)
  }, [])

  return { activeId, goTo }
}

// The chat panel is fixed top-right at z-index 9998 and covers the rail whenever
// it is open. The rail yields rather than touching a working feature. The panel
// is appended by public/assistant.js on DOMContentLoaded — after React mounts —
// and can be closed from its own button, so watch the DOM rather than wrapping
// window.toggleDavisAI.
function useAiPanelOpen() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let classObserver = null
    let bodyObserver = null

    const attach = (panel) => {
      setOpen(panel.classList.contains('open'))
      classObserver = new MutationObserver(() => setOpen(panel.classList.contains('open')))
      classObserver.observe(panel, { attributes: true, attributeFilter: ['class'] })
    }

    const existing = document.getElementById('ai-panel')
    if (existing) {
      attach(existing)
    } else {
      bodyObserver = new MutationObserver(() => {
        const panel = document.getElementById('ai-panel')
        if (!panel) return
        bodyObserver.disconnect()
        bodyObserver = null
        attach(panel)
      })
      bodyObserver.observe(document.body, { childList: true })
    }

    return () => {
      if (classObserver) classObserver.disconnect()
      if (bodyObserver) bodyObserver.disconnect()
    }
  }, [])

  return open
}

function SectionNavItem({ item, depth, isActive, onNavigate }) {
  return (
    <li data-toc={item.id}>
      <a
        href={`#${item.id}`}
        onClick={(event) => {
          event.preventDefault()
          onNavigate(item.id)
        }}
        aria-current={isActive ? 'location' : undefined}
        className={`block rounded-r-lg py-[6px] pr-1 transition-colors duration-200 ${
          depth === 0 ? 'pl-3' : 'pl-6'
        } ${isActive ? 'text-sky-300' : 'text-slate-400 hover:text-slate-200'}`}
      >
        <span
          className={`block leading-snug line-clamp-2 ${
            depth === 0 ? 'text-[12px] font-medium' : 'text-[11px]'
          }`}
        >
          {item.label}
        </span>
        {item.meta ? (
          <span
            className={`mt-0.5 block truncate text-[10px] transition-colors duration-200 ${
              isActive ? 'text-sky-300/60' : 'text-slate-500'
            }`}
          >
            {item.meta}
          </span>
        ) : null}
      </a>
    </li>
  )
}

function SectionNav({ sections }) {
  const reduceMotion = useReducedMotion()
  const ids = useMemo(() => spyIds(sections), [sections])
  const { activeId, goTo } = useScrollSpy(ids)
  const aiPanelOpen = useAiPanelOpen()
  const listRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  // A single measured indicator rather than one `layoutId` element per item.
  //
  // framer-motion 11.18.2 leaks presence registrations: `layoutId` mounts
  // MeasureLayout, which calls usePresence(), and usePresence discards the
  // deregister function that register() returns (use-presence.mjs:35-38). Every
  // unmounted indicator therefore leaves a permanently-incomplete entry in the
  // enclosing PresenceChild's map, and AnimatePresence mode="wait" then never
  // fires onExitComplete — leaving <main> stuck holding the outgoing page at
  // opacity 0. That was the "pages go blank after the second tab switch" bug.
  // Driving one element with `animate` uses no layout features and cannot leak.
  useLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current
      const el = activeId ? list?.querySelector(`[data-toc="${CSS.escape(activeId)}"]`) : null
      setIndicator(el ? { top: el.offsetTop, height: el.offsetHeight } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeId, sections])

  if (sections.length === 0) return null

  return (
    <aside className="hidden xl:block">
      <nav
        aria-label="On this page"
        className={`glass fixed right-4 top-28 z-30 max-h-[calc(100vh-8.5rem)] w-40 overflow-y-auto overscroll-contain rounded-[1.25rem] p-4 shadow-soft transition-opacity duration-200 ${
          aiPanelOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <div className="mb-3 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300">
          <Sparkles className="h-3 w-3 shrink-0" />
          On this page
        </div>

        <ol ref={listRef} className="relative space-y-0.5 border-l border-white/10">
          {indicator ? (
            <motion.span
              aria-hidden
              initial={false}
              animate={{ y: indicator.top, height: indicator.height }}
              transition={
                reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }
              }
              className="absolute left-0 top-0 w-[2px] rounded-full bg-gradient-to-b from-sky-400 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.55)]"
            />
          ) : null}

          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <SectionNavItem
                item={section}
                depth={0}
                isActive={activeId === section.id}
                onNavigate={goTo}
              />
              {(section.children ?? []).map((child) => (
                <SectionNavItem
                  key={child.id}
                  item={child}
                  depth={1}
                  isActive={activeId === child.id}
                  onNavigate={goTo}
                />
              ))}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </aside>
  )
}

// `reserveRail` wraps the shell in a container that yields ground to the fixed
// TOC rail only on viewports too narrow to host it in the gutter. At >=1560px the
// reserve computes to 0, so the shell is byte-identical to every other page.
function PageShell({ children, accents = false, reserveRail = false }) {
  const shell = (
    <div className={`section-shell py-10 sm:py-14 ${accents ? 'relative' : ''}`}>
      {children}
    </div>
  )

  return reserveRail ? <div className="rail-reserve">{shell}</div> : shell
}

// Decorative accent glow for content sections. Rendered ONCE at the app level as a
// fixed, non-transformed layer (outside the page's enter/exit motion) so it never
// participates in the transform/opacity compositing that caused a blue flash on open.
function AccentBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: [
          'radial-gradient(ellipse 60% 50% at -5% 15%, rgba(56,189,248,0.13) 0%, transparent 70%)',
          'radial-gradient(ellipse 55% 55% at 105% 40%, rgba(34,211,238,0.09) 0%, transparent 70%)',
          'radial-gradient(ellipse 50% 45% at 42% 110%, rgba(99,102,241,0.11) 0%, transparent 70%)',
        ].join(', '),
      }}
    />
  )
}

function GitHubActivityStrip() {
  const [data, setData] = useState({
    lastCommit: null,
    lastRepo: null,
    commitCount30d: null,
    loading: true,
    error: false,
  })

  useEffect(() => {
    const controller = new AbortController()
    const USERNAME = 'DavisHiggins'

    async function fetchActivity() {
      try {
        const headers = { Accept: 'application/vnd.github+json' }
        const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const sinceISO = sinceDate.toISOString()

        const reposRes = await fetch(
          `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed&direction=desc`,
          { signal: controller.signal, headers }
        )
        if (!reposRes.ok) throw new Error('repos fetch failed')
        const repos = await reposRes.json()

        const recentRepos = repos.filter((r) => new Date(r.pushed_at) >= sinceDate)

        let totalCommits = 0
        let mostRecent = null
        let mostRecentRepo = null

        const commitPromises = recentRepos.slice(0, 15).map(async (repo) => {
          try {
            const res = await fetch(
              `https://api.github.com/repos/${repo.full_name}/commits?author=${USERNAME}&since=${sinceISO}&per_page=100`,
              { signal: controller.signal, headers }
            )
            if (!res.ok) return null
            const commits = await res.json()
            if (!Array.isArray(commits)) return null
            return { repo: repo.name, commits }
          } catch {
            return null
          }
        })

        const results = await Promise.all(commitPromises)
        for (const r of results) {
          if (!r) continue
          totalCommits += r.commits.length
          for (const c of r.commits) {
            const d = new Date(c.commit?.author?.date || c.commit?.committer?.date)
            if (!mostRecent || d > mostRecent) {
              mostRecent = d
              mostRecentRepo = r.repo
            }
          }
        }

        setData({
          lastCommit: mostRecent,
          lastRepo: mostRecentRepo,
          commitCount30d: totalCommits,
          loading: false,
          error: false,
        })
      } catch (e) {
        if (e.name !== 'AbortError') setData((d) => ({ ...d, loading: false, error: true }))
      }
    }

    fetchActivity()
    return () => controller.abort()
  }, [])

  const formatTimeAgo = (date) => {
    if (!date) return null
    const diff = Date.now() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'less than an hour ago'
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  const displayCommits = data.error || data.commitCount30d == null ? null : data.commitCount30d
  const displayLast =
    data.error || !data.lastCommit
      ? 'View latest activity on GitHub'
      : `Last commit: ${formatTimeAgo(data.lastCommit)}${data.lastRepo ? ` on ${data.lastRepo}` : ''}`

  return (
    <div className="glass rounded-[1.75rem] p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3 text-sky-300">
          <Github className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">GitHub Activity</h3>
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {data.loading ? 'Loading…' : displayLast}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {data.loading
              ? '\u00A0'
              : displayCommits != null
              ? `${displayCommits} commits in the last 30 days`
              : 'Recent activity available on GitHub'}
          </p>
          <a
            href="https://github.com/DavisHiggins"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition hover:text-sky-200"
          >
            View profile <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

function NowLearningCard() {
  return (
    <div className="glass rounded-[1.75rem] p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3 text-sky-300">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Currently Growing</h3>
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-sky-400" />
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div>
              <span className="text-slate-400">Learning: </span>
              <span className="text-slate-200">{NOW_LEARNING.learning}</span>
            </div>
            <div>
              <span className="text-slate-400">Reading: </span>
              <span className="text-slate-200">{NOW_LEARNING.reading}</span>
            </div>
            <div>
              <span className="text-slate-400">Course: </span>
              <span className="text-slate-200">{NOW_LEARNING.course}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LiveStatusCard() {
  return (
    <div className="glass rounded-[1.75rem] p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3 text-sky-300">
          <Activity className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">System Status</h3>
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </div>
          <div className="mt-3 space-y-2">
            {LIVE_STATUS.map((proj) => (
              <a
                key={proj.name}
                href={proj.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm transition hover:text-sky-200"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span className="text-slate-200">{proj.name}</span>
                <span className="text-xs text-slate-500">Online</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


// =========================================================================
// ASK MY PORTFOLIO — AI chat widget
//
// Client-side: calls /api/chat (a Vercel serverless function), which holds
// the Anthropic API key server-side. The browser never sees the key, so
// visitors can't extract it from DevTools or the bundle.
//
// Setup: deploy the /api/chat.js function alongside this app on Vercel and
// set ANTHROPIC_API_KEY in the project's environment variables. See the
// header comment in api/chat.js for details.
//
// Fallback: if the API call fails for any reason (network, rate limit,
// missing env var, server error), the widget silently falls back to a
// local keyword-matching answer so it never breaks.
// =========================================================================

async function callAnthropic(question, history) {
  try {
    const messages = [
      ...history
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.text })),
      { role: 'user', content: question },
    ]

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })

    if (!res.ok) {
      console.warn('Chat API error:', res.status)
      return null
    }
    const data = await res.json()
    return data?.reply || null
  } catch (err) {
    console.warn('Chat call failed:', err)
    return null
  }
}

// Small typing-dots animation for the loading state
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-sky-300"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function DavisIntelligenceWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hey! I'm Davis Intelligence, an AI chatbot developed by Davis Higgins. I'm a portfolio assistant trained to answer questions about Davis and his portfolio. Ask me about Davis's experience, projects, businesses, resume, technical skills, or goals.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open, loading])

  const send = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || loading) return
    setInput('')
    const userMsg = { role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    // Try real API first, fall back to local KB on any failure.
    const history = [...messages, userMsg]
    let answer = await callAnthropic(trimmed, history)
    if (!answer) answer = answerQuestion(trimmed)

    // Brief minimum delay so the typing animation actually registers
    await new Promise((r) => setTimeout(r, 200))

    setMessages((prev) => [...prev, { role: 'assistant', text: answer }])
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const suggestions = ['Experience with SQL?', 'Tell me about Contender', 'Why hire Davis?', 'How to contact?']

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2.5 rounded-full border border-yellow-400/50 bg-[#0a1628] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(212,175,55,0.2)] transition hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.35)] sm:px-6 sm:py-3.5 sm:text-base"
        aria-label={open ? 'Close Davis Intelligence chat' : 'Open Davis Intelligence chat'}
      >
        {open ? (
          <X className="h-4 w-4 text-slate-300" />
        ) : (
          <Sparkles className="h-4 w-4 text-yellow-300" />
        )}
        <span className={open ? 'text-slate-300' : 'text-white'}>
          {open ? 'Close' : 'Ask Davis AI'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[60] flex w-[calc(100vw-3rem)] max-w-[26rem] flex-col overflow-hidden rounded-[1.5rem] border border-yellow-400/20 bg-[#08111f]/97 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(212,175,55,0.08)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-yellow-400/20 bg-gradient-to-br from-[#0d1f3c] to-[#0a1628] px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
                <Brain className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white">Davis Intelligence</div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-yellow-400/80">
                  <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Portfolio AI Assistant
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-[24rem] min-h-[16rem] flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950 shadow-[0_4px_15px_rgba(56,189,248,0.2)]'
                        : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingDots />
                </motion.div>
              )}
              {messages.length === 1 && !loading && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-sky-300/20 bg-sky-400/5 px-2.5 py-1 text-xs text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-400/15 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-yellow-400/10 bg-[#0a1628]/50 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#0d1f3c] px-3 py-1.5 transition focus-within:border-yellow-400/40 focus-within:shadow-[0_0_0_2px_rgba(212,175,55,0.1)]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading}
                  placeholder={loading ? 'Thinking…' : 'Ask a question…'}
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-slate-500 outline-none caret-yellow-300 disabled:opacity-60"
                  style={{ color: '#ffffff' }}
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="rounded-full bg-gradient-to-br from-yellow-400/90 to-yellow-300 p-1.5 text-slate-950 shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-500">
                Davis Intelligence · Powered by Claude
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SEOHead() {
  useEffect(() => {
    document.title = 'Davis Higgins | Data Analyst Intern @ Kewaunee | UNC Charlotte'
    const ensureMeta = (selector, attrs) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        Object.entries(attrs.tag).forEach(([k, v]) => el.setAttribute(k, v))
        document.head.appendChild(el)
      }
      el.setAttribute('content', attrs.content)
    }
    const description =
      'Davis Higgins. Data Science student at UNC Charlotte. Data Analyst Intern at Kewaunee Scientific. Builder of Contender (NBA prop analytics), Flowcast (ML demand forecasting on AWS), DHLM (personal AI knowledge system), and Higgins Digital.'
    ensureMeta('meta[name="description"]', { tag: { name: 'description' }, content: description })
    ensureMeta('meta[property="og:title"]', { tag: { property: 'og:title' }, content: 'Davis Higgins | Data Analyst Intern @ Kewaunee | UNC Charlotte' })
    ensureMeta('meta[property="og:description"]', { tag: { property: 'og:description' }, content: description })
    ensureMeta('meta[property="og:type"]', { tag: { property: 'og:type' }, content: 'website' })
    ensureMeta('meta[property="og:image"]', { tag: { property: 'og:image' }, content: '/og-image.svg' })
    ensureMeta('meta[name="twitter:card"]', { tag: { name: 'twitter:card' }, content: 'summary_large_image' })
    ensureMeta('meta[name="twitter:title"]', { tag: { name: 'twitter:title' }, content: 'Davis Higgins | Data Analyst Intern @ Kewaunee | UNC Charlotte' })
    ensureMeta('meta[name="twitter:description"]', { tag: { name: 'twitter:description' }, content: description })
    ensureMeta('meta[name="twitter:image"]', { tag: { name: 'twitter:image' }, content: '/og-image.svg' })
  }, [])
  return null
}

function ProficiencySkill({ skill, expanded, onToggle }) {
  return (
    <div
      className={`glass overflow-hidden rounded-[1.5rem] transition-all duration-300 ${
        expanded ? 'ring-1 ring-sky-300/40 shadow-[0_0_20px_rgba(56,189,248,0.08)]' : 'hover:border-sky-300/15'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02]"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-semibold text-white sm:text-lg">{skill.name}</h4>
            <span className="text-xs text-slate-400">{skill.years} yr{skill.years === 1 ? '' : 's'}</span>
          </div>
          <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((skill.years / 4) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-[1px]">
              <span className="h-2 w-px bg-white/10" />
              <span className="h-2 w-px bg-white/10" />
              <span className="h-2 w-px bg-white/10" />
              <span className="h-2 w-px bg-white/10" />
              <span className="h-2 w-px bg-white/10" />
            </div>
          </div>
          <div className="mt-1 flex justify-between text-[9px] uppercase tracking-[0.1em] text-slate-500">
            <span>0</span>
            <span>1y</span>
            <span>2y</span>
            <span>3y</span>
            <span>4y+</span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5 px-5 pb-5 pt-3"
          >
            <p className="text-sm leading-6 text-slate-300">{skill.description}</p>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Tools / Libraries</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skill.libraries.map((lib) => (
                  <span
                    key={lib}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300"
                  >
                    {lib}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Applied in {skill.projectCount} project{skill.projectCount === 1 ? '' : 's'}
              </div>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {skill.projects.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-300" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CaseStudyDropdown({ expanded, onToggle }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-sky-300/30 bg-white/[0.04] shadow-soft transition-all duration-300 ${
        expanded ? 'ring-1 ring-sky-300/40 shadow-[0_15px_50px_rgba(56,189,248,0.12)]' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/15 via-blue-500/8 to-white/5" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.85))]" />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 text-slate-950 shadow-[0_10px_25px_rgba(56,189,248,0.3)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs sm:tracking-[0.2em]">
              Deep Dive
            </div>
            <h3 className="mt-1.5 break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
              Full Case Study: Contender
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-sky-300 transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden"
          >
            <div className="relative border-t border-white/10 px-5 pb-6 pt-6 sm:px-6 sm:pb-8">
              <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base">
                A full breakdown of how I rebuilt a Streamlit prototype into Contender, a production analytics platform: the problem, the approach, the architecture, key decisions, tradeoffs, and what came out of it.
              </p>

              <div className="space-y-6">
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    01 · Problem
                  </div>
                  <h3 className="text-xl font-semibold text-white">A market full of stats and short on honest probabilities.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Sports betting is one of the largest decision-making spaces in the world, but the average user makes calls based on emotion, recency bias, and incomplete information. Existing tools surface raw stats, matchup notes, and confident-looking numbers, but very few give a clean, engine-generated probability of an outcome, and almost none show where that number came from or how much to trust it. I wanted to fix both.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">User pain</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">No clear hit probability, and no way to tell a projection from a guess.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Market gap</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">No platform kept projection, history, matchup context, and probability visibly separate in one decision engine.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    02 · Approach
                  </div>
                  <h3 className="text-xl font-semibold text-white">Rebuild the prototype as a real product without losing what worked.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The first version was a Streamlit app with a hybrid engine: a rules-based projection blended with a Random Forest Regressor and a Ridge regression fallback. Instead of rewriting that engine from scratch, I ported it into a typed FastAPI service, recorded real NBA responses as fixtures, and wrote parity tests so every displayed metric was either preserved exactly or corrected with a documented before-and-after example. Then I rebuilt everything around it: a normalized data store, a versioned API, background workers, and a Next.js product.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Ingest schedule and game-log data from stats.nba.com into a normalized Supabase Postgres store.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Run the ported engine: a rules projection blended with a Random Forest model, with Ridge as the fallback.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Label every probability by calibration status instead of presenting it as calibrated.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Combine 2, 3, and 4-leg parlays under a stated independence assumption, with dependence bounds and linked-leg flags.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" /> Save each analysis as an immutable snapshot and settle it automatically against final box scores.</li>
                  </ul>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    03 · Architecture
                  </div>
                  <h3 className="text-xl font-semibold text-white">End-to-end stack.</h3>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#08111f]/60 p-5 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
                    <pre className="whitespace-pre">{`  ┌──────────────────┐     ┌──────────────────┐
  │  stats.nba.com   │ ──► │ Ingestion worker │
  │ (schedule, logs) │     │ → Supabase store │
  └──────────────────┘     └────────┬─────────┘
                                    │
                          ┌─────────┴─────────┐
                          ▼                   ▼
              ┌──────────────────┐   ┌──────────────────┐
              │  Random Forest   │   │  Rules-based     │
              │  (Ridge fallback)│   │  projection eng. │
              └────────┬─────────┘   └────────┬─────────┘
                       └──────────┬───────────┘
                                  ▼
                       ┌──────────────────────┐
                       │  FastAPI /api/v1     │
                       │  jobs · quotas · auth│
                       └──────────┬───────────┘
                                  ▼
                       ┌──────────────────────┐
                       │  Next.js front end   │
                       │  + Clerk / Stripe    │
                       │  + settled history   │
                       └──────────────────────┘`}</pre>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Data layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">stats.nba.com via nba_api, Supabase Postgres</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Modeling</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Python, scikit-learn (Random Forest, Ridge)</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Application</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Next.js, TypeScript, Tailwind CSS, React Query</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Backend / Auth</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">FastAPI, Clerk, Stripe, Render</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    04 · Key Decisions
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">Port the engine before improving it.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Parity tests against recorded NBA data proved the new service matched the original: 68 metrics were preserved exactly and 18 were corrected, each with a documented reason and examples. Nothing changed silently.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Ridge regression as the fallback path.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">For players with limited history, Ridge gives more reliable, regularized output than running an undertrained Random Forest.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Honest probability labels.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Every probability carries its calibration status. The current points model is provisional, so no number is presented as calibrated until settled outcomes support it.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Saved picks as immutable snapshots, settled automatically.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">A background worker grades saved picks and parlays against final box scores, which turns Contender into a feedback loop with a pick tracker, not a one-shot calculator.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    05 · Tradeoffs
                  </div>
                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p><span className="font-semibold text-white">Speed vs depth:</span> analyses run as background jobs. Cached results return immediately, new ones are queued and polled, so heavy feature work never blocks a request.</p>
                    <p><span className="font-semibold text-white">Joint model vs honesty:</span> parlay probability multiplies leg estimates under independence. Rather than ship an unvalidated joint model, I show that assumption beside dependence bounds and linked-leg flags.</p>
                    <p><span className="font-semibold text-white">Cost vs always-on:</span> the API runs its worker in-process on Render without Redis. That keeps hosting simple and cheap, at the cost of the worker pausing when the free instance sleeps.</p>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    06 · Results
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
                      <div className="text-3xl font-bold text-white">23</div>
                      <div className="mt-1 text-sm text-slate-300">Prop markets, over and under</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">2–4</div>
                      <div className="mt-1 text-sm text-slate-300">Leg parlay analysis</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">580+</div>
                      <div className="mt-1 text-sm text-slate-300">Automated backend tests</div>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    Contender went from a Streamlit prototype to a production analytics platform with a typed FastAPI service, a versioned API, authenticated subscriptions, background ingestion and settlement, and a Next.js experience that shows its work. MLB and NFL modules are already built on a shared multi-sport foundation behind feature flags. More importantly, building it forced me to make real engineering tradeoffs and own them end-to-end. That is the part I am most proud of.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="https://contender.davishiggins.com" target="_blank" rel="noreferrer" className="primary-btn">
                    Live Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="https://contender.davishiggins.com/methodology" target="_blank" rel="noreferrer" className="secondary-btn">
                    Methodology
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProspectIqCaseStudy({ expanded, onToggle }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-sky-300/30 bg-white/[0.04] shadow-soft transition-all duration-300 ${
        expanded ? 'ring-1 ring-sky-300/40 shadow-[0_15px_50px_rgba(56,189,248,0.12)]' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/15 via-emerald-400/8 to-white/5" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.85))]" />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-[0_10px_25px_rgba(45,212,191,0.3)]">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs sm:tracking-[0.2em]">
              Deep Dive
            </div>
            <h3 className="mt-1.5 break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
              Full Case Study: ProspectIQ
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-sky-300 transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden"
          >
            <div className="relative border-t border-white/10 px-5 pb-6 pt-6 sm:px-6 sm:pb-8">
              <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base">
                A complete breakdown of how I built ProspectIQ into a transparent lead-intelligence pipeline: the fragmented-data problem, unified schema, enrichment process, confidence model, responsible-use boundaries, testing strategy, and export architecture.
              </p>

              <div className="space-y-6">
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    01 · Problem
                  </div>
                  <h3 className="text-xl font-semibold text-white">Public data is available, but it is not ready to use.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Useful lead information is distributed across social profiles, developer platforms, video channels, company websites, and link-in-bio pages. Each source uses different field names, data types, authentication requirements, limitations, and page structures. Collecting that information manually is slow, and combining it into a trustworthy dataset requires far more than copying names and email addresses into a spreadsheet.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Many contact-enrichment products return a result with an opaque confidence score. The user cannot easily determine whether an address was publicly observed, inferred from a company pattern, guessed, or verified. I wanted to create a pipeline where the origin and confidence of every result remained visible.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">User Pain</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Researchers and business owners must move between multiple platforms, reconcile inconsistent records, evaluate questionable contact information, and manually prepare the final dataset for analysis or outreach.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Market Gap</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">There was room for a local, open-source pipeline that combined multi-source collection, normalization, website enrichment, email inference, verification, scoring, and safe export without hiding how each result was produced.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    02 · Approach
                  </div>
                  <h3 className="text-xl font-semibold text-white">Build one auditable pipeline from collection to export.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    I structured ProspectIQ as a sequence of independent stages. Source modules collect publicly available information, a normalization boundary converts the raw responses into one Lead model, and an enrichment layer searches for stronger contact and company signals. Candidate email addresses are evaluated using their source, confidence, domain pattern, and verification result before the strongest candidate is selected.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The final record carries the information required to evaluate it, including email source, email confidence, verification status, company domain, lead score, original platform, and collection timestamp.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Collect public profile information from eight supported source types through a command-line or interactive workflow.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Normalize aliases, values, and source-specific fields into one consistent Lead model without discarding useful extra data.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Analyze linked websites and common contact pages for published email addresses, phone numbers, company information, and domain signals.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Infer possible email addresses from observed company naming patterns and perform optional SMTP verification when the receiving server permits it.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Calculate a documented lead-quality score and export a stable, spreadsheet-safe CSV with explicit provenance and confidence fields.</li>
                  </ul>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    03 · Architecture
                  </div>
                  <h3 className="text-xl font-semibold text-white">A modular pipeline with one normalization boundary.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Each stage depends only on the structured result produced by the stage before it. Source-specific complexity remains inside scraper modules, while the enrichment, scoring, and export layers operate on one consistent Lead model.
                  </p>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#08111f]/60 p-5 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
                    <pre className="whitespace-pre">{`  ┌─────────────────────────────────┐
  │  CLI INPUT                      │
  └────────────────┬────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │  SOURCE SCRAPERS                │
  └────────────────┬────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │  NORMALIZED LEAD MODEL          │
  └────────────────┬────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │  WEBSITE AND DOMAIN ENRICHMENT  │
  └────────────────┬────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │  EMAIL CANDIDATE VERIFICATION   │
  └────────────────┬────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │  LEAD SCORING                   │
  └────────────────┬────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │  CSV EXPORT                     │
  └─────────────────────────────────┘`}</pre>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Collection Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Eight source modules use a shared HTTP layer, centralized configuration, conservative pacing, typed errors, and a declarative source registry.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Normalization Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Lead.from_raw maps aliases, coerces inconsistent data types, preserves unmodeled source fields, and ensures that every downstream stage receives the same record shape.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Enrichment and Scoring</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Website analysis, DNS MX resolution, email-pattern inference, optional SMTP verification, catch-all detection, and additive lead scoring turn raw profile data into an actionable record.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Quality and Delivery</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Rich powers the terminal interface, pytest validates the pipeline without live network dependencies, Ruff and mypy enforce code quality, GitHub Actions test supported environments, and the exporter protects CSV files from formula injection.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    04 · Key Decisions
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">Preserve provenance instead of presenting guesses as facts.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Every selected email address includes an email source, confidence value, and verification state. An address discovered in a public biography is treated differently from one inferred through a company naming pattern.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Use one normalization boundary.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Source modules are allowed to return platform-specific data, but Lead.from_raw is responsible for translating those records into one reliable structure. This prevents platform-specific assumptions from leaking into every later stage.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Keep the source registry as the single source of truth.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The CLI, interactive menu, and source-listing command all read from one declarative registry. Adding another source requires a new module and registry entry rather than changes throughout the application.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Design responsible-use limits into the system.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">ProspectIQ does not solve CAPTCHAs, evade blocks, collect passwords, access private data, or send automated messages. Conservative delays, typed rate-limit errors, optional network features, and local exports keep the pipeline focused on legitimate research.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    05 · Tradeoffs
                  </div>
                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p><span className="font-semibold text-white">Source coverage vs. reliability:</span> supporting eight sources increases the value of the pipeline, but public websites can change structure, introduce login walls, or restrict automated requests. ProspectIQ uses typed errors and source isolation so one failure does not corrupt the entire data model.</p>
                    <p><span className="font-semibold text-white">Usefulness vs. certainty:</span> email-pattern inference can produce valuable candidates, but an inferred address is not the same as an observed or confirmed address. The system preserves that uncertainty instead of reducing every result to a misleading valid-or-invalid label.</p>
                    <p><span className="font-semibold text-white">Enrichment depth vs. responsible restraint:</span> website analysis and optional SMTP verification can improve a record, but the pipeline intentionally stops at access restrictions, rate limits, and challenge pages.</p>
                    <p><span className="font-semibold text-white">Local control vs. hosted convenience:</span> CSV-based local output gives the user ownership and visibility, but it does not provide the dashboards or collaborative workflows of a hosted SaaS product. I prioritized transparency, portability, and extensibility.</p>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    06 · Results
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
                      <div className="text-3xl font-bold text-white">8</div>
                      <div className="mt-1 text-sm text-slate-300">Supported source types</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">272</div>
                      <div className="mt-1 text-sm text-slate-300">Automated tests</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">3</div>
                      <div className="mt-1 text-sm text-slate-300">Python versions tested in CI</div>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    ProspectIQ became a complete lead-intelligence workflow rather than a collection of disconnected scrapers. It can collect records, normalize platform differences, enrich contact and company information, score lead quality, and generate a stable export through one command-line interface.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The resulting system demonstrates practical data engineering, schema design, enrichment logic, testing, error handling, CI configuration, security awareness, and responsible product boundaries in one public Python project.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="https://github.com/davishiggins/prospectiq" target="_blank" rel="noreferrer" className="primary-btn">
                    GitHub Repository
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CadeCaseStudy({ expanded, onToggle }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-sky-300/30 bg-white/[0.04] shadow-soft transition-all duration-300 ${
        expanded ? 'ring-1 ring-sky-300/40 shadow-[0_15px_50px_rgba(56,189,248,0.12)]' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 via-indigo-400/8 to-white/5" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.85))]" />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 text-white shadow-[0_10px_25px_rgba(129,140,248,0.3)]">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs sm:tracking-[0.2em]">
              Deep Dive
            </div>
            <h3 className="mt-1.5 break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
              Full Case Study: Cade
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-sky-300 transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden"
          >
            <div className="relative border-t border-white/10 px-5 pb-6 pt-6 sm:px-6 sm:pb-8">
              <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base">
                A complete breakdown of how I built Cade into a persistent agentic operating system: the continuity problem, memory architecture, retrieval model, reusable Jobs, human-control principles, and the system that carries useful context from one session into the next.
              </p>

              <div className="space-y-6">
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    01 · Problem
                  </div>
                  <h3 className="text-xl font-semibold text-white">A powerful AI should not start every session as a stranger.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Modern AI models can analyze, write, plan, and build at an extremely high level, but their usefulness drops when the context behind the work disappears between sessions. My projects contain decisions, constraints, preferences, reference material, corrections, and unresolved tasks that cannot be reconstructed reliably from a short prompt. Repeatedly explaining that history wastes time and makes output less consistent.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    I needed a system that could preserve durable knowledge outside individual conversations, locate the correct information for each task, and update that knowledge when the work produced something worth remembering.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">User Pain</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Important context was scattered across conversations, project folders, documents, notes, and repositories, forcing the same background and preferences to be explained repeatedly.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Market Gap</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Chat history can preserve conversations, but it does not automatically provide a structured, searchable, and task-aware memory system across multiple projects and recurring workflows.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    02 · Approach
                  </div>
                  <h3 className="text-xl font-semibold text-white">Build a memory system around the work, not a larger prompt.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    I designed Cade around a structured Obsidian vault made of plain Markdown files. Short operating rules load at the beginning of every session, while deeper project knowledge remains available through selective retrieval. This keeps the system oriented without overwhelming the model with every note I have created.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Recurring work is organized through Jobs. Each Job tells Cade which procedure to follow, what quality standard to meet, which references to load, and which lessons from previous attempts should influence the next result. Useful outcomes then return to the vault so the system remains current.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Orient each session with the same identity, operating rules, active priorities, and system map.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Retrieve the smallest useful set of project notes, references, decisions, and constraints for the current task.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Prime recurring work through a Job containing the correct procedure, quality bar, linked context, and durable lessons.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Execute the task with focused context across analytics, development, operations, education, content, and career workflows.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Persist verified outcomes, corrections, decisions, and open work so the next session begins with stronger context.</li>
                  </ul>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    03 · Architecture
                  </div>
                  <h3 className="text-xl font-semibold text-white">Two boot layers. One connected memory system.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Cade separates the instructions that must always remain active from the larger body of knowledge that should only be loaded when relevant. This creates a focused path from system orientation to completed work without treating the entire vault as one oversized prompt.
                  </p>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#08111f]/60 p-5 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
                    <pre className="whitespace-pre">{`  ┌─────────────────────┐
  │  BOOT CONFIG        │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  VAULT INDEX        │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  JOB                │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  LINKED CONTEXT     │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  WORK               │
  └──────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  PERSISTED OUTCOME  │
  └─────────────────────┘`}</pre>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Boot Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">CLAUDE.md defines Cade's identity, operating rules, permission boundaries, and connection to the memory vault.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">System Map</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">VAULT-INDEX.md explains how the vault is organized, identifies active projects and priorities, and directs Cade toward the next relevant source.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Memory Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Obsidian and Markdown store contextual project folders, active priorities, reusable Jobs, daily notes, living profile information, indexes, and connected wikilinks.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Execution Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Claude Code retrieves the appropriate Job and linked context, completes the task, verifies the result, and returns durable outcomes to the vault.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Public Interface</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Next.js, TypeScript, GSAP, Three.js, and Vercel power the public website that documents Cade's operating model without exposing private memory.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    04 · Key Decisions
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">Separate always-on rules from searchable memory.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Only the small set of instructions required for safe and consistent operation loads automatically. Larger project knowledge remains searchable so the system stays focused and avoids unnecessary context.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Retrieve the smallest useful context.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Cade does not attempt to load or summarize the entire vault for every task. It follows indexes and linked references to find the specific information needed for the work in front of it.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Turn recurring work into reusable Jobs.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">A Job stores more than a checklist. It combines procedure, quality expectations, required references, and lessons from previous attempts, allowing repeated work to improve over time.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Keep the human in control.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Persistent context increases usefulness, but it does not automatically increase authority. External communication, sensitive edits, deployments, commits, and other consequential actions remain governed by explicit access and approval boundaries.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    05 · Tradeoffs
                  </div>
                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p><span className="font-semibold text-white">Continuity vs. stale context:</span> persistent memory is only useful when it remains accurate. Completed priorities must leave the active queue, outdated decisions must be corrected, and verified outcomes must replace assumptions.</p>
                    <p><span className="font-semibold text-white">Broad memory vs. context efficiency:</span> a larger vault provides more knowledge, but loading too much information weakens focus. Cade relies on indexes, Jobs, and selective retrieval to balance depth with precision.</p>
                    <p><span className="font-semibold text-white">Automation vs. control:</span> giving an AI access to more workflows can increase productivity, but it can also increase risk. Cade expands capability only when clear permission and verification rules expand with it.</p>
                    <p><span className="font-semibold text-white">Public explanation vs. private information:</span> the public website needs enough technical depth to demonstrate the system's design while keeping personal memory, private project material, employer information, and credentials out of the public experience.</p>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    06 · Results
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
                      <div className="text-3xl font-bold text-white">5</div>
                      <div className="mt-1 text-sm text-slate-300">Operating-loop stages</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">6</div>
                      <div className="mt-1 text-sm text-slate-300">Core memory modules</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">6</div>
                      <div className="mt-1 text-sm text-slate-300">Workflow modes</div>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    Cade created one consistent operating model for work that previously depended on disconnected conversations and manually reconstructed context. It now provides persistent continuity across analytics, development, operations, education, content, and career workflows while keeping retrieval focused and human control explicit.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The project also produced a complete public case-study website that translates a complex memory architecture into an understandable visual system without exposing the private knowledge that makes it personal.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="https://cade.davishiggins.com" target="_blank" rel="noreferrer" className="primary-btn">
                    Live Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="https://github.com/DavisHiggins/cade" target="_blank" rel="noreferrer" className="secondary-btn">
                    GitHub Repository
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function HigginsDigitalCaseStudy({ expanded, onToggle }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-sky-300/30 bg-white/[0.04] shadow-soft transition-all duration-300 ${
        expanded ? 'ring-1 ring-sky-300/40 shadow-[0_15px_50px_rgba(56,189,248,0.12)]' : ''
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-cyan-400/8 to-white/5" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.85))]" />

      <button
        type="button"
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_10px_25px_rgba(56,189,248,0.3)]">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs sm:tracking-[0.2em]">
              Deep Dive
            </div>
            <h3 className="mt-1.5 break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
              Full Case Study: Higgins Digital
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 shrink-0 text-sky-300 transition-transform duration-300 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden"
          >
            <div className="relative border-t border-white/10 px-5 pb-6 pt-6 sm:px-6 sm:pb-8">
              <p className="mb-6 text-sm leading-7 text-slate-300 sm:text-base">
                A full breakdown of how I built Higgins Digital from a personal idea into a polished web development brand: the problem, brand strategy, site architecture, design system, service positioning, and launch-ready execution.
              </p>

              <div className="space-y-6">
                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    01 · Problem
                  </div>
                  <h3 className="text-xl font-semibold text-white">A strong skill set needed a credible business presence.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Higgins Digital started from a simple gap: I was already building high-quality websites and digital tools, but I needed a brand that made the work feel as professional as the output. The goal was to create a digital presence that could communicate trust quickly, explain services clearly, and make the company feel legitimate to business owners, recruiters, and potential clients.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">User Pain</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Small businesses often need better websites, but agency pricing can feel unclear, inflated, or disconnected from the actual value delivered.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Market Gap</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">There was room for a lean, modern web development brand focused on performance, conversion, transparent communication, and full client ownership.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    02 · Approach
                  </div>
                  <h3 className="text-xl font-semibold text-white">Build the brand like a product, not a placeholder.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Rather than treating Higgins Digital as a basic landing page, I built it as a complete brand system. The site needed to show what I build, explain how I work, display pricing clearly, and prove that the same level of polish offered to clients was present in my own company platform.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Created a premium navy and gold visual system that feels professional, sharp, and memorable.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Built a clear service structure around websites, custom platforms, redesigns, integrations, and client ownership.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Designed project sections to show before-and-after improvements, not just screenshots.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Developed concise copy that explains value quickly without sounding generic or inflated.</li>
                    <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" /> Structured the experience around trust, clarity, conversion, and proof of execution.</li>
                  </ul>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    03 · Architecture
                  </div>
                  <h3 className="text-xl font-semibold text-white">Brand, content, and frontend working together.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The site was designed as a full digital business system: brand identity, page structure, service positioning, project proof, calls to action, and responsive frontend execution all working together.
                  </p>
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#08111f]/60 p-5 font-mono text-[11px] leading-6 text-slate-300 sm:text-xs">
                    <pre className="whitespace-pre">{`  ┌─────────────────────────────┐
  │  Brand Strategy + Positioning│
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  Design System + UI Components│
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  Service Pages + Pricing    │
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  Project Proof + Case Studies│
  └──────────────┬──────────────┘
                 ▼
  ┌─────────────────────────────┐
  │  CTA Flow + Quote Requests  │
  └─────────────────────────────┘`}</pre>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Brand Layer</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Naming, positioning, navy/gold palette, logo usage, messaging, and trust-focused service framing.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Frontend</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">React, Vite, responsive components, animation polish, reusable sections, and performance-focused implementation.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Content System</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Service copy, pricing structure, project proof, FAQs, before-and-after comparisons, and conversion-focused calls to action.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Launch Workflow</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">Production-ready site structure, source-code ownership, clean deployment workflow, and scalable future updates.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    04 · Key Decisions
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">Use pricing clarity as a trust signal.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The site presents packages and service ranges clearly so potential clients immediately understand the level of work, expected investment, and value behind each option.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Lead with transformation proof, not vague promises.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">Project sections emphasize before-and-after improvements, stronger user experience, cleaner structure, better trust signals, and a more professional digital presence.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Keep the copy direct and business-focused.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The messaging avoids overused agency language and focuses on what business owners actually care about: credibility, speed, usability, ownership, and conversion.</p>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Treat the brand as a long-term platform.</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-300">The site was structured so Higgins Digital can grow beyond a portfolio page into a real company presence with future case studies, quote flows, client portals, and internal tools.</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    05 · Tradeoffs
                  </div>
                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p><span className="font-semibold text-white">Visual polish vs. performance:</span> the site uses animation and rich visuals, but they need to stay lightweight, responsive, and fast enough to support the brand's performance-first promise.</p>
                    <p><span className="font-semibold text-white">Detailed services vs. simple decision-making:</span> the site explains multiple service types without overwhelming visitors who just want to understand what Higgins Digital can build for them.</p>
                    <p><span className="font-semibold text-white">Personal founder brand vs. company brand:</span> the site needed to benefit from Davis Higgins's credibility while still making Higgins Digital feel like a standalone business.</p>
                    <p><span className="font-semibold text-white">Premium feel vs. accessibility:</span> the dark navy and gold aesthetic needed enough contrast, readable text, and clear interaction states across every screen size.</p>
                  </div>
                </div>

                <div className="glass rounded-[1.75rem] p-5 shadow-soft sm:p-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    06 · Results
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-sky-300/30 bg-sky-400/10 p-5">
                      <div className="text-3xl font-bold text-white">1</div>
                      <div className="mt-1 text-sm text-slate-300">Full company platform</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">5+</div>
                      <div className="mt-1 text-sm text-slate-300">Core service paths</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">60-75%</div>
                      <div className="mt-1 text-sm text-slate-300">Below typical agency quotes</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="text-3xl font-bold text-white">100%</div>
                      <div className="mt-1 text-sm text-slate-300">Client source-code ownership</div>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    Higgins Digital became more than a personal project. It became a professional web development brand with clear service positioning, polished visuals, strong project proof, transparent pricing, and a conversion-focused structure. The result is a company platform that shows what I can build while also serving as a real client acquisition channel.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a href="https://higginsd.com/" target="_blank" rel="noreferrer" className="primary-btn">
                    Live Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const [expandedSkill, setExpandedSkill] = useState(null)
  const [caseStudyExpanded, setCaseStudyExpanded] = useState(false)
  const [hdCaseStudyExpanded, setHdCaseStudyExpanded] = useState(false)
  const [cadeCaseStudyExpanded, setCadeCaseStudyExpanded] = useState(false)
  const [piqCaseStudyExpanded, setPiqCaseStudyExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    // Land at the top of every page. Without this the previous page's scroll
    // offset carries over, dropping the reader into the middle of the new one.
    // 'instant' rather than 'auto' because index.css sets a global
    // `html { scroll-behavior: smooth }` that 'auto' would defer to.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activePage])

  const activeTitle = useMemo(() => {
    const item = NAV_ITEMS.find((nav) => nav.key === activePage)
    return item?.label ?? 'Home'
  }, [activePage])

  const pageAnimation = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.28 },
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <motion.div key="home" {...pageAnimation}>
            <PageShell>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-4 py-7 sm:rounded-[2.5rem] sm:px-8 sm:py-8 lg:px-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" />
                <div className="absolute -left-12 top-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                  <div className="min-w-0">
                    <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-medium text-sky-200 sm:px-4 sm:text-sm">
                      <LineChart className="h-4 w-4 shrink-0" />
                      <span className="break-words">Data Science • Artificial Intelligence • Charlotte, NC</span>
                    </div>

                    <h1 className="max-w-4xl break-words text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                      Hi, I'm <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">Davis Higgins</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-xl sm:leading-8">
                      Data Science student at UNC Charlotte building dashboards, reporting systems, and product-oriented tools that make information clearer, faster, and more useful.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]">
                        REAL-WORLD DATA EXPERIENCE
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]">
                        END-TO-END SYSTEM CREATION
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]">
                        BUSINESS-DRIVEN INSIGHTS
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]">
                        DECISION-FOCUSED MODELING
                      </div>
                    </div>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                      Through coursework, personal projects, and internship experience, I have developed skills in data analytics, data cleaning and preprocessing, statistical modeling, machine learning, data visualization, and data governance.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <button type="button" onClick={() => setActivePage('projects')} className="primary-btn">
                        See Projects
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setActivePage('experience')} className="secondary-btn">
                        Professional Experience
                      </button>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {STATS.map((item) => (
                        <div key={item.label} className="glass rounded-3xl p-5 shadow-soft">
                          <div className="text-2xl font-bold text-white">{item.value}</div>
                          <div className="mt-1 text-sm text-slate-400">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mx-auto w-full max-w-md">
                    <div className="rounded-[2rem] border border-white/10 bg-[#5f7ea4]/95 p-5 shadow-glow">
                      <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#a8b9d5]">
                        <div className="aspect-[4/5] bg-[#a8b9d5]">
                          <img src={headshot} alt="Professional headshot of Davis Higgins" className="h-full w-full object-cover" />
                        </div>
                      </div>

                      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#12203b] p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white">
                            <img src={dhLogo} alt="DH logo" className="h-12 w-12 object-contain" />
                          </div>
                          <div>
                            <div className="text-sm uppercase tracking-[0.35em] text-sky-300">Focus</div>
                            <div className="mt-2 text-base leading-7 text-slate-300">
                              Motivated student looking for opportunities to apply my skills, develop professionally, grow personally, and learn as much as possible.
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                              <img src={kewauneeLogo} alt="Kewaunee Scientific logo" className="h-[50px] w-[50px] object-contain" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm text-slate-400">Current Role</div>
                              <div className="mt-1 break-words text-xl font-semibold leading-snug text-white sm:text-2xl">Data Analyst Intern at Kewaunee Scientific Corporation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Live Updates</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <GitHubActivityStrip />
                  <NowLearningCard />
                  <LiveStatusCard />
                </div>
              </div>
            </PageShell>
          </motion.div>
        )

      case 'experience':
        return (
          <motion.div key="experience" {...pageAnimation}>
            <PageShell reserveRail>
              <SectionHeader
                eyebrow="EXECUTION → BUSINESS IMPACT"
                title="Experience"
                subtitle="Hands-on experience across analytics, operations, and business-facing execution."
              />

              <div className="relative space-y-6 before:absolute before:left-[1.1rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10 sm:before:left-6">
                {EXPERIENCE.map((employer, index) => (
                  <motion.div
                    key={employer.company}
                    id={`exp-${slugify(employer.company)}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="relative scroll-mt-28 pl-12 sm:pl-16"
                  >
                    <div className="absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-sky-300 sm:left-1.5">
                      <Briefcase className="h-4 w-4" />
                    </div>

                    <div className="glass relative overflow-hidden rounded-[2rem] p-5 shadow-soft sm:p-6">
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${employer.accent ?? 'from-white/5 via-white/[0.02] to-transparent'}`} />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.88))]" />

                      <div className="relative">
                        {/* Employer header — one logo per employer */}
                        {/* Logo is taken out of flow so its height can never drive the
                            header row and push the role period away from the company name. */}
                        <div className="relative flex min-h-[3.5rem] items-start justify-between gap-4">
                          <div className="min-w-0 flex-1 pr-24 sm:pr-28">
                            <h3 className="break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
                              {employer.website ? (
                                <a href={employer.website} target="_blank" rel="noreferrer" className="transition hover:text-sky-300">
                                  {employer.company}
                                </a>
                              ) : (
                                employer.company
                              )}
                            </h3>
                            {employer.subtitle ? (
                              <div className="mt-1 text-sm text-slate-400">{employer.subtitle}</div>
                            ) : null}
                          </div>
                          {employer.logo ? (
                            <img
                              src={employer.logo}
                              alt={`${employer.company} logo`}
                              className={`pointer-events-none absolute right-0 top-0 shrink-0 object-contain bg-transparent ${
                                employer.company === 'Kewaunee Scientific Corp.'
                                  ? 'h-11 w-11 sm:h-14 sm:w-14'
                                  : 'h-20 w-20 sm:h-24 sm:w-24'
                              }`}
                            />
                          ) : null}
                        </div>

                        {/* Roles — nested internal timeline when more than one role */}
                        {employer.roles.length > 1 ? (
                          <div className="relative mt-6 space-y-7 pl-7">
                            {employer.roles.map((role, ri) => (
                              <div key={role.title} className="relative">
                                {ri < employer.roles.length - 1 ? (
                                  <span className="absolute -left-[1.4375rem] top-[0.6875rem] -bottom-[2.45rem] w-px bg-white/15" />
                                ) : null}
                                <span className="absolute -left-[1.75rem] top-1.5 h-2.5 w-2.5 rounded-full border border-sky-300/50 bg-sky-400/40 shadow-[0_0_0_3px_rgba(8,17,31,0.65)]" />
                                <RoleBlock role={role} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-5">
                            <RoleBlock role={employer.roles[0]} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PageShell>
          </motion.div>
        )

      case 'projects':
        return (
          <motion.div key="projects" {...pageAnimation}>
            <PageShell reserveRail>
              <SectionHeader
                eyebrow="PRODUCTS → ANALYTICAL SOLUTIONS"
                title="Projects"
                subtitle="Selected work demonstrating how I build, analyze, and translate data into practical tools and insights."
              />

              <div className="space-y-6">
                {PROJECTS.map((project, index) => (
                  <React.Fragment key={project.title}>
                  <motion.div
                    id={`proj-${slugify(project.title)}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.32 }}
                    className="group relative scroll-mt-28 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-soft sm:p-6"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.9))]" />
                    <div className="relative">
                      <div className="mb-2 flex items-start justify-between gap-3 sm:gap-6">
                        <div className="min-w-0 flex-1 pt-1">
                          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs sm:tracking-[0.2em]">
                            {project.tag}
                          </div>
                          <h3 className="mt-3 break-words text-2xl font-semibold leading-tight text-white sm:text-[1.7rem] sm:leading-8">{project.title}</h3>
                        </div>
                        <img
                          src={project.logo}
                          alt={`${project.title} logo`}
                          className={`shrink-0 object-contain bg-transparent ${
                            // Cade and Flowcast are wide wordmarks, not square icons — a
                            // square slot renders them at half the visual weight of the others.
                            project.title === 'Cade' || project.title === 'Flowcast'
                              ? 'h-16 w-28 sm:h-28 sm:w-44'
                              // Kewaunee's mark matches the sizing used on the
                              // Kewaunee employer card in Experience.
                              : project.title === 'Executive Sales & Bidding Analytics Suite'
                              ? 'h-11 w-11 sm:h-14 sm:w-14'
                              : 'h-16 w-16 sm:h-28 sm:w-28'
                          }`}
                        />
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{project.subtitle}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-200/90">{project.description}</p>

                      <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
                        {project.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-300" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {project.stack.map((item) => (
                          <Pill key={item}>{item}</Pill>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {project.primary ? (
                          <a href={project.primary.href} target="_blank" rel="noreferrer" className="primary-btn">
                            {project.primary.label}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                        {project.tertiary ? (
                          <a href={project.tertiary.href} target="_blank" rel="noreferrer" className="secondary-btn">
                            {project.tertiary.label}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                        {project.secondary ? (
                          <a href={project.secondary.href} target="_blank" rel="noreferrer" className="secondary-btn">
                            {project.secondary.label}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                  {project.title === 'Cade' ? (
                    <CadeCaseStudy
                      expanded={cadeCaseStudyExpanded}
                      onToggle={() => setCadeCaseStudyExpanded((v) => !v)}
                    />
                  ) : null}
                  {project.title === 'ProspectIQ' ? (
                    <ProspectIqCaseStudy
                      expanded={piqCaseStudyExpanded}
                      onToggle={() => setPiqCaseStudyExpanded((v) => !v)}
                    />
                  ) : null}
                  {project.title === 'Contender' ? (
                    <CaseStudyDropdown
                      expanded={caseStudyExpanded}
                      onToggle={() => setCaseStudyExpanded((v) => !v)}
                    />
                  ) : null}
                  {project.title === 'Higgins Digital' ? (
                    <HigginsDigitalCaseStudy
                      expanded={hdCaseStudyExpanded}
                      onToggle={() => setHdCaseStudyExpanded((v) => !v)}
                    />
                  ) : null}
                </React.Fragment>
              ))}
              </div>
            </PageShell>
          </motion.div>
        )

      case 'skills':
        return (
          <motion.div key="skills" {...pageAnimation}>
            <PageShell accents reserveRail>
              <SectionHeader
                eyebrow="CAPABILITIES"
                title="Skills"
                subtitle="A full view of my technical stack and where each piece has been applied. Click any skill below to drill into specific tools, projects, and depth of experience."
              />

              <div className="mb-10">
                <h3 id="skills-tech-stack-matrix" className="scroll-mt-28 text-2xl font-semibold text-white">Tech Stack Matrix</h3>
                <p className="mt-2 text-sm text-slate-400">Grouped for fast scanning by recruiters and applicant tracking systems.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Object.entries(SKILLS_MATRIX).map(([group, { icon: Icon, items }]) => (
                    <div key={group} className="glass rounded-[1.5rem] p-5 shadow-soft border-sky-300/10 hover:border-sky-300/25 transition-colors duration-300">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-sky-400/10 p-2.5 text-sky-300 border border-sky-300/20">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="text-base font-semibold text-white">{group}</h4>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {items.map((it) => (
                          <span
                            key={it}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 id="skills-proficiency-drill-down" className="scroll-mt-28 text-2xl font-semibold text-white">Proficiency Drill-Down</h3>
                <p className="mt-2 text-sm text-slate-400">Click any skill to see the tools, libraries, and projects behind it.</p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {SKILLS_PROFICIENCY.map((skill) => (
                    <ProficiencySkill
                      key={skill.name}
                      skill={skill}
                      expanded={expandedSkill === skill.name}
                      onToggle={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
                    />
                  ))}
                </div>
              </div>
            </PageShell>
          </motion.div>
        )

      case 'skills-proof':
        return (
          <motion.div key="skills-proof" {...pageAnimation}>
            <PageShell accents reserveRail>
              <SectionHeader
                eyebrow="PROBLEMS → MEASURABLE RESULTS"
                title="Impact"
                subtitle="Real-world examples of solving complex problems, overcoming constraints, and delivering results."
              />

              <div className="space-y-6">
                {PROOF_OF_SKILLS.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.05 }}
                    id={`impact-${slugify(item.title)}`}
                    className="glass scroll-mt-28 rounded-[2rem] p-5 shadow-soft sm:p-6 border-l-2 border-l-sky-400/20 hover:border-l-sky-400/40 transition-colors duration-300"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-sky-400/10 border border-sky-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                      {item.eyebrow}
                    </div>

                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>

                    {item.outcome ? (
                      <div className="mt-3 flex items-start gap-2 rounded-2xl border border-sky-300/15 bg-sky-400/5 px-4 py-3">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                        <p className="text-sm font-medium leading-6 text-sky-100">{item.outcome}</p>
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.traits.map((trait) => (
                        <Pill key={trait}>{trait}</Pill>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </PageShell>
          </motion.div>
        )

      case 'education':
        return (
          <motion.div key="education" {...pageAnimation}>
            <PageShell accents reserveRail>
              <SectionHeader
                eyebrow="FOUNDATION → TECHNICAL DEVELOPMENT"
                title="Education"
                subtitle="Classroom efficiency, technical development, and the foundation behind my skill set."
              />

              <div className="space-y-10">
                <div>
                  <h3 id="edu-academic-background" className="scroll-mt-28 text-2xl font-semibold text-white">Academic Background</h3>

                  <div className="mt-6 space-y-6">
                    <div className="glass rounded-[2rem] px-4 py-6 shadow-soft sm:px-5 sm:py-7 hover:border-sky-300/20 transition-colors duration-300">
                      <div className="flex items-start gap-3 sm:gap-2.5">
                        <div className="flex h-[70px] w-[70px] shrink-0 items-start justify-center sm:h-[84px] sm:w-[86px]">
                          <img
                            src={unccLogo}
                            alt="UNC Charlotte logo"
                            className="mt-0 h-[48px] w-[70px] object-contain sm:h-[55px] sm:w-[85px]"
                            style={{
                              filter:
                                'brightness(0) saturate(100%) invert(74%) sepia(22%) saturate(1185%) hue-rotate(180deg) brightness(101%) contrast(101%)',
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="break-words text-xl font-semibold leading-tight text-white sm:text-2xl">University of North Carolina at Charlotte</h4>

                          <p className="mt-3 text-sm text-slate-400">
                            B.S. in Data Science • Minor in Artificial Intelligence • Aug 2024 to May 2027
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <Pill>GPA: 3.9</Pill>
                            <Pill>5x Chancellor's List</Pill>
                            <Pill>1x Dean's List</Pill>
                          </div>

                          <p className="mt-6 text-sm leading-7 text-slate-300">
                            Building a technical foundation in analytics, machine learning, statistical thinking, and applied business problem solving while pairing coursework with internships, product development, and independent projects.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-[2rem] px-4 py-6 shadow-soft sm:px-5 sm:py-7 hover:border-sky-300/20 transition-colors duration-300">
                      <div className="flex items-start gap-3 sm:gap-2">
                        <div className="flex h-[60px] w-[70px] shrink-0 items-start justify-center sm:h-[70px] sm:w-[84px]">
                          <img
                            src={cvccLogo}
                            alt="Catawba Valley Community College logo"
                            className="mt-0 h-[48px] w-[48px] object-contain sm:h-[56px] sm:w-[55px]"
                            style={{
                              filter:
                                'hue-rotate(192deg) saturate(135%) brightness(1.18) contrast(1.08) drop-shadow(0 0 2px rgba(125, 211, 252, 0.12))',
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="break-words text-lg font-semibold leading-tight text-white sm:text-xl">Catawba Valley Community College</h4>

                          <p className="mt-3 text-sm text-slate-400">Aug 2022 to May 2024</p>

                          <div className="mt-5 flex flex-wrap gap-2">
                            <Pill>GPA: 4.0</Pill>
                            <Pill>4x President's List</Pill>
                          </div>

                          <p className="mt-6 text-sm leading-7 text-slate-300">
                            Selected for a dual-enrollment program to gain college credits while completing high school.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 id="edu-honors" className="mt-16 scroll-mt-28 text-2xl font-semibold text-white">Honors</h3>

                  <div className="mt-6 space-y-5">
                    <div className="glass rounded-[2rem] p-5 shadow-soft sm:p-7">
                      <div className="flex items-start gap-4 sm:gap-7">
                        <div className="shrink-0 rounded-2xl bg-sky-400/10 p-3 text-sky-300 border border-sky-300/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                          <Medal className="h-6 w-6 sm:h-8 sm:w-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="break-words text-lg font-semibold leading-tight text-white sm:text-xl">Public Anthropology Award for Excellence in Writing on Public Issues</h4>
                          <p className="mt-2 text-sm text-slate-400">Center for a Public Anthropology • Apr 2025</p>

                          <div className="mt-5 flex flex-wrap gap-2">
                            <Pill>Published Work</Pill>
                            <Pill>Storytelling</Pill>
                          </div>

                          <p className="mt-6 text-sm leading-7 text-slate-300">
                            Recognized for excellence in writing on public issues. The publication was selected for its ability to address a public issue through thoughtful, persuasive, and captivating writing.
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            <a
                              href={anthropologyAward}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              View Certification
                              <ExternalLink className="h-4 w-4" />
                            </a>

                            <a
                              href={thecreek}
                              target="_blank"
                              rel="noreferrer"
                              className="secondary-btn"
                            >
                              Publication
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PageShell>
          </motion.div>
        )

      case 'resume':
        return (
          <motion.div key="resume" {...pageAnimation}>
            <PageShell accents>
              <SectionHeader
                eyebrow="SKILLS → PROFESSIONAL READINESS"
                title="Resume"
                subtitle="The fast PDF handoff of my professional resume. For full depth on tools, projects, and proficiencies, head over to the Skills tab."
              />

              <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="glass relative overflow-hidden rounded-[2rem] p-5 shadow-soft self-start sm:p-9">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl" />
                  <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                  <div className="relative flex items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 p-3 text-slate-950 shadow-[0_8px_24px_rgba(56,189,248,0.3)]">
                      <NotebookText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-semibold text-white">Quick Access</h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                        The PDF resume is the fastest scan. The Skills tab is where you'll find the deep technical drill-down: tools, libraries, proficiency by years, and the projects each skill has been applied to.
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300">
                        <Clock className="h-3 w-3 text-sky-300" />
                        Last updated September 2026
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <a href="/docs/davis-resume.pdf" target="_blank" rel="noreferrer" className="primary-btn">
                          <FileText className="h-4 w-4" />
                          Open Resume
                        </a>
                        <button type="button" onClick={() => setActivePage('skills')} className="secondary-btn">
                          Full Skill Set
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[2rem] p-5 shadow-soft sm:p-7 border-sky-300/10 hover:border-sky-300/20 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-white">Resume Highlights</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>Data Science student at UNC Charlotte pursuing a minor in Artificial Intelligence.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>Hands-on dashboard development, reporting automation, and business-facing analytics.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>Built 20+ executive dashboards, 100+ visualizations, and audited 2,000+ CRM records.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>Strong foundation in Python, SQL, R, Power BI, Zoho Analytics, and ML for production use.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </PageShell>
          </motion.div>
        )

      case 'contact':
        return (
          <motion.div key="contact" {...pageAnimation}>
            <PageShell accents>
              <SectionHeader
                eyebrow="CONNECTION → OPPORTUNITY"
                title="Contact"
                subtitle="Direct ways to reach me for opportunities, collaboration, or professional conversations."
              />

              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] sm:p-8"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/12 via-transparent to-indigo-500/10" />
                  <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
                  <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

                  <div className="relative">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Let's Connect
                    </div>

                    <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Direct Links</h3>

                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                      I am actively looking for opportunities to apply my skills, continue developing professionally, and keep building meaningful analytics and product-oriented work.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-200">
                      <Clock className="h-3.5 w-3.5" />
                      Usually responds within 24 hours
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      {CONTACT_LINKS.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <motion.a
                            key={item.label}
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noreferrer' : undefined}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.06 }}
                            whileHover={{ y: -4, scale: 1.015 }}
                            className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f172a]/70 p-5 transition duration-300 hover:border-sky-300/30 hover:bg-[#13203a]/85 hover:shadow-[0_15px_40px_rgba(56,189,248,0.15)]"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-0 transition duration-300 group-hover:opacity-100`} />
                            <div className="relative">
                              <div className="flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-300 transition duration-300 group-hover:scale-110 group-hover:bg-white/10">
                                  <Icon className="h-5 w-5" />
                                </div>
                                <ExternalLink className="h-4 w-4 text-slate-500 transition duration-300 group-hover:text-sky-300" />
                              </div>

                              <div className="mt-5 text-sm uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
                              <div className="mt-2 break-words text-lg font-semibold text-white">{item.value}</div>
                            </div>
                          </motion.a>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </PageShell>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <SEOHead />

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-[size:52px_52px] opacity-[0.04]" />
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className={`absolute inset-0 transition-opacity duration-500 ${ACCENT_PAGES.has(activePage) ? 'opacity-100' : 'opacity-0'}`}>
          <AccentBackdrop />
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08111f]/85 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-4 sm:px-5 lg:px-6">

          {/* Left — identity card, anchored to the far left */}
          <div className="flex items-center justify-self-start">
            <div className="hidden items-center gap-3.5 sm:flex">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white">
                <img src={dhLogo} alt="DH logo" className="h-12 w-12 object-contain" />
              </div>
              <div className="leading-none">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">DAVIS HIGGINS</div>
                <div className="whitespace-nowrap text-sm text-slate-400">Data Analyst | Data Science &amp; AI |</div>
                <div className="whitespace-nowrap text-sm text-slate-400">Web Developer | Digital Creator</div>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white sm:hidden">
              <img src={dhLogo} alt="DH logo" className="h-10 w-10 object-contain" />
            </div>
          </div>

          {/* Center — nav pill centered between the identity card and AI button */}
          <nav className="hidden flex-shrink-0 items-center gap-1.5 justify-self-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 shadow-glow xl:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activePage === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActivePage(item.key)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-white text-slate-950'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right — AI button, anchored to the far right */}
          <div className="flex items-center justify-self-end gap-2.5">
            {/* Desktop AI button */}
            <button
              type="button"
              onClick={() => typeof window.toggleDavisAI === 'function' && window.toggleDavisAI()}
              className="hidden items-center gap-2.5 rounded-full border-2 border-white/75 bg-[#0A1628] px-7 py-3 text-base font-bold text-white transition hover:border-white hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] xl:inline-flex"
              aria-label="Open Davis AI portfolio assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="rgba(125,211,252,0.9)">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>Ask Davis AI</span>
            </button>

            {/* Mobile: active page title */}
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 xl:hidden">
              {activeTitle}
            </span>

            {/* Mobile AI icon button */}
            <button
              type="button"
              onClick={() => typeof window.toggleDavisAI === 'function' && window.toggleDavisAI()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-300 transition hover:bg-white/10 hover:text-sky-200 xl:hidden"
              aria-label="Open Davis AI assistant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white xl:hidden"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[92px] z-40 xl:hidden"
          >
            <div className="mx-4 overflow-hidden rounded-[1.5rem] border border-sky-300/20 bg-[#0a1322]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="p-3">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active = activePage === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => { setActivePage(item.key); setMenuOpen(false) }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? 'bg-white/10 text-white ring-1 ring-sky-300/30'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-sky-300' : 'text-slate-400'}`} />
                      {item.label}
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />}
                    </button>
                  )
                })}
              </div>
              <div className="border-t border-white/5 px-3 pb-3">
                <button
                  type="button"
                  onClick={() => { setActivePage('contact'); setMenuOpen(false) }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-300/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-300/20"
                >
                  <Mail className="h-4 w-4" />
                  Contact Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </main>

      {/* Outside <main> on purpose: keeps the content column untouched, keeps the
          rail out of the presence tree, and gives `fixed` an untransformed
          containing block. `key` gives each page a fresh scrollspy. */}
      {TOC_SECTIONS[activePage] ? (
        <SectionNav key={activePage} sections={TOC_SECTIONS[activePage]} />
      ) : null}
    </div>
  )
}
