export type TemplateCategory =
  | "All"
  | "3D Scroll"
  | "SaaS & AI"
  | "Cinematic Landing"
  | "E-Commerce"
  | "Dashboards"
  | "Web3 & Crypto"
  | "Creative Agency"
  | "Spatial OS";

export interface TemplateItem {
  id: string;
  name: string;
  category: "3D Scroll" | "SaaS & AI" | "Cinematic Landing" | "E-Commerce" | "Dashboards" | "Web3 & Crypto" | "Creative Agency" | "Spatial OS";
  tag: string;
  thumbnail?: string;
  gradient: string;
  accent: string;
  secondaryAccent: string;
  badge: "Featured" | "God-Level Prompt" | "Cinematic 3D" | "Trending" | "New" | "Pro Starter";
  frames: number;
  fps: number;
  desc: string;
  longDesc: string;
  features: string[];
  techStack: string[];
  godLevelPrompt: string;
  mockStats: { label: string; value: string }[];
  particleMode: "cyberpunk" | "quantum" | "galaxy" | "matrix" | "luxury" | "mesh" | "audio" | "energy";
}

export const TEMPLATES: TemplateItem[] = [
  // ── 1. 3D SCROLL & PARALLAX ─────────────────────────────────────
  {
    id: "cyberpunk-kinetic-watch",
    name: "Cyberpunk Kinetic Watch Atelier",
    category: "3D Scroll",
    tag: "3D Parallax Scrub",
    gradient: "from-emerald-950 via-[#050b14] to-zinc-950",
    accent: "#22c55e",
    secondaryAccent: "#4ade80",
    badge: "God-Level Prompt",
    frames: 480,
    fps: 60,
    desc: "Luxury mechanical timepiece with 360-degree exploded gear assembly, titanium case reflections, and micro-interactions on scroll.",
    longDesc:
      "A flagship scroll experience engineered for luxury and hardware products. Features exploded gear sub-assemblies, titanium case lighting reflections, sapphire crystal refraction, and silky frame-by-frame parallax scrolling.",
    features: [
      "480-Frame Smooth Scroll Interpolation",
      "Exploded Sub-Assembly Mechanical Breakdowns",
      "Reactive Light Beam Shaders with Gyro Parallax",
      "Zero Three.js Overhead — Native HTML5 Canvas Scrub",
      "Haptic Audio Click SFX on Step Progression",
      "Dynamic Bezel Texture & Dial Swatch Switcher",
    ],
    techStack: ["React 19", "HTML5 Canvas", "Tailwind CSS v4", "Web Audio API", "Lucide Icons"],
    godLevelPrompt: `Create a cinematic, dark luxury 3D scroll website for a high-end kinetic timepiece called 'Aegis Chrono-X'.
Structure:
1. Hero Section: Fullscreen dark obsidian background with an exploded 360-degree titanium watch assembly rotating synchronously with user scroll wheel. Headline: 'PRECISION AT THE SPEED OF LIGHT' with an emerald neon gradient text clip.
2. Interactive Layer Scrub: As user scrolls from 0% to 40%, the sapphire crystal lifts, gears detach in 3D parallax, and glowing tourbillon ticks with real-time audio ticks.
3. Materials Showcase: 3D interactive dial switcher toggling Matte Carbon, Damascus Steel, and Emerald Grade-5 Titanium.
4. Technical Spec Deck: Bento grid showcasing 72-hour power reserve, 300m water resistance, and silicon escapement with live telemetry dials.
5. Reservation Drawer: Slide-out VIP reservation modal with instant Stripe deposit and Apple Pay integration.
Aesthetics: Deep zinc #050811 base, glowing emerald #22c55e accents, liquid-glass cards with 1px translucent borders, Monospace telemetry labels, and ultra-smooth 60fps canvas frame scrub.`,
    mockStats: [
      { label: "Frame Count", value: "480 frames" },
      { label: "Scroll Latency", value: "< 4ms" },
      { label: "Asset Footprint", value: "1.2 MB WebP" },
    ],
    particleMode: "cyberpunk",
  },
  {
    id: "zenith-spatial-headset",
    name: "Zenith Spatial AR Headset",
    category: "3D Scroll",
    tag: "Vision Pro / AR",
    gradient: "from-emerald-950 via-zinc-950 to-[#020617]",
    accent: "#86efac",
    secondaryAccent: "#22c55e",
    badge: "Cinematic 3D",
    frames: 540,
    fps: 60,
    desc: "Next-gen spatial AR computing headset with interactive micro-OLED optical layers, LiDAR mesh, and spatial audio field diagrams.",
    longDesc:
      "Experience next-generation spatial computing interface. Users scroll to glide through micro-OLED optical layers, carbon fiber headband ergonomics, and spatial audio field depth maps.",
    features: [
      "540-Frame Dual Eye Micro-OLED Scrub",
      "Spatial Mesh & LiDAR Depth Visuals",
      "Interactive FOV & Resolution Slider",
      "One-Click WebXR Browser Emulation",
      "Volumetric Sound Wave Simulator",
      "Dynamic Thermal Flow Particle Paths",
    ],
    techStack: ["React 19", "Three.js / Canvas", "Tailwind CSS v4", "Framer Motion", "Vite"],
    godLevelPrompt: `Build a spatial computing product showcase for 'Zenith Spatial One' with Apple Vision Pro caliber visual polish.
Visual Narrative:
- Dark glassmorphism background with ambient spatial audio floating dust motes.
- Hero: 3D headset floats in zero-gravity with dynamic dual 4K micro-OLED lens glow that tracks mouse cursor trajectory.
- Scroll Phase 1: Exploded view of pancake lens array, custom silicon dual-chip architecture, and eye-tracking IR sensor matrix.
- Scroll Phase 2: User enters the 'Passthrough Simulator' with interactive depth mesh overlay, toggling between 120Hz Spatial Audio mode and Workstation mode.
- Interactive Spec Matrix: Dynamic slider comparing latency (<12ms), pixel density (64 PPD), and weight (310g).
- Final CTA: 'Enter the Spatial Frontier' with magnetic hover button and live demo booking calendar.`,
    mockStats: [
      { label: "Display Spec", value: "4K Dual Micro-OLED" },
      { label: "Weight Spec", value: "310g Carbon" },
      { label: "Refresh Rate", value: "120Hz Spatial" },
    ],
    particleMode: "galaxy",
  },
  {
    id: "titanium-ev-supercar",
    name: "Apex Hyperion EV Supercar",
    category: "3D Scroll",
    tag: "Automotive / 3D",
    gradient: "from-[#020d08] via-zinc-950 to-black",
    accent: "#4ade80",
    secondaryAccent: "#22c55e",
    badge: "Featured",
    frames: 600,
    fps: 60,
    desc: "Electric hypercar launch page with wind-tunnel aerodynamics, 0-60 dynamic acceleration curve, and chassis X-ray.",
    longDesc:
      "A breathtaking automotive experience with 0-60 dynamic acceleration scrub, aero air tunnel simulation, carbon tub stress analysis, and custom config reservation builder.",
    features: [
      "600-Frame Aerodynamic Wind Tunnel Scrub",
      "Interactive 0-60 MPH Acceleration Chart (1.89s)",
      "Battery Pack & Dual Motor X-Ray Layer",
      "VIP Reservation & Stripe Deposit Flow",
      "Active Aerodynamic Wing Angle Controller",
      "Custom Interior Leather & Wheel Configurator",
    ],
    techStack: ["React 19", "HTML5 Canvas", "Framer Motion", "Recharts", "Tailwind CSS"],
    godLevelPrompt: `Design a hyper-cinematic automotive launch experience for 'Apex Hyperion' — a 1,900 HP electric hypercar.
Key Sections:
1. Wind Tunnel Hero: 600-frame video scroll scrub showing aerodynamic streaklines flowing over carbon fiber bodywork in a dark wind tunnel with glowing green laser headlights.
2. Powertrain X-Ray: Scroll-triggered layer fade showing the 120kWh solid-state battery pack and quad-motor torque vectoring system.
3. Dyno Acceleration Simulator: User clicks 'Launch Mode' — screen shakes with CSS vibration, audio revs, and a real-time Recharts graph plots 0-60 mph in 1.89s.
4. Interactive 3D Configurator: Live color picker (Obsidian Black, Neon Emerald, Liquid Titanium) updating wheel finishes and aero package.
5. Delivery Reservation: Clean high-converting Stripe checkout modal with real-time production queue counter.`,
    mockStats: [
      { label: "0-60 MPH", value: "1.89s" },
      { label: "Range", value: "520 Miles" },
      { label: "Aero Drag", value: "0.208 Cd" },
    ],
    particleMode: "cyberpunk",
  },
  {
    id: "deep-sea-bioluminescence",
    name: "Abyssal Bio-Synth Submersible",
    category: "3D Scroll",
    tag: "Marine Tech / 3D",
    gradient: "from-[#021f15] via-[#050b14] to-black",
    accent: "#2dd4bf",
    secondaryAccent: "#22c55e",
    badge: "New",
    frames: 420,
    fps: 60,
    desc: "Deep ocean exploration vessel with bioluminescent organism tracking and atmospheric pressure depth gauge.",
    longDesc:
      "Descend into the Mariana Trench with scroll-controlled depth gauges. Features bioluminescent particle lighting, pressure hull stress telemetry, and scientific sonar mapping visuals.",
    features: [
      "420-Frame Depth Descent Scroll",
      "Real-Time Depth Gauge (0m to 11,000m)",
      "Bioluminescent Light Shader Reactions",
      "Sonar Pulse Sound Wave Visualizer",
      "Hydrothermal Vent Exploration Mode",
    ],
    techStack: ["React 19", "Canvas 2D", "Tailwind CSS", "Web Audio"],
    godLevelPrompt: `Generate an immersive marine exploration site for 'Abyssal Deep Explorer'.
Visuals:
- As the user scrolls, the background smoothly darkens from cyan coastal waters to inky abyssal black (depth gauge counts down to 11,000 meters).
- Floating 3D submersible with glowing sonar beams illuminating passing bioluminescent deep-sea creatures.
- Interactive sonar audio click triggered on scroll.
- Spec cards showing titanium pressure hull ratings, robotic arm dexterity, and 4K stereoscopic cameras.
- Clean scientific typography, monospace coordinates, and emerald glowing HUD telemetry.`,
    mockStats: [
      { label: "Max Depth", value: "11,000 m" },
      { label: "Hull Spec", value: "Grade-5 Titanium" },
      { label: "Battery", value: "72h Submerged" },
    ],
    particleMode: "quantum",
  },

  // ── 2. SAAS & AI CO-PILOTS ──────────────────────────────────────
  {
    id: "nova-ai-code-copilot",
    name: "Nova AI Code Copilot & IDE",
    category: "SaaS & AI",
    tag: "Full-Stack SaaS",
    gradient: "from-zinc-950 via-emerald-950/40 to-black",
    accent: "#4ade80",
    secondaryAccent: "#22c55e",
    badge: "God-Level Prompt",
    frames: 360,
    fps: 60,
    desc: "Autonomous developer platform with live playground, multi-tab IDE, terminal streaming, and Stripe subscription billing.",
    longDesc:
      "Engineered for devtools and agentic AI startups. Ships with built-in code editor simulator, real-time SSE token stream visualizer, client-side AES-256 API key vault, and Stripe subscription portal.",
    features: [
      "Streaming AI Code Generation Simulator",
      "Client-Side AES-256 BYOK Vault Encryption",
      "Stripe Customer Portal & Webhook Handlers",
      "Supabase Auth & PostgreSQL Row-Level Security",
      "Multi-Model Switcher (Claude 3.7, GPT-4.5, DeepSeek R1)",
      "Instant 1-Click Cloudflare Edge Deployment",
    ],
    techStack: ["TanStack Start", "Tailwind CSS v4", "Supabase", "Stripe API", "Monaco Editor"],
    godLevelPrompt: `Build a production-ready, dark-mode developer platform SaaS landing page & dashboard for 'Nova AI'.
Features:
1. Liquid-Glass Navbar: Signhify logo, feature links, real-time AI credit pill ($5/5 credits to $200/300 credits), and GitHub star counter.
2. Interactive Hero IDE: Dual-pane interface with simulated syntax-highlighted code editor on the left and live streaming AI agent terminal on the right.
3. BYOK AES-256 Key Vault: Interactive client-side encryption preview for OpenAI, Anthropic, and DeepSeek keys.
4. Model Comparison Benchmark: Real-time speed comparison bar charts for code generation latency, unit test coverage, and token throughput.
5. Interactive Billing Calculator: Sliders for seats, monthly AI generation credits, and private agent swarms with instant Stripe Checkout link.
Styling: Deep obsidian #030712 background, neon green #22c55e accents, JetBrains Mono font, and slick animated borders.`,
    mockStats: [
      { label: "Auth Ready", value: "Supabase RLS" },
      { label: "Checkout", value: "Stripe Billing" },
      { label: "Deployment", value: "Cloudflare Edge" },
    ],
    particleMode: "matrix",
  },
  {
    id: "apex-swarm-ai-orchestrator",
    name: "Apex Swarm AI Orchestrator",
    category: "SaaS & AI",
    tag: "Agent Control",
    gradient: "from-black via-emerald-950/50 to-zinc-950",
    accent: "#22c55e",
    secondaryAccent: "#86efac",
    badge: "Featured",
    frames: 300,
    fps: 60,
    desc: "Real-time multi-agent supervisor dashboard with telemetry, DAG execution trees, and token analytics.",
    longDesc:
      "Enterprise command center for multi-agent autonomous swarms. Track task execution trees, token burn rates, memory retrieval latency, and model cost allocation across your fleet.",
    features: [
      "Real-Time Agent DAG Graph Visualizer",
      "Token Burn & Latency Telemetry Gauges",
      "Multi-Tenant Workspace Permissions",
      "Instant Human-in-the-Loop Interventions",
      "Automated Git PR & CI/CD Pipeline Triggers",
    ],
    techStack: ["React 19", "TanStack Table", "Tailwind CSS", "Recharts", "Lucide"],
    godLevelPrompt: `Create an enterprise multi-agent swarm orchestration dashboard for 'Apex Swarm'.
Key Components:
- Top Bar: Workspace switcher, active fleet status (6 Autonomous Swarms Active), token burn rate ($0.0042/sec), and emergency kill-switch.
- Main Canvas: Interactive DAG (Directed Acyclic Graph) showing multi-agent workflow: Planner -> Researcher -> Coder -> QA Tester -> Deployer with glowing data pulses along nodes.
- Right Telemetry Drawer: Real-time latency waterfall chart, memory cache hit ratio (94.2%), and error rate monitor.
- Human Approval Modal: Interactive diff review card allowing one-click approve, edit, or reject for AI-generated code PRs.
- Dark theme, emerald status indicators, monochrome bento cards, and responsive mobile view.`,
    mockStats: [
      { label: "Active Agents", value: "6 Swarms" },
      { label: "Telemetry Latency", value: "< 15ms" },
      { label: "Export Formats", value: "OpenTelemetry / JSON" },
    ],
    particleMode: "cyberpunk",
  },
  {
    id: "synthetix-voice-ai-canvas",
    name: "Synthetix Real-Time Voice AI",
    category: "SaaS & AI",
    tag: "Voice / WebRTC",
    gradient: "from-[#081810] via-black to-[#050b14]",
    accent: "#34d399",
    secondaryAccent: "#10b981",
    badge: "Trending",
    frames: 340,
    fps: 60,
    desc: "Ultra-low latency conversational voice AI platform with audio waveform shaders and live phone agent testing.",
    longDesc:
      "Next-generation voice AI platform starter. Includes WebRTC audio streaming, dynamic audio visualizer sphere, latency benchmarking (<300ms roundtrip), and CRM integration webhooks.",
    features: [
      "Interactive 3D Audio Visualizer Sphere",
      "Sub-300ms Roundtrip Voice Latency Simulator",
      "Multi-Language Accent & Tone Dial",
      "Twilio / WebRTC Telephony Connector",
      "Real-Time Sentiment & Transcript Waterfall",
    ],
    techStack: ["React 19", "Web Audio API", "Tailwind CSS", "WebSockets"],
    godLevelPrompt: `Develop a high-converting voice AI platform website for 'Synthetix Audio AI'.
Features:
- Hero: Interactive 3D glowing sphere that vibrates and pulses in response to user microphone voice or preset voice samples (Female Professional, Male Energetic, British Support).
- Live Playground: User can speak into browser mic, receive simulated sub-250ms voice replies with real-time waveform oscillations and live transcript waterfall.
- Feature Grid: Zero-shot voice cloning in 3 seconds, 99.4% intent accuracy, 50+ languages, and SOC2 Type II compliance.
- Interactive ROI Calculator: Compare call center cost ($4.50/min) vs Synthetix AI ($0.05/min).
- Emerald and dark carbon styling with glowing audio wave animations.`,
    mockStats: [
      { label: "Latency", value: "240ms Roundtrip" },
      { label: "Voice Variety", value: "120+ Accents" },
      { label: "Intent Accuracy", value: "99.4%" },
    ],
    particleMode: "audio",
  },
  {
    id: "vectorflow-rag-pipeline",
    name: "VectorFlow Neural RAG Engine",
    category: "SaaS & AI",
    tag: "Enterprise AI",
    gradient: "from-zinc-950 via-[#031c12] to-black",
    accent: "#6ee7b7",
    secondaryAccent: "#059669",
    badge: "Pro Starter",
    frames: 320,
    fps: 60,
    desc: "High-throughput vector database and hybrid semantic search engine for enterprise document intelligence.",
    longDesc:
      "Enterprise RAG infrastructure landing page. Features interactive 3D embedding cluster visualizer, semantic chunking simulator, and hybrid dense/sparse vector search comparison.",
    features: [
      "3D Vector Embedding Cluster Explorer",
      "Semantic Chunking & Parsing Visualizer",
      "Hybrid BM25 + Dense Search Latency Benchmarks",
      "100M+ Vector Scale Simulator",
      "Python / TypeScript SDK Code Snippets",
    ],
    techStack: ["TanStack Start", "Three.js", "Tailwind CSS", "Prisma"],
    godLevelPrompt: `Build a developer-first website for 'VectorFlow' — an ultra-fast vector search & RAG engine.
Key Elements:
- Hero: 3D point cloud of 5,000 vector embeddings rotating in space; hover on any cluster highlights semantic relationships with connecting glowing laser lines.
- Interactive Search Bar: User types 'quarterly financial risk' -> Visualizer filters clusters in real-time, showing similarity score (0.942) and raw text citation cards.
- Architecture Flow: Visual pipeline from PDF Ingestion -> Hybrid Chunking -> Qdrant/Pinecone Vector Indexing -> LLM Answer Synthesis.
- Benchmark Table: Query latency vs Milvus and Pinecone.
- Clean dark aesthetic, emerald nodes, and copyable curl/python code snippets.`,
    mockStats: [
      { label: "QPS Capacity", value: "50,000 req/s" },
      { label: "P99 Latency", value: "1.4 ms" },
      { label: "Recall Rate", value: "99.8%" },
    ],
    particleMode: "mesh",
  },

  // ── 3. CINEMATIC 3D LANDING PAGES ───────────────────────────────
  {
    id: "orbital-quantum-compute",
    name: "Orbital Quantum Cloud",
    category: "Cinematic Landing",
    tag: "Deep Tech",
    gradient: "from-black via-zinc-950 to-emerald-950",
    accent: "#86efac",
    secondaryAccent: "#22c55e",
    badge: "God-Level Prompt",
    frames: 520,
    fps: 60,
    desc: "Deep tech quantum compute platform with particle physics, cryo-chamber 3D visuals, and dark glassmorphic layout.",
    longDesc:
      "A high-conversion landing page crafted for deep tech, aerospace, and AI infrastructure ventures. Dynamic particles respond to mouse cursor acceleration with crisp monochrome typography.",
    features: [
      "GPU-Accelerated Particle Canvas",
      "Interactive Qubit Coherence Graph",
      "Interactive Benchmark Comparisons",
      "High-Conversion Demo Request Funnel",
      "Superconducting Dilution Refrigerator 3D Flythrough",
    ],
    techStack: ["React 19", "Framer Motion", "Tailwind CSS v4", "Vite"],
    godLevelPrompt: `Create a cinematic deep tech landing page for 'Orbital Quantum Systems'.
Visual Narrative:
- Hero: Dilution refrigerator chandelier rendered in deep black and liquid emerald with 3D scroll scrub showing trapped ions and laser cooling beams.
- Particle Physics: 3,000 glowing particles on background canvas that swirl away from user cursor and snap back into qubit lattice formations.
- Interactive Simulator: User toggles gate-based vs quantum annealing algorithms to view simulated molecular folding speedups.
- Cryo-Cooling Telemetry: Live temperature readout ticking at 0.015 Kelvin with liquid helium pressure indicators.
- High-end dark aesthetic, Outfit typography, glowing green laser highlights, and lead capture booking modal.`,
    mockStats: [
      { label: "Lighthouse Score", value: "99/100" },
      { label: "Frame Rate", value: "60 FPS Locked" },
      { label: "Qubit Fidelity", value: "99.98%" },
    ],
    particleMode: "quantum",
  },
  {
    id: "hyperion-space-launch",
    name: "Hyperion Orbital Propulsion",
    category: "Cinematic Landing",
    tag: "Aerospace / 3D",
    gradient: "from-[#030e08] via-[#02050e] to-black",
    accent: "#4ade80",
    secondaryAccent: "#16a34a",
    badge: "Cinematic 3D",
    frames: 580,
    fps: 60,
    desc: "Next-generation orbital rocket launch system with stage separation 3D scrub and trajectory telemetry.",
    longDesc:
      "Aerospace flagship product launch page. Features multistage rocket separation on scroll, orbital payload trajectory calculators, and methalox engine nozzle thermal glow shaders.",
    features: [
      "580-Frame Multistage Separation Scrub",
      "Atmospheric Ascent Telemetry HUD",
      "Interactive Payload Orbit Calculator",
      "Rocket Engine Gimbal Angle Controller",
      "Live Mission Launch Countdown Clock",
    ],
    techStack: ["React 19", "HTML5 Canvas", "Tailwind CSS", "Framer Motion"],
    godLevelPrompt: `Build a futuristic aerospace launch website for 'Hyperion Heavy Launch Vehicle'.
Design Architecture:
1. Hero Launch Scrub: Fullscreen 580-frame scroll animation starting at Cape Canaveral pad, blasting through clouds with Mach 3 shock diamonds, and booster separation at 70km altitude.
2. Mission Telemetry Overlay: Speed (km/h), Altitude (km), Dynamic Pressure (Max-Q), and Engine Thrust (kN) updating in real-time as user scrubs scroll.
3. Payload Bay Visualizer: 3D interactive satellite dispenser showing CubeSat constellation deployment.
4. Launch Manifest Schedule: Interactive mission timeline with countdown clocks and live stream status.
5. High-contrast dark obsidian background, emerald telemetry glow, monospace coordinate markers.`,
    mockStats: [
      { label: "Payload to LEO", value: "45,000 kg" },
      { label: "Thrust", value: "22,000 kN" },
      { label: "Reusability", value: "100% Rapid" },
    ],
    particleMode: "galaxy",
  },
  {
    id: "monolith-luxury-architecture",
    name: "Monolith Spatial Architecture",
    category: "Cinematic Landing",
    tag: "Architecture / Luxury",
    gradient: "from-[#0c140f] via-zinc-950 to-[#05080e]",
    accent: "#a7f3d0",
    secondaryAccent: "#059669",
    badge: "Featured",
    frames: 460,
    fps: 60,
    desc: "Brutalist architectural studio showcase with dynamic sunlight shadows, wireframe structural overlays, and floorplan 3D scrub.",
    longDesc:
      "Ultra-premium architectural atelier experience. Explore museum-grade concrete residences with time-of-day solar shadows, materials breakdown, and panoramic virtual tours.",
    features: [
      "460-Frame Day-to-Night Sun Shadow Scrub",
      "Interactive Concrete & Timber Material Texture Viewer",
      "3D Floorplan Multi-Level Exploder",
      "Private Commission Inquiry Concierge",
      "Bespoke Soundscape with Ambient Acoustics",
    ],
    techStack: ["React 19", "Canvas 2D", "Tailwind CSS v4", "Framer Motion"],
    godLevelPrompt: `Create an editorial luxury architectural atelier website for 'Monolith Spatial Design'.
Atmosphere:
- Ultra-refined minimalist brutalism with raw concrete textures, brushed titanium, and warm ambient emerald lighting.
- Hero: 3D cantilevered cliffside residence with time-of-day solar slider moving sun shadows across board-formed concrete walls in real time.
- Floorplan Explorer: Click to explode multi-level structural blueprints in 3D perspective with square footage and material annotations.
- Project Gallery: Masonry grid of high-resolution architectural photography with curtain-wipe transitions.
- Private Client Intake: Elegant, friction-free commission inquiry form with budget and location selectors.`,
    mockStats: [
      { label: "Projects Built", value: "48 Global" },
      { label: "Awards Won", value: "19 Architectural" },
      { label: "Materials", value: "Ultra-High Concrete" },
    ],
    particleMode: "luxury",
  },

  // ── 4. INTERACTIVE 3D E-COMMERCE ────────────────────────────────
  {
    id: "vortex-wireless-audio",
    name: "Vortex Spatial Audio Headphones",
    category: "E-Commerce",
    tag: "Hardware / D2C",
    gradient: "from-zinc-900 via-black to-emerald-950",
    accent: "#22c55e",
    secondaryAccent: "#4ade80",
    badge: "God-Level Prompt",
    frames: 420,
    fps: 60,
    desc: "High-fidelity acoustic hardware with exploded 3D component view, acoustic frequency response curve, and instant checkout drawer.",
    longDesc:
      "D2C hardware product launch template. Includes 3D spatial acoustics demo, acoustic frequency response curve visualizer, variant swatch picker, and frictionless slide-out checkout.",
    features: [
      "Scroll-Controlled Driver & Diaphragm Reveal",
      "Interactive Frequency Response Curve (10Hz - 45kHz)",
      "Multi-Color Finish Swatch Switcher (Obsidian, Emerald, Frost)",
      "Slide-Over Cart & Instant Apple Pay / UPI / Stripe",
      "Active Noise Cancellation (ANC) Sound Isolation Simulator",
    ],
    techStack: ["TanStack Start", "Tailwind CSS v4", "Stripe Checkout", "Web Audio API"],
    godLevelPrompt: `Design an Apple/Sony-level D2C hardware e-commerce store for 'Vortex Pro Wireless Audio'.
Architecture:
1. Fullscreen Hero: 360-degree floating headphones that rotate and separate into 50mm beryllium drivers, memory foam earcups, and dual ANC microphones as the user scrolls.
2. Interactive ANC Mode Switcher: Click 'Transparency' vs 'Silent Void' to hear audio change with real-time spectrum visualizer.
3. Finish Customizer: Smooth 3D color morph between Carbon Black, Cyber Emerald, and Lunar Silver with instant stock counter.
4. Product Specs Accordion: 60-hour battery life, lossless LDAC codec, Bluetooth 5.4 multi-point pairing.
5. Cart Drawer: Seamless slide-out bag with 1-click Stripe, UPI, and Apple Pay checkout.`,
    mockStats: [
      { label: "Conversion Lift", value: "+38%" },
      { label: "Driver Size", value: "50mm Beryllium" },
      { label: "Checkout Speed", value: "< 2s Instant" },
    ],
    particleMode: "audio",
  },
  {
    id: "lumina-holographic-display",
    name: "Lumina Holographic Lightfield",
    category: "E-Commerce",
    tag: "Spatial Hardware",
    gradient: "from-[#04160d] via-black to-[#050f14]",
    accent: "#34d399",
    secondaryAccent: "#059669",
    badge: "New",
    frames: 450,
    fps: 60,
    desc: "Glasses-free holographic 3D display for 3D creators, digital artists, and spatial computing designers.",
    longDesc:
      "Showcase futuristic hardware with holographic depth simulation. Visitors can tilt their mouse to preview genuine parallax depth, swap 3D models in real-time, and place pre-orders.",
    features: [
      "Simulated Holographic 3D Parallax on Mouse Move",
      "Interactive Model Swapper (3D Skull, Engine, Sneaker)",
      "Unity & Blender Export Plugin Integration Card",
      "Tiered Pre-Order Pricing with Limited Early-Bird Badges",
    ],
    techStack: ["React 19", "Three.js", "Tailwind CSS", "Stripe"],
    godLevelPrompt: `Build a futuristic hardware product page for 'Lumina 3D Lightfield Display'.
Visuals:
- Central 3D display frame containing an interactive holographic floating green wireframe crystal that tilts and shows true perspective parallax as the user moves their cursor.
- Model Switcher: User can select 'Robotic Heart', 'Cyber Sneaker', or 'Voxel World' to see hologram morph in real time.
- Creator Workflow: Interactive integration demo for Unreal Engine 5, Blender, and WebXR.
- Tier Selector: Standard 16" ($1,299), Studio 32" ($2,999), and Enterprise 65" ($7,999) with Stripe deposit flow.
- Dark minimalist aesthetic with vibrant emerald and holographic cyan luminescence.`,
    mockStats: [
      { label: "Lightfield Views", value: "100 Synced" },
      { label: "Refresh Rate", value: "144 Hz" },
      { label: "Color Gamut", value: "99% DCI-P3" },
    ],
    particleMode: "mesh",
  },
  {
    id: "chronos-luxury-sneaker",
    name: "Chronos Carbon Fiber Runner",
    category: "E-Commerce",
    tag: "Footwear / D2C",
    gradient: "from-[#07130c] via-[#05070a] to-black",
    accent: "#4ade80",
    secondaryAccent: "#15803d",
    badge: "Trending",
    frames: 380,
    fps: 60,
    desc: "Ultra-lightweight 3D printed carbon fiber running shoe with cushion energy return simulator and size finder.",
    longDesc:
      "High-energy footwear D2C template. Features dynamic 3D sole flex simulation, exploded lattice cushioning view, interactive size recommendation engine, and quick checkout.",
    features: [
      "380-Frame Exploded Lattice Sole Scrub",
      "Energy Return Flex Force Simulator",
      "Interactive Size & Fit Recommendation Calculator",
      "Limited Drop Countdown & Notification Drawer",
    ],
    techStack: ["TanStack Start", "Tailwind CSS", "Framer Motion", "Stripe"],
    godLevelPrompt: `Create an ultra-modern D2C footwear launch site for 'Chronos Carbon-X Runner'.
Features:
- Hero: 3D running shoe floating in air with scroll-scrubbed rotation showing the 3D-printed titanium-infused lattice midsole and breathable mesh upper.
- Flex Simulator: Interactive slider demonstrating energy return at 100N, 300N, and 600N strike force with dynamic deformation graphics.
- Colorway Switcher: Midnight Neon, Emerald Stealth, Arctic White with live inventory stock indicator (Only 14 pairs left).
- Size Selector: Smart unit converter (US/UK/EU) with foot width guide.
- Frictionless slide-out cart with Apple Pay and Stripe.`,
    mockStats: [
      { label: "Shoe Weight", value: "185 grams" },
      { label: "Energy Return", value: "88.4%" },
      { label: "Material", value: "100% Recycled" },
    ],
    particleMode: "cyberpunk",
  },

  // ── 5. DASHBOARDS & COMMAND CENTERS ─────────────────────────────
  {
    id: "solaris-renewable-energy-grid",
    name: "Solaris Renewable Energy Grid",
    category: "Dashboards",
    tag: "IoT & Utilities",
    gradient: "from-zinc-950 via-emerald-950/40 to-black",
    accent: "#86efac",
    secondaryAccent: "#22c55e",
    badge: "God-Level Prompt",
    frames: 320,
    fps: 60,
    desc: "Live solar and wind grid monitoring console with power generation gauges, battery storage thermals, and fault predictions.",
    longDesc:
      "Industrial clean energy monitoring panel. Connect to IoT sensor streams to visualize megawatts generated, battery storage charge state, and power grid balance across facilities.",
    features: [
      "Live MegaWatt Generation Streamer",
      "Battery Storage Thermals & Depth-of-Discharge Gauges",
      "Weather Satellite Cloud Cover & Irradiance Overlay",
      "Substation Fault Prediction & Anomaly Alerts",
      "Carbon Offset & ESG Compliance Report Generator",
    ],
    techStack: ["TanStack Start", "Tailwind CSS v4", "Recharts", "WebSockets", "Lucide"],
    godLevelPrompt: `Build a real-time clean energy telemetry command center for 'Solaris Energy Grid'.
Dashboard Architecture:
- Header: Live generation status (1.42 GW Output · 99.98% Efficiency), facility selector, and system health badge.
- Main Telemetry Grid: Recharts area charts displaying Solar PV vs Wind Turbine vs Battery Storage discharge over 24 hours.
- Interactive Map Panel: Geospatial view of 14 solar farms across the desert with active status pins and thermal heatmaps.
- Battery Storage Array: Circular progress gauges for charge level (88%), battery cell temperature (24.2°C), and cycle health.
- Automated Alert Center: Anomaly detection feed with 1-click grid rerouting actions.
- Dark industrial aesthetic with glowing emerald dials and crisp monospace metrics.`,
    mockStats: [
      { label: "Total Capacity", value: "1.4 GW" },
      { label: "Battery Reserve", value: "850 MWh" },
      { label: "Uptime", value: "99.99%" },
    ],
    particleMode: "energy",
  },
  {
    id: "hyperflow-fintech-cloud",
    name: "HyperFlow Global Treasury & FX",
    category: "Dashboards",
    tag: "Global Treasury",
    gradient: "from-zinc-950 via-black to-emerald-950/60",
    accent: "#22c55e",
    secondaryAccent: "#4ade80",
    badge: "Featured",
    frames: 340,
    fps: 60,
    desc: "Cross-border automated treasury management with dynamic currency conversions, contractor payouts, and audit trails.",
    longDesc:
      "Automated treasury and multi-currency banking SaaS starter. Ships with automated ledger reconciliations, real-time FX rate streams, smart contractor payouts, and audit logs.",
    features: [
      "Dynamic Multi-Currency Ledger (USD, EUR, INR, USDC)",
      "Automated Split Payroll & Contractor Global Rails",
      "Real-Time FX Exchange Rate Streamer with Spread Visualizer",
      "Biometric Passkey Authentication & Multi-Sig Approval",
      "Instant PDF & CSV Tax Statement Generator",
    ],
    techStack: ["TanStack Start", "Tailwind CSS v4", "Supabase", "Stripe Connect", "Zod"],
    godLevelPrompt: `Create a global financial treasury management platform for 'HyperFlow Treasury'.
Key Views:
- Executive Summary: Total cash balance ($14,280,450), 30-day runway projection, and currency diversification donut chart.
- Global Payout Table: Searchable, sortable list of international contractors with one-click multi-rail disbursement (Stripe, SWIFT, SEPA, UPI).
- Live FX Hedging: Interactive candlestick chart showing USD/EUR and USD/INR exchange rates with automated trigger thresholds.
- Security Vault: Multi-signature approval modal requiring 2-of-3 founder authorizations for transfers >$50k.
- Ultra-polished dark UI, emerald green profit indicators, and instant statement export.`,
    mockStats: [
      { label: "Supported Rails", value: "USD / EUR / INR / Stablecoin" },
      { label: "Compliance", value: "SOC2 Type II Ready" },
      { label: "Settlement", value: "T+0 Instant" },
    ],
    particleMode: "cyberpunk",
  },
  {
    id: "aegis-cyber-defense-soc",
    name: "Aegis Zero-Trust Cyber SOC",
    category: "Dashboards",
    tag: "Security / DevSecOps",
    gradient: "from-black via-[#021810] to-[#040810]",
    accent: "#4ade80",
    secondaryAccent: "#10b981",
    badge: "New",
    frames: 300,
    fps: 60,
    desc: "Real-time threat detection and zero-trust security operations center with live attack packet visualizer.",
    longDesc:
      "Command center for cybersecurity engineers. Features live IP geo-attack world map, automated CVE vulnerability scanner, and instant firewall containment rules.",
    features: [
      "3D Globe Threat Packet Streamer",
      "Automated CVE Remediation Playbooks",
      "Zero-Trust Identity Access Log Waterfall",
      "One-Click IP Blacklisting & Cloudflare WAF Sync",
    ],
    techStack: ["React 19", "Three.js Globe", "Tailwind CSS", "WebSockets"],
    godLevelPrompt: `Design a cybersecurity operations center dashboard for 'Aegis Threat SOC'.
Components:
- Interactive 3D World Globe with glowing trajectory arcs representing incoming DDoS and brute-force attacks in real time.
- Threat Feed: Streaming terminal with color-coded severity badges (CRITICAL, HIGH, INFO) and automated mitigation status.
- Vulnerability Scorecard: Infrastructure health rating (98/100) with container scan results and SBOM inventory.
- Incident Response Drawer: Pre-configured runbooks for rapid IP quarantine and credential revocation.
- Dark theme with emerald security pulses, radar sweep animation, and monospace code styling.`,
    mockStats: [
      { label: "Threats Blocked", value: "1.2M / day" },
      { label: "MTTD", value: "< 4.2 sec" },
      { label: "Coverage", value: "100% Endpoints" },
    ],
    particleMode: "matrix",
  },

  // ── 6. WEB3 & CRYPTO PROTOCOLS ──────────────────────────────────
  {
    id: "halo-stablecoin-protocol",
    name: "Halo Yield & Liquidity Protocol",
    category: "Web3 & Crypto",
    tag: "DeFi / Liquidity",
    gradient: "from-black via-[#041a12] to-zinc-950",
    accent: "#34d399",
    secondaryAccent: "#059669",
    badge: "God-Level Prompt",
    frames: 360,
    fps: 60,
    desc: "Decentralized yield optimization and collateralized stablecoin protocol with real-time APY calculation.",
    longDesc:
      "DeFi protocol starter. Features wallet connection modal, collateral ratio health factor sliders, automated staking calculators, and smart contract audit proofs.",
    features: [
      "Web3 Wallet Connector (MetaMask, Phantom, WalletConnect)",
      "Dynamic Staking APY & Yield Compounding Slider",
      "Collateral Health Factor & Liquidation Risk Gauge",
      "Smart Contract Formal Verification Proofs Deck",
      "Gas Optimization Analytics (<0.0001 ETH)",
    ],
    techStack: ["React 19", "Ethers / Viem", "Tailwind CSS v4", "Framer Motion"],
    godLevelPrompt: `Build a high-end decentralized finance landing page and staking app for 'Halo Protocol'.
Design:
- Hero: Glowing 3D kinetic token ring that rotates and refracts light. Text: 'THE INSTITUTIONAL STABLECOIN DEFI ENGINE' with live Total Value Locked ticker ($482,910,230 TVL).
- Interactive Staking Widget: Deposit slider where user adjusts collateral amount and views projected APY (12.4%), daily rewards in USDC, and liquidation buffer.
- Security & Audits: CertiK and OpenZeppelin audit badge cards with downloadable PDF reports and bytecode hashes.
- Partner Marquee: Seamless looping logo marquee of top liquidity providers and custodians.
- Dark glassmorphism, glowing emerald token aesthetics, and responsive layout.`,
    mockStats: [
      { label: "Total TVL", value: "$482M+" },
      { label: "Current APY", value: "12.4% Fixed" },
      { label: "Audit Rating", value: "99.4/100" },
    ],
    particleMode: "luxury",
  },
  {
    id: "nexus-layer2-rollup",
    name: "Nexus ZK-Rollup Network",
    category: "Web3 & Crypto",
    tag: "Layer-2 / ZK",
    gradient: "from-zinc-950 via-[#01140e] to-black",
    accent: "#6ee7b7",
    secondaryAccent: "#10b981",
    badge: "New",
    frames: 340,
    fps: 60,
    desc: "Zero-knowledge Ethereum Layer-2 rollup network with 10,000 TPS throughput and sub-cent transaction fees.",
    longDesc:
      "Deep tech blockchain landing. Features live block explorer feed, ZK-SNARK circuit proof verification visualizer, and cross-chain bridge simulator.",
    features: [
      "Live Block Explorer & Gas Tracker (<$0.001)",
      "Interactive ZK-Proof Generation Visualizer",
      "Cross-Chain Instant Bridge Calculator",
      "Developer RPC Endpoint One-Click Copy",
    ],
    techStack: ["React 19", "Tailwind CSS", "Recharts", "Lucide"],
    godLevelPrompt: `Design a high-speed Layer-2 blockchain landing page for 'Nexus ZK-Rollup'.
Features:
- Live TPS Meter: Digital speedometer ticking at 8,420 TPS with live block hash feed.
- ZK Compression Explainer: 3D interactive diagram showing 1,000 Ethereum transactions bundled into a single cryptographic ZK-SNARK proof.
- Fee Comparison: Interactive bar chart comparing $15 Ethereum mainnet fee vs $0.0004 Nexus fee.
- Developer Quickstart: Tabbed code snippet for deploying smart contracts using Hardhat, Foundry, and Remix.
- Dark theme with emerald laser accents and cybernetic grids.`,
    mockStats: [
      { label: "Max TPS", value: "10,000+" },
      { label: "Gas Savings", value: "99.8%" },
      { label: "Finality", value: "< 500ms" },
    ],
    particleMode: "quantum",
  },

  // ── 7. CREATIVE AGENCY & HIGH-END PORTFOLIOS ─────────────────────
  {
    id: "studio-kairo-spatial-agency",
    name: "Studio Kairo Spatial Brand Agency",
    category: "Creative Agency",
    tag: "Awwwards / Agency",
    gradient: "from-[#08140f] via-zinc-950 to-black",
    accent: "#4ade80",
    secondaryAccent: "#22c55e",
    badge: "God-Level Prompt",
    frames: 400,
    fps: 60,
    desc: "Awwwards Site-of-the-Day caliber agency portfolio with magnetic cursor physics, horizontal case study sliders, and video reels.",
    longDesc:
      "Crafted for top-tier creative studios and brand consultancies. Features full-bleed cinematic video reels, interactive typography hover splits, and high-conversion client proposal intake.",
    features: [
      "Custom Magnetic Cursor & Fluid Hover Physics",
      "Horizontal Drag & Scroll Case Study Gallery",
      "Full-Bleed WebGL Video Reel Background",
      "Dynamic Client Budget & Scope Estimator",
      "Awwwards-Winning Editorial Typography Grid",
    ],
    techStack: ["React 19", "Framer Motion", "Tailwind CSS v4", "HTML5 Video"],
    godLevelPrompt: `Build an award-winning creative digital agency portfolio for 'Studio Kairo'.
Aesthetics:
1. Hero: Giant display serif typography ('WE CRAFT SPATIAL EXPERIENCES FOR THE UNREASONABLE') that splits on mouse hover with embedded cinematic video snippets.
2. Case Studies Carousel: Horizontal draggable card showcase with smooth inertia, parallax images, and detailed case study popups.
3. Interactive Service Matrix: Hovering on '3D Web Experience', 'Brand Identity', or 'AI Engineering' reveals high-framerate video preview reels.
4. Client Testimonials: Minimalist quote cards from Fortune 500 founders and venture funds.
5. Interactive Scope & Budget Estimator: Interactive sliders for timeline (2 weeks to 3 months) and deliverables with instant project brief submission.`,
    mockStats: [
      { label: "Awwwards SOTD", value: "7x Winner" },
      { label: "Client Retainers", value: "$50k - $250k" },
      { label: "Average NPS", value: "98/100" },
    ],
    particleMode: "luxury",
  },
  {
    id: "elysium-minimalist-architects",
    name: "Elysium Minimalist Design Lab",
    category: "Creative Agency",
    tag: "Minimalist / Portfolio",
    gradient: "from-black via-[#040c08] to-zinc-950",
    accent: "#a7f3d0",
    secondaryAccent: "#34d399",
    badge: "Featured",
    frames: 350,
    fps: 60,
    desc: "Monochrome editorial portfolio for visionary art directors, architects, and luxury industrial designers.",
    longDesc:
      "Minimalist, typography-driven portfolio. Features subtle grain overlays, smooth page curtain transitions, and zero-distraction layout.",
    features: [
      "Monochrome Warm Dark Palette with Emerald Glow Accents",
      "High-Resolution Photo Lightbox with EXIF Camera Specs",
      "Bespoke Project Index with Instant Filter Tags",
      "Direct Email & Calendar Integration",
    ],
    techStack: ["React 19", "Tailwind CSS", "Framer Motion"],
    godLevelPrompt: `Create an ultra-minimalist luxury design portfolio for 'Elysium Design Lab'.
Tone:
- Muted carbon palette #080c10 with sharp emerald #22c55e typography accents and 0.5px subtle border rules.
- Hero: Minimalist centered wordmark with subtle breathing grain shader.
- Project Index: Filterable table view (Year, Client, Discipline, Impact) that opens full-bleed modal case studies on click.
- Detail View: Large format imagery with typography callouts and design rationale prose.
- Frictionless contact card with direct copyable email and calendar booking link.`,
    mockStats: [
      { label: "Page Load Time", value: "< 0.4s" },
      { label: "Lighthouse Performance", value: "100/100" },
      { label: "Design Style", value: "Swiss Minimalist" },
    ],
    particleMode: "mesh",
  },

  // ── 8. SPATIAL OS & FUTURE INTERFACES ───────────────────────────
  {
    id: "visionos-glass-operating-system",
    name: "VisionOS Spatial Web Desktop",
    category: "Spatial OS",
    tag: "Spatial OS / WebXR",
    gradient: "from-[#021a10] via-black to-[#050b16]",
    accent: "#86efac",
    secondaryAccent: "#4ade80",
    badge: "God-Level Prompt",
    frames: 440,
    fps: 60,
    desc: "Futuristic browser-based spatial operating system with draggable volumetric windows, liquid-glass materials, and 3D widgets.",
    longDesc:
      "Turn your browser into a full spatial computing desktop. Includes draggable, resizable liquid-glass windows, multi-app switcher, 3D spatial dock, and ambient background environments.",
    features: [
      "Draggable Liquid-Glass Multi-Window Desktop",
      "3D Spatial App Dock with Hover Z-Lift",
      "Dynamic Environment Switcher (Moon, Alpine Lake, Cyber Tokyo)",
      "Integrated Monaco Code Editor, AI Chat, and 3D Model Viewer Apps",
      "Hand-Tracking & Eye-Tracking Gesture Simulator",
    ],
    techStack: ["React 19", "Framer Motion", "Tailwind CSS v4", "WebXR", "Lucide"],
    godLevelPrompt: `Build a browser-based VisionOS-style spatial computing operating system for 'Aether OS'.
Architecture:
1. Spatial Environment: User can switch between 360-degree dark space, mist-covered mountain peak, and neon Tokyo skyline.
2. Floating Spatial Dock: Centered bottom dock with liquid-glass pill container, glowing app icons that scale up and project dynamic 3D drop-shadows on hover.
3. Multi-Window Management: Draggable, floating glass windows with translucent blur filters:
   - App 1: AI Prompt Studio with streaming token output.
   - App 2: 3D Model Inspector with orbit controls.
   - App 3: Real-Time Audio Synthesizer with spatial sound pads.
4. Control Center: Top-right status pill showing spatial audio level, battery, Wi-Fi 7, and hand gesture status.
5. Liquid glassmorphism, iridescent specular highlights, and ultra-smooth 60fps animations.`,
    mockStats: [
      { label: "Window Latency", value: "< 2ms" },
      { label: "WebXR Ready", value: "100% Native" },
      { label: "Multi-Window", value: "Unlimited" },
    ],
    particleMode: "galaxy",
  },
  {
    id: "matrix-cyber-terminal-os",
    name: "Matrix Cyberpunk Neural Terminal",
    category: "Spatial OS",
    tag: "Cyberpunk / CLI",
    gradient: "from-black via-[#021c0e] to-zinc-950",
    accent: "#22c55e",
    secondaryAccent: "#16a34a",
    badge: "Trending",
    frames: 360,
    fps: 60,
    desc: "Interactive hacker terminal and cybernetic command prompt with digital rain rain shaders, audio synthesis, and agent shell.",
    longDesc:
      "Retro-futuristic command-line interface meets modern AI agent tooling. Type natural language commands to inspect codebases, execute SQL queries, and deploy cloud resources.",
    features: [
      "Interactive WebGL Digital Rain Raindrop Shader",
      "Real-Time Shell Command Parser (help, deploy, scan, generate, status)",
      "Retro CRT Scanline & Curved Glass Distortion Shader Toggle",
      "Synthesizer Keyboard Click & Beep Audio Effects",
      "Live AI Agent Chat Directly in Bash Terminal",
    ],
    techStack: ["React 19", "Canvas 2D", "Web Audio API", "Tailwind CSS"],
    godLevelPrompt: `Create an interactive Matrix-style cyberpunk terminal interface for 'NeoShell OS'.
Visuals:
- Digital Rain: Falling glowing green katakana and hexadecimal glyphs in the background canvas with variable fall speeds and fading trails.
- CRT Monitor Shader: Optional scanline overlay, chromatic aberration, and phosphor glow bloom.
- Interactive Command Shell: Fully functional prompt where user can type commands:
  - 'build --template watch' -> launches 3D watch preview
  - 'agent --swarm apex' -> initiates multi-agent workflow
  - 'credits' -> displays user's AI balance ($5/5 credits to $200/300 credits)
  - 'help' -> prints available CLI options with green ASCII art headers.
- Authentic mechanical keyboard audio clicks on keystrokes.
- Pure green #22c55e on obsidian black #020502 aesthetic.`,
    mockStats: [
      { label: "Render Mode", value: "CRT Shader" },
      { label: "CLI Latency", value: "< 1ms" },
      { label: "Easter Eggs", value: "12 Hidden" },
    ],
    particleMode: "matrix",
  },
];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "All",
  "3D Scroll",
  "SaaS & AI",
  "Cinematic Landing",
  "E-Commerce",
  "Dashboards",
  "Web3 & Crypto",
  "Creative Agency",
  "Spatial OS",
];
