export const PRESETS = [
  {
    id: "cyberpunk-kinetic-watch",
    name: "Cyberpunk Kinetic Watch",
    desc: "Luxury mechanical timepiece with 360-degree exploded gear assembly, titanium case reflections, and micro-interactions on scroll.",
    gradient: "from-emerald-950 via-[#050b14] to-zinc-950",
    thumbnail: "/images/templates/cyberpunk-kinetic-watch.png",
    category: "3D Scroll",
    frames: 480,
    badge: "God-Level Prompt",
  },
  {
    id: "zenith-spatial-headset",
    name: "Zenith Spatial Headset",
    desc: "Spatial AR computing headset with interactive micro-OLED optical layers, LiDAR mesh, and spatial audio field depth maps.",
    gradient: "from-emerald-950 via-zinc-950 to-[#020617]",
    thumbnail: "/images/templates/zenith-spatial-headset.png",
    category: "3D Scroll",
    frames: 540,
    badge: "Cinematic 3D",
  },
  {
    id: "titanium-ev-supercar",
    name: "Titanium EV Supercar",
    desc: "Electric hypercar launch page with wind-tunnel aerodynamics, 0-60 dynamic acceleration curve, and chassis X-ray.",
    gradient: "from-[#020d08] via-zinc-950 to-black",
    thumbnail: "/images/templates/titanium-ev-supercar.png",
    category: "3D Scroll",
    frames: 600,
    badge: "Featured",
  },
  {
    id: "nova-ai-code-copilot",
    name: "Nova AI Code Copilot",
    desc: "Autonomous developer platform with live playground, multi-tab IDE, terminal streaming, and Stripe subscription billing.",
    gradient: "from-zinc-950 via-emerald-950/40 to-black",
    thumbnail: "/images/templates/nova-ai-code-copilot.png",
    category: "SaaS & AI",
    frames: 360,
    badge: "God-Level Prompt",
  },
  {
    id: "orbital-quantum-compute",
    name: "Orbital Quantum Compute",
    desc: "Deep tech quantum compute platform with particle physics, cryo-chamber 3D visuals, and dark glassmorphic layout.",
    gradient: "from-black via-zinc-950 to-emerald-950",
    thumbnail: "/images/templates/orbital-quantum-compute.png",
    category: "Cinematic Landing",
    frames: 520,
    badge: "God-Level Prompt",
  },
  {
    id: "vortex-wireless-audio",
    name: "Vortex Wireless Audio",
    desc: "High-fidelity acoustic hardware with exploded 3D component view, acoustic frequency response curve, and instant checkout drawer.",
    gradient: "from-zinc-900 via-black to-emerald-950",
    thumbnail: "/images/templates/vortex-wireless-audio.png",
    category: "E-Commerce",
    frames: 420,
    badge: "God-Level Prompt",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Signhify replaced a $4,000 agency quote with a 15-minute session. The result was honestly better.",
    name: "Arjun Mehta",
    role: "Startup Founder",
    flag: "🇮🇳 India",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=face",
  },
  {
    quote:
      "I built my restaurant's full site in under 10 minutes. Customers keep asking who designed it — I just say Signhify.",
    name: "Priya Sharma",
    role: "Restaurant Owner",
    flag: "🇮🇳 India",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=128&h=128&fit=crop&crop=face",
  },
  {
    quote:
      "Launched my SaaS landing page before the weekend was over. No agency, no templates, no HTML — just a prompt.",
    name: "Lukas Becker",
    role: "Indie Developer",
    flag: "🇩🇪 Germany",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
  },
  {
    quote:
      "My clients think I hired a design agency. I used a Signhify preset and swapped the copy. Done in an afternoon.",
    name: "Amara Osei",
    role: "Freelance Consultant",
    flag: "🇬🇭 Ghana",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&h=128&fit=crop&crop=face",
  },
  {
    quote:
      "We needed a site for our fintech product fast. Signhify gave us something that looked funded. Investors noticed.",
    name: "Miguel Torres",
    role: "Co-founder, FinStart",
    flag: "🇧🇷 Brazil",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face",
  },
];

export const PIPELINE = [
  {
    n: "01",
    title: "Pick a preset",
    desc: "Start from production-ready UI — customize copy and media in minutes.",
    icon: "sparkles",
  },
  { n: "02", title: "Describe", desc: "Tell us the visual atmosphere you want.", icon: "terminal" },
  { n: "03", title: "Generate", desc: "AI creates a cinematic keyframe.", icon: "image" },
  { n: "04", title: "Animate", desc: "The image becomes a smooth 8s video.", icon: "video" },
  { n: "05", title: "Build", desc: "AI extracts frames for a 3D scroll.", icon: "layers" },
  { n: "06", title: "Deploy", desc: "Download a ZIP with HTML, CSS, JS.", icon: "download" },
];

export const PRO_TOOLS = [
  {
    title: "Multi-Video Continuation",
    desc: "Chain multiple videos end-to-end for longer scroll animations. First frame of each picks up perfectly from the last.",
    icon: "layers",
    span: "md:col-span-2",
  },
  {
    title: "Full-Stack Export",
    desc: "Download a ZIP with frontend + backend starter. Includes Express API.",
    icon: "file",
  },
  {
    title: "Iterative Chat Editing",
    desc: "Chat with AI to change copy, move sections, adjust colors — live.",
    icon: "chat",
  },
  {
    title: "Product Injection",
    desc: "Upload product photos and tell AI where to place them directly in 3D.",
    icon: "box",
  },
  {
    title: "Adjustable FPS",
    desc: "Slide between 10–40 FPS to control frame density and scroll speed.",
    icon: "clock",
  },
];

export const STATS = [
  { value: "400+", label: "Frames per Site", icon: "layers" },
  { value: "~8s", label: "Video Duration", icon: "video" },
  { value: "10–40", label: "Adjustable FPS", icon: "clock" },
  { value: "ZIP", label: "Ready to Deploy", icon: "code" },
];
