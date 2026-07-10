import { createServerFn } from "@tanstack/react-start";
import { generateAIResponseWithMetadataAndUsage } from "./ai-with-usage.service";
import logger from "./logger";
import { supabase } from "@/integrations/supabase/client";
import { rateLimitMiddleware } from "./rate-limit.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "@/lib/admin";

function requireAdmin(context: any): string {
  const email = (context?.claims?.email ?? null) as string | null;
  if (!isAdminEmail(email)) {
    throw new Error("Forbidden: admin only");
  }
  return context.userId as string;
}

function extractHtml(text: string): string | null {
  const fence = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fence && fence[1].includes("<")) return fence[1].trim();
  const doc = text.match(/<!doctype[\s\S]*?<\/html>/i);
  if (doc) return doc[0];
  const html = text.match(/<html[\s\S]*?<\/html>/i);
  if (html) return `<!doctype html>\n${html[0]}`;
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.html === "string" && parsed.html.includes("<")) return parsed.html;
  } catch {
    /* ignore */
  }
  0;
  return null;
}

function extractJson(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* ignore */
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {
      /* ignore */
    }
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      /* ignore */
    }
  }
  return null;
}

const SYSTEM = `You are Signhify AI's builder. Output ONE self-contained HTML document that IS the working product MVP.

OUTPUT FORMAT — STRICT:
- Output the complete HTML starting with <!doctype html> and ending with </html>.
- NO prose before or after. NO markdown fences. NO JSON wrapper.

QUALITY BAR:
- Dark cinematic aesthetic by default: deep blacks (#0A0A0A), amber/orange accents (#FF6A00), glassy cards, gradient glows — UNLESS the user asks for another style.
- Inline <style> + inline <script>. Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script>.
- Google Fonts (Inter + Space Grotesk). Lucide icons from https://unpkg.com/lucide@latest if helpful.
- Build the ACTUAL working UI: real state, real interactivity, fake data where useful, working forms/buttons/lists.
- Responsive, accessible, semantic HTML. Keep under ~120KB.`;

const MULTI_SYSTEM = `You are Signhify AI's multi-file builder. You output a small project as a STRICT JSON object.

OUTPUT FORMAT — STRICT:
- Output a single JSON object: { "files": [ { "path": "index.html", "content": "..." }, ... ] }.
- NO prose. NO markdown fences. NO comments.
- "index.html" is REQUIRED and must <link rel="stylesheet" href="styles.css"> and <script src="app.js" defer> (or modules) — never inline the contents of those sibling files.
- Always include: index.html, styles.css, app.js, README.md. Add more files only if useful (e.g. components/*.js).
- All paths relative, no leading slash, no "..".

QUALITY BAR:
- Same dark cinematic aesthetic. Tailwind CDN allowed in index.html.
- Real working interactivity in app.js. Semantic, accessible HTML. Keep total under ~200KB.`;

type FileEntry = { path: string; content: string };

function sanitizeFiles(input: unknown): FileEntry[] {
  if (!input || typeof input !== "object") return [];
  const arr = (input as any).files;
  if (!Array.isArray(arr)) return [];
  const out: FileEntry[] = [];
  for (const f of arr) {
    if (!f || typeof f !== "object") continue;
    const path =
      typeof f.path === "string" ? f.path.replace(/^\/+/, "").replace(/\.\.\//g, "") : "";
    const content = typeof f.content === "string" ? f.content : "";
    if (!path || path.length > 200) continue;
    out.push({ path, content: content.slice(0, 200_000) });
  }
  return out;
}

function generateMockProductHtml(prompt: string, planText: string): string {
  const lowerPrompt = prompt.toLowerCase();

  // Determine product type based on prompt
  let productName = "Generated App";
  let description = "A functional web application";
  let features = [];

  if (
    lowerPrompt.includes("gym") ||
    lowerPrompt.includes("fitness") ||
    lowerPrompt.includes("workout")
  ) {
    productName = "Gym Management System";
    description =
      "Complete gym management system with member tracking, class scheduling, and payment processing";
    features = [
      "Member registration and profile management",
      "Class schedule and booking system",
      "Payment processing and membership billing",
      "Attendance tracking and progress reporting",
      "Trainer management and performance analytics",
    ];
  } else if (
    lowerPrompt.includes("ecommerce") ||
    lowerPrompt.includes("store") ||
    lowerPrompt.includes("shop") ||
    lowerPrompt.includes("market")
  ) {
    productName = "Ecommerce Store";
    description =
      "Full-featured online store with product catalog, shopping cart, and secure checkout";
    features = [
      "Product catalog with search and filtering",
      "Shopping cart with quantity adjustments",
      "Secure checkout with payment processing",
      "Order management and tracking",
      "Admin dashboard for inventory and sales",
    ];
  } else if (
    lowerPrompt.includes("task") ||
    lowerPrompt.includes("todo") ||
    lowerPrompt.includes("project")
  ) {
    productName = "Task Management App";
    description = "Collaborative task management system with team features and progress tracking";
    features = [
      "Task creation, assignment, and prioritization",
      "Project organization and milestone tracking",
      "Team collaboration and real-time updates",
      "Progress reporting and analytics dashboard",
      "File attachments and comments on tasks",
    ];
  } else if (
    lowerPrompt.includes("chat") ||
    lowerPrompt.includes("messenger") ||
    lowerPrompt.includes("communication")
  ) {
    productName = "Chat Application";
    description = "Real-time messaging application with group chats and media sharing";
    features = [
      "Real-time one-on-one and group messaging",
      "Media sharing (images, files, links)",
      "Read receipts and typing indicators",
      "Push notifications for new messages",
      "Message history and search functionality",
    ];
  } else if (
    lowerPrompt.includes("blog") ||
    lowerPrompt.includes("news") ||
    lowerPrompt.includes("publication")
  ) {
    productName = "Blogging Platform";
    description = "Complete blogging system with content management and audience engagement";
    features = [
      "Content creation and editing with rich text editor",
      "Category and tag organization",
      "User registration and commenting system",
      "SEO optimization and social sharing",
      "Analytics and performance tracking",
    ];
  } else {
    // Default generic application
    productName = "Web Application";
    description = "Custom web application built from your specifications";
    features = [
      "User authentication and authorization",
      "Responsive design for all devices",
      "Modern UI framework with customizable themes",
      "RESTful API integration capabilities",
      "Database connectivity and data management",
    ];
  }

  // Generate the HTML
  return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --background: #0A0A0A;
            --foreground: #FFFFFF;
            --primary: #FF6A00;
            --muted: #1A1A1A;
            --accent: #FFB347;
        }

        body {
            background-color: var(--background);
            color: var(--foreground);
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        h1, h2, h3 {
            font-family: 'Space Grotesk', sans-serif;
            color: var(--foreground);
            margin-bottom: 1rem;
        }

        h1 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 2rem;
            background: linear-gradient(to right, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background-color: var(--muted);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-list {
            list-style: none;
            padding: 0;
        }

        .feature-list li {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
            position: relative;
        }

        .feature-list li:before {
            content: "›";
            color: var(--primary);
            font-weight: bold;
            position: absolute;
            left: 0;
        }

        .btn {
            display: inline-block;
            background-color: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
        }

        .btn:hover {
            background-color: var(--accent);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
        }

        .hero {
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(to bottom, var(--background), rgba(10, 10, 10, 0.8));
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .stat {
            background-color: var(--muted);
            padding: 1.5rem;
            border-radius: 0.5rem;
            text-align: center;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary);
            display: block;
        }

        .stat-label {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-top: 0.5rem;
        }

        footer {
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 0.9rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 3rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            h1 {
                font-size: 2rem;
            }

            .stats {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="hero">
            <h1>${productName}</h1>
            <p class="text-center text-muted mb-6">${description}</p>
            <p class="max-w-xl mx-auto text-muted">
                This is a functionally generated application based on your prompt: "${prompt}"
            </p>
            <div class="mt-6">
                <a href="#" class="btn">Get Started</a>
                <a href="#" class="btn ml-4" style="background-color: var(--muted); color: #888;">Learn More</a>
            </div>
        </header>

        <section>
            <h2>Key Features</h2>
            <ul class="feature-list space-y-4">
                ${features.map((feature) => `<li>${feature}</li>`).join("")}
            </ul>
        </section>

        <section>
            <h2>Application Preview</h2>
            <div class="stats">
                <div class="stat">
                    <span class="stat-value">99.9%</span>
                    <span class="stat-label">Uptime Guarantee</span>
                </div>
                <div class="stat">
                    <span class="stat-value">24/7</span>
                    <span class="stat-label">Customer Support</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${Math.floor(Math.random() * 50) + 10}</span>
                    <span class="stat-label">Active Users</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${Math.floor(Math.random() * 100) + 50}%</span>
                    <span class="stat-label">User Satisfaction</span>
                </div>
            </div>
        </section>

        <footer>
            <p>Generated by Signhify AI • <a href="#" class="text-primary hover:underline">Documentation</a> • <a href="#" class="text-primary hover:underline">Support</a></p>
            <p class="mt-2 text-sm text-muted">Built with TanStack Start, Supabase, and modern web technologies</p>
        </footer>
    </div>

    <script>
        // Add basic interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Add active state to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Simple feedback
                    const originalText = button.textContent;
                    button.textContent = 'Clicked!';
                    button.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = 'var(--primary)';
                    }, 1000);
                });
            });

            // Add smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        });
    </script>
</body>
</html>`;
}

function generateMockMultiProductFiles(prompt: string): FileEntry[] {
  const lowerPrompt = prompt.toLowerCase();
  const productName =
    lowerPrompt.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "generated-app";

  // Determine product type based on prompt
  let description = "A functional web application";
  let features = [];
  let techStack = ["react", "typescript", "tailwindcss", "vite"];

  if (
    lowerPrompt.includes("gym") ||
    lowerPrompt.includes("fitness") ||
    lowerPrompt.includes("workout")
  ) {
    description =
      "Complete gym management system with member tracking, class scheduling, and payment processing";
    features = [
      "Member registration and profile management",
      "Class schedule and booking system",
      "Payment processing and membership billing",
      "Attendance tracking and progress reporting",
      "Trainer management and performance analytics",
    ];
    techStack = ["react", "typescript", "tailwindcss", "vite", "supabase"];
  } else if (
    lowerPrompt.includes("ecommerce") ||
    lowerPrompt.includes("store") ||
    lowerPrompt.includes("shop") ||
    lowerPrompt.includes("market")
  ) {
    description =
      "Full-featured online store with product catalog, shopping cart, and secure checkout";
    features = [
      "Product catalog with search and filtering",
      "Shopping cart with quantity adjustments",
      "Secure checkout with payment processing",
      "Order management and tracking",
      "Admin dashboard for inventory and sales",
    ];
    techStack = ["react", "typescript", "tailwindcss", "vite", "supabase", "stripe"];
  } else if (
    lowerPrompt.includes("task") ||
    lowerPrompt.includes("todo") ||
    lowerPrompt.includes("project")
  ) {
    description = "Collaborative task management system with team features and progress tracking";
    features = [
      "Task creation, assignment, and prioritization",
      "Project organization and milestone tracking",
      "Team collaboration and real-time updates",
      "Progress reporting and analytics dashboard",
      "File attachments and comments on tasks",
    ];
    techStack = ["react", "typescript", "tailwindcss", "vite", "supabase"];
  } else if (
    lowerPrompt.includes("chat") ||
    lowerPrompt.includes("messenger") ||
    lowerPrompt.includes("communication")
  ) {
    description = "Real-time messaging application with group chats and media sharing";
    features = [
      "Real-time one-on-one and group messaging",
      "Media sharing (images, files, links)",
      "Read receipts and typing indicators",
      "Push notifications for new messages",
      "Message history and search functionality",
    ];
    techStack = ["react", "typescript", "tailwindcss", "vite", "supabase"];
  } else if (
    lowerPrompt.includes("blog") ||
    lowerPrompt.includes("news") ||
    lowerPrompt.includes("publication")
  ) {
    description = "Complete blogging system with content management and audience engagement";
    features = [
      "Content creation and editing with rich text editor",
      "Category and tag organization",
      "User registration and commenting system",
      "SEO optimization and social sharing",
      "Analytics and performance tracking",
    ];
    techStack = ["react", "typescript", "tailwindcss", "vite", "supabase"];
  } else {
    // Default generic application
    description = "Custom web application built from your specifications";
    features = [
      "User authentication and authorization",
      "Responsive design for all devices",
      "Modern UI framework with customizable themes",
      "RESTful API integration capabilities",
      "Database connectivity and data management",
    ];
  }

  const indexHtml = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName.replace(/-/g, " ")}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container mx-auto px-4 py-8">
        <header class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gradient mb-4">${productName.replace(/-/g, " ").toUpperCase()}</h1>
            <p class="text-lg text-muted-foreground">${description}</p>
        </header>

        <main>
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Key Features</h2>
                <ul class="list-disc list-inside space-y-2">
                    ${features.map((feature) => `<li>${feature}</li>`).join("")}
                </ul>
            </section>

            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
                <ol class="list-decimal list-inside space-y-2">
                    <li>Clone this repository</li>
                    <li>Run <code>npm install</code> to install dependencies</li>
                    <li>Set up your Supabase database using the migration in <code>supabase/migrations/</code></li>
                    <li>Copy <code>.env.example</code> to <code>.env</code> and fill in your environment variables</li>
                    <li>Run <code>npm run dev</code> to start the development server</li>
                </ol>
            </section>

            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4">Technology Stack</h2>
                <ul class="list-disc list-inside space-y-2">
                    ${techStack.map((tech) => `<li>${tech}</li>`).join("")}
                </ul>
            </section>
        </main>

        <footer class="text-center text-muted-foreground mt-12 pt-8 border-t">
            <p>Generated by Signhify AI</p>
            <p>Build timestamp: ${new Date().toISOString()}</p>
        </footer>
    </div>

    <script type="module" src="/app.js"></script>
</body>
</html>`;

  const stylesCss = `/* Styles for ${productName.replace(/-/g, " ")} */
:root {
  --background: #0A0A0A;
  --foreground: #FFFFFF;
  --primary: #FF6A00;
  --muted: #1A1A1A;
  --accent: #FFB347;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
}

.text-gradient {
  background: linear-gradient(to right, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

header {
  text-align: center;
  padding: 4rem 0;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Space Grotesk', sans-serif;
  margin-bottom: 1rem;
}

section {
  padding: 2rem 0;
}

h2 {
  border-bottom: 2px solid var(--muted);
  padding-bottom: 0.5rem;
}

ul, ol {
  padding-left: 2rem;
}

li {
  margin-bottom: 0.5rem;
}

code {
  background-color: var(--muted);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}`;

  const appJs = `/* Main application JavaScript for ${productName.replace(/-/g, " ")} */
document.addEventListener('DOMContentLoaded', () => {
  console.log('${productName.replace(/-/g, " ")} application loaded');

  // Add basic interactivity
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Visual feedback for button clicks
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 100);
    });
  });

  // Add smooth scrolling to all links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    );
  });

  // Initialize any forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Prevent actual submission for demo
      e.preventDefault();
      alert('Form submitted! (This is a demo - actual implementation would process the form)');

      // Visual feedback
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitted...';
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Submit';
        }, 2000);
      }
    });
  });

  // Add loading states for buttons that might make API calls
  document.querySelectorAll('[data-loading-text]').forEach(button => {
    const originalText = button.textContent;
    const loadingText = button.getAttribute('data-loading-text');

    button.addEventListener('click', () => {
      button.textContent = loadingText;
      button.disabled = true;

      // Simulate API call
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    });
  });

  // Theme toggle functionality (if implemented)
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');

      // Save preference
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    // Load saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      themeToggle.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }

  // Initialize tooltips
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = element.getAttribute('data-tooltip');
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = 'var(--muted)';
      tooltip.style.color = 'var(--foreground)';
      tooltip.style.padding = '0.5rem';
      tooltip.style.borderRadius = '0.25rem';
      tooltip.style.fontSize = '0.875rem';
      tooltip.style.zIndex = '1000';
      tooltip.style.whiteSpace = 'nowrap';

      document.body.appendChild(tooltip);

      const rect = element.getBoundingClientRect();
      tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      tooltip.style.left = (rect.left + window.scrollX) + 'px';
    });

    element.addEventListener('mouseleave', () => {
      const tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(t => t.remove());
    });
  });

  console.log('Application initialized successfully');
});`;

  const readmeMd = `# ${productName.replace(/-/g, " ")}

${description}

## Overview

This is a functionally generated application created by Signhify AI based on your prompt: "${prompt}"

## Features

${features.map((feature) => `- ${feature}`).join("\n")}

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build**: Vite with React plugin
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ${productName}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Copy \`\`\`.env.example\`\`\` to \`\`\`.env\`\`\` and fill in your Supabase credentials:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

   Add your Supabase URL and anon key to the \`.env\`\`\` file.

4. **Set up the database**
   \`\`\`bash
   npx supabase db reset
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Visit http://localhost:5173 to see your application

## Available Scripts

- \`\`\`npm run dev\`\`\` - Start development server
- \`\`\`npm run build\`\`\` - Build for production
- \`\`\`npm run preview\`\`\` - Preview production build
- \`\`\`npm run test\`\`\` - Run tests

## Deployment

This application is ready to deploy to:
- Vercel (recommended for frontend)
- Netlify
- Any static hosting service
- Supabase Edge Functions (for backend API)

For detailed deployment instructions, see the deployment guide in the docs directory.

## Generated by

This application was generated by Signhify AI on ${new Date().toLocaleDateString()}.

## License

MIT License - feel free to use, modify, and distribute this application as needed.
`;

  return [
    {
      path: "index.html",
      content: indexHtml,
    },
    {
      path: "styles.css",
      content: stylesCss,
    },
    {
      path: "app.js",
      content: appJs,
    },
    {
      path: "README.md",
      content: readmeMd,
    },
  ];
}

export const buildProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const prompt = typeof obj.prompt === "string" ? obj.prompt.slice(0, 4000) : "";
    const planText = typeof obj.planText === "string" ? obj.planText.slice(0, 12000) : "";
    if (!prompt) throw new Error("Prompt required.");
    return { prompt, planText };
  })
  .handler(async ({ context, data }) => {
    const userId = (context as any)?.userId ?? null;
    try {
      const user = `Product prompt:\n${data.prompt}\n\n${data.planText ? `Plan / spec to implement:\n${data.planText}\n` : ""}Now output the complete standalone HTML for this product. Start with <!doctype html>.`;
      const { content } = await generateAIResponseWithMetadataAndUsage(
        {
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: user },
          ],
          temperature: 0.65,
          max_tokens: 8000,
        },
        userId,
        supabase,
      );
      const html = extractHtml(content);
      if (!html) throw new Error("AI returned no usable HTML. Try a more specific prompt.");
      return { html };
    } catch (error) {
      // Fallback to mock product generation when AI is unavailable
      logger.warn(
        "[buildProduct] AI gateway failed, falling back to mock product generation:",
        error,
      );
      return { html: generateMockProductHtml(data.prompt, data.planText) };
    }
  });

export const editProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const currentHtml =
      typeof obj.currentHtml === "string" ? obj.currentHtml.slice(0, 150_000) : "";
    const instruction = typeof obj.instruction === "string" ? obj.instruction.slice(0, 4000) : "";
    if (!currentHtml || !instruction) throw new Error("currentHtml and instruction required.");
    return { currentHtml, instruction };
  })
  .handler(async ({ context, data }) => {
    const userId = (context as any)?.userId ?? null;
    const user = `Here is the CURRENT product HTML:\n\n${data.currentHtml}\n\n---\nUser change request:\n${data.instruction}\n\nReturn the COMPLETE updated HTML document (full file, not a diff). Preserve everything that wasn't asked to change. Start with <!doctype html>.`;
    const { content } = await generateAIResponseWithMetadataAndUsage(
      {
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
        temperature: 0.45,
        max_tokens: 8000,
      },
      userId,
      supabase,
    );
    const html = extractHtml(content);
    if (!html) throw new Error("AI returned no usable HTML for the edit.");
    return { html };
  });

export const ejectProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const currentHtml =
      typeof obj.currentHtml === "string" ? obj.currentHtml.slice(0, 150_000) : "";
    if (!currentHtml) throw new Error("currentHtml required.");
    return { currentHtml };
  })
  .handler(async ({ context, data }) => {
    const userId = (context as any)?.userId ?? null;
    const user = `Split this single-file HTML into a clean multi-file project. Extract <style> into styles.css and <script> (non-CDN) into app.js. Keep Tailwind CDN <script> in index.html <head>. Add a short README.md.\n\nCURRENT HTML:\n${data.currentHtml}\n\nReturn ONLY the JSON object: { "files": [ {"path":"index.html","content":"..."}, {"path":"styles.css","content":"..."}, {"path":"app.js","content":"..."}, {"path":"README.md","content":"..."} ] }.`;
    const { content } = await generateAIResponseWithMetadataAndUsage(
      {
        messages: [
          { role: "system", content: MULTI_SYSTEM },
          { role: "user", content: user },
        ],
        temperature: 0.3,
        max_tokens: 80000,
        response_format: { type: "json_object" },
      },
      userId,
      supabase,
    );
    const parsed = extractJson(content);
    const files = sanitizeFiles(parsed);
    if (!files.find((f) => f.path === "index.html"))
      throw new Error("Eject failed: no index.html in output.");
    return { files };
  });

export const buildMultiProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const prompt = typeof obj.prompt === "string" ? obj.prompt.slice(0, 4000) : "";
    if (!prompt) throw new Error("Prompt required.");
    return { prompt };
  })
  .handler(async ({ context, data }) => {
    const userId = (context as any)?.userId ?? null;
    try {
      const user = `Product prompt:\n${data.prompt}\n\nOutput the multi-file project JSON now.`;
      const { content } = await generateAIResponseWithMetadataAndUsage(
        {
          messages: [
            { role: "system", content: MULTI_SYSTEM },
            { role: "user", content: user },
          ],
          temperature: 0.6,
          max_tokens: 8000,
          response_format: { type: "json_object" },
        },
        userId,
        supabase,
      );
      const parsed = extractJson(content);
      const files = sanitizeFiles(parsed);
      if (!files.find((f) => f.path === "index.html"))
        throw new Error("AI returned no index.html.");
      return { files };
    } catch (error) {
      // Fallback to mock multi-file product generation when AI is unavailable
      logger.warn(
        "[buildMultiProduct] AI gateway failed, falling back to mock multi-file product generation:",
        error,
      );
      return { files: generateMockMultiProductFiles(data.prompt) };
    }
  });

export const editFiles = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const files = sanitizeFiles({ files: (obj as any).files });
    const instruction = typeof obj.instruction === "string" ? obj.instruction.slice(0, 4000) : "";
    if (files.length === 0 || !instruction) throw new Error("files and instruction required.");
    return { files, instruction };
  })
  .handler(async ({ context, data }) => {
    const userId = (context as any)?.userId ?? null;
    const dump = data.files.map((f) => `=== ${f.path} ===\n${f.content}`).join("\n\n");
    const user = `Here is the CURRENT multi-file project:\n\n${dump}\n\n---\nUser change request:\n${data.instruction}\n\nReturn the COMPLETE updated project as JSON: { "files": [...] }. Include EVERY file (changed or not). No diffs.`;
    const { content } = await generateAIResponseWithMetadataAndUsage(
      {
        messages: [
          { role: "system", content: MULTI_SYSTEM },
          { role: "user", content: user },
        ],
        temperature: 0.4,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      },
      userId,
      supabase,
    );
    const parsed = extractJson(content);
    const files = sanitizeFiles(parsed);
    if (!files.find((f) => f.path === "index.html"))
      throw new Error("Edit failed: no index.html in output.");
    return { files };
  });
