export interface VentureItem {
  id: string;
  name: string;
  category: 'Fintech' | 'LegalTech' | 'DevOps' | 'HealthTech' | 'MarTech' | 'GovTech' | 'QualityAI' | 'HRTech' | 'BigData' | 'Media';
  tagline: string;
  description: string;
  coreEngine: string;
  liveUrl: string;
  badge: string;
  accentColor: string;
  metrics: { label: string; value: string };
  features: string[];
  cinematicPrompt: string;
}

export const FLEET_VENTURES: VentureItem[] = [
  {
    id: 'auditmind-ai',
    name: 'AuditMind AI',
    category: 'Fintech',
    tagline: 'Autonomous Ledger Rules & R&D Tax Credit Scanner',
    description: 'Instant IRS Section 41 qualification engine with ASC 730 R&D wage allocation and automated audit risk redlining in the browser.',
    coreEngine: 'Pure Client-Side Ledger Rules + Groq Llama-3.3-70B',
    liveUrl: 'https://auditmind-ai-red.vercel.app',
    badge: 'Fintech & Tax',
    accentColor: '#10b981', // Emerald
    metrics: { label: 'Avg Claim Identified', value: '$42,500' },
    features: ['IRS Section 41 scanner', 'ASC 730 wage matrix', 'Instant audit binder export', 'Onboarding tour + AI copilot'],
    cinematicPrompt: 'Holographic glowing financial ledger in dark glass vault, neon emerald laser scanning corporate tax documents, 3d data streams, 8k cinematic lighting, octane render'
  },
  {
    id: 'contractsentinel-ai',
    name: 'ContractSentinel AI',
    category: 'LegalTech',
    tagline: 'Enterprise OOXML Track-Changes Redliner',
    description: 'Autonomous contract risk assessment and non-destructive DOCX redlining with zero server data transfer.',
    coreEngine: 'Browser OOXML Parser + JSZip + Groq AI',
    liveUrl: 'https://contractsentinel-ai.vercel.app',
    badge: 'Legal & Risk',
    accentColor: '#6366f1', // Indigo
    metrics: { label: 'Review Latency', value: '< 2.4s' },
    features: ['Full OOXML track-changes', 'Indemnification detector', 'Redline diff viewer', 'Client-side zero-retention'],
    cinematicPrompt: 'Futuristic floating legal contract with luminous purple and indigo track-change highlights, holographic security seals, dark minimalist room, 8k cinematic motion'
  },
  {
    id: 'codevortex-sre',
    name: 'CodeVortex SRE',
    category: 'DevOps',
    tagline: 'Log & Trace Root-Cause Triage with AST Diff Engine',
    description: 'Zero-latency incident triage engine converting messy Kubernetes stack traces into verified syntax-valid code diffs.',
    coreEngine: 'Log Classifier + In-Browser AST Diff Engine',
    liveUrl: 'https://codevortex-sre.vercel.app',
    badge: 'DevOps & SRE',
    accentColor: '#06b6d4', // Cyan
    metrics: { label: 'MTTR Reduction', value: '78%' },
    features: ['Distributed trace classifier', 'Synthetic error injection', 'AST diff generator', 'SRE incident copilot'],
    cinematicPrompt: 'Cyberpunk server room with glowing cyan fiber optic cables, floating terminal windows parsing log streams, glitch-free holographic HUD, volumetric fog, 8k'
  },
  {
    id: 'synthmed-ai',
    name: 'SynthMed AI',
    category: 'HealthTech',
    tagline: 'Consultation to Structured SOAP & ICD-10 Coding',
    description: 'Clinical scribe transforming raw patient dialogue into structured SOAP clinical notes with verified ICD-10 and CPT billing codes.',
    coreEngine: 'Clinical Dictation Parser + Medical Ontology Mapper',
    liveUrl: 'https://synthmed-ai.vercel.app',
    badge: 'Healthcare AI',
    accentColor: '#10b981', // Emerald
    metrics: { label: 'Coding Accuracy', value: '99.4%' },
    features: ['EHR-ready SOAP notes', 'ICD-10 & CPT extraction', 'Differential diagnosis', 'HIPAA zero-cloud design'],
    cinematicPrompt: 'Futuristic medical diagnostic suite with floating emerald DNA helix, glowing biometric holographic HUD, high-tech stethoscope, frosted glass surfaces, 8k'
  },
  {
    id: 'adgenesis-ai',
    name: 'AdGenesis AI',
    category: 'MarTech',
    tagline: '50+ Multi-Channel Ad Matrix & Multi-Armed Bandit ROAS',
    description: 'Instantly generates 50+ optimized ad variations across Meta, Google, TikTok, and LinkedIn with dynamic ROAS budget allocation.',
    coreEngine: 'Ad Matrix Generator + Epsilon-Greedy Bandit Optimizer',
    liveUrl: 'https://adgenesis-ai.vercel.app',
    badge: 'Growth & Ads',
    accentColor: '#f43f5e', // Rose
    metrics: { label: 'ROAS Uplift', value: '+3.4x' },
    features: ['50+ multi-platform matrix', 'Multi-armed bandit simulator', 'Dynamic CSV export', 'Interactive creative copilot'],
    cinematicPrompt: 'Giant holographic 3D billboard matrix in a neon-lit Tokyo cyberpunk square, floating glass ad cards animating dynamically, vibrant magenta and rose reflections, 8k'
  },
  {
    id: 'tenderbot-global',
    name: 'TenderBot Global',
    category: 'GovTech',
    tagline: 'Autonomous RFP Compliance & Proposal Drafter',
    description: 'Government contracting intelligence platform extracting RFP requirements, scoring win probabilities, and drafting compliant proposals.',
    coreEngine: 'FAR/DFARS Compliance Scanner + Proposal Engine',
    liveUrl: 'https://tenderbot-global.vercel.app',
    badge: 'GovCon & Bids',
    accentColor: '#10b981', // Emerald
    metrics: { label: 'Proposal Drafting', value: '45 Mins' },
    features: ['FAR/DFARS compliance audit', 'Win-probability scoring', 'Executive brief exporter', 'Bidding assistant drawer'],
    cinematicPrompt: 'Futuristic government intelligence command center, holographic world map with glowing procurement corridors, dark obsidian glass consoles, emerald data pings, 8k'
  },
  {
    id: 'qualicheck-ai',
    name: 'QualiCheck AI',
    category: 'QualityAI',
    tagline: 'Edge Computer Vision & Canvas Defect Metrology',
    description: 'In-browser computer vision metrology detecting microscopic micro-scratches, solder voids, and component misalignments at 60 FPS.',
    coreEngine: 'HTML5 Canvas Edge Vision + Pixel Array Metrology',
    liveUrl: 'https://qualicheck-ai.vercel.app',
    badge: 'Computer Vision',
    accentColor: '#f43f5e', // Rose
    metrics: { label: 'Inference Speed', value: '16ms/frame' },
    features: ['Pixel-level defect bounding', 'Yield rate telemetry', 'Defect frame isolation', 'Metrology copilot drawer'],
    cinematicPrompt: 'Robotic industrial inspection arm scanning a glowing silicon microchip wafer, neon laser grid projecting defect heatmaps, microscopic lens reflections, 8k render'
  },
  {
    id: 'talentpulse-ai',
    name: 'TalentPulse AI',
    category: 'HRTech',
    tagline: 'WASM-Powered Autonomous Technical Assessment',
    description: 'Executes candidate Python code directly in the browser via Pyodide WebAssembly with AST anti-cheat telemetry and code quality scoring.',
    coreEngine: 'Pyodide WASM Runtime + AST Analysis',
    liveUrl: 'https://talentpulse-ai-nine.vercel.app',
    badge: 'Assessment AI',
    accentColor: '#10b981', // Emerald
    metrics: { label: 'WASM Sandbox', value: '0ms Latency' },
    features: ['In-browser Pyodide sandbox', 'AST anti-cheat detection', 'Automated rubric grading', 'Candidate interview copilot'],
    cinematicPrompt: 'Floating holographic code matrix with emerald and teal syntax trees, interactive 3D algorithm puzzle assembling itself, dark glass interface, 8k'
  },
  {
    id: 'datalightning-ai',
    name: 'DataLightning AI',
    category: 'BigData',
    tagline: 'In-Browser DuckDB-WASM & Text-to-SQL Analytics',
    description: 'Ultra-fast SQL analytics processing million-row Parquet and CSV files in browser memory with natural language Text-to-SQL generation.',
    coreEngine: 'DuckDB-WASM Columnar Engine + Text-to-SQL',
    liveUrl: 'https://datalightning-ai.vercel.app',
    badge: 'Data & SQL',
    accentColor: '#06b6d4', // Cyan
    metrics: { label: 'Row Scan Speed', value: '10M rows/s' },
    features: ['DuckDB-WASM columnar engine', 'Natural language to SQL', 'Zero-cloud data privacy', 'Executive brief export'],
    cinematicPrompt: 'Holographic glowing data lake with cyan columnar prisms shifting dynamically, lightning-fast particle query streams, dark reflective water floor, 8k'
  },
  {
    id: 'hyperlocalize-ai',
    name: 'HyperLocalize AI',
    category: 'Media',
    tagline: 'SRT Subtitle Timing & Cultural Translation Studio',
    description: 'Localizes video subtitles across 12+ international markets with automated millisecond audio-timing preservation and cultural idiom adaptation.',
    coreEngine: 'SRT Timestamp Parser + Cultural Localization Engine',
    liveUrl: 'https://hyperlocalize-ai.vercel.app',
    badge: 'Media & Video',
    accentColor: '#f43f5e', // Rose
    metrics: { label: 'Timing Drift', value: '0.00ms' },
    features: ['Millisecond-accurate SRT parser', 'Cultural nuance adaptation', 'Reading speed WPM calculator', 'Studio copilot drawer'],
    cinematicPrompt: 'Cinematic audio-waveform timeline floating in 3D space, neon rose sound frequencies pulsing into multilingual subtitle ribbons, anamorphic lens flare, 8k'
  }
];
