# 🗺️ OpenSEO Keyword Clustering & Route Mapping

This document maps all high-intent search queries into logical clusters by buyer intent and assigns them to specific dynamic routes across [https://signhify.dpdns.org](https://signhify.dpdns.org).

---

## 🧭 Cluster Summary

* **Total Clusters**: 6 core clusters
* **Existing Routes Optimized**: 6 routes ([`/__root.tsx`](file:///d:/Signhify/src/routes/__root.tsx), [`/best-ai-engineering-studio.tsx`](file:///d:/Signhify/src/routes/best-ai-engineering-studio.tsx), [`/saas-mvp.tsx`](file:///d:/Signhify/src/routes/saas-mvp.tsx), [`/ai.tsx`](file:///d:/Signhify/src/routes/ai.tsx), [`/projects.tsx`](file:///d:/Signhify/src/routes/projects.tsx), [`/brand.tsx`](file:///d:/Signhify/src/routes/brand.tsx))
* **Cannibalization Risk**: **Zero** (Each route is mapped to mutually exclusive search intent)

---

## 📊 Keyword Cluster Mapping Table

| Cluster Name | Primary Target Keyword | Secondary & LSI Keywords | Search Intent | Target Route | Priority |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Cluster 1: Studio Authority** | `ai engineering studio` | `best ai engineering studio`, `top ai engineering studio india`, `us ai engineering studio`, `ai software studio` | Commercial / Branded | [`/best-ai-engineering-studio`](file:///d:/Signhify/src/routes/best-ai-engineering-studio.tsx) | **P1** |
| **Cluster 2: Vibe Coding Category** | `vibe coding platform` | `best vibe coding platform`, `vibe coding tools for founders`, `prompt to full stack app`, `ai vibe coder studio` | Commercial / Educational | [`/best-vibe-coding-platform`](file:///d:/Signhify/src/routes/best-vibe-coding-platform.tsx) | **P1** |
| **Cluster 3: SaaS MVP Speed** | `ai saas mvp builder` | `build ai saas in 2 weeks`, `2 week saas development`, `fast ai mvp developer`, `supabase stripe saas mvp` | Transactional (High Buyer Intent) | [`/saas-mvp`](file:///d:/Signhify/src/routes/saas-mvp.tsx) | **P1** |
| **Cluster 4: AI Workspace & Agents** | `byok ai workspace` | `multi agent ai workspace`, `private ai chat with memory`, `encrypted byok ai tools`, `autonomous agent loop` | Informational / Product | [`/ai`](file:///d:/Signhify/src/routes/ai.tsx) | **P2** |
| **Cluster 5: Portfolio & Social Proof** | `ai saas case studies` | `signhify projects`, `built with signhify`, `real world ai agent examples`, `indie saas portfolio` | Navigational / Evaluation | [`/projects`](file:///d:/Signhify/src/routes/projects.tsx) | **P2** |
| **Cluster 6: Brand Disambiguation** | `signhify ai studio` | `signhify`, `signhify founder`, `piyush raj singh signhify`, `signhify udyam msme` | Branded / Entity Disambiguation | [`/brand`](file:///d:/Signhify/src/routes/brand.tsx) | **P1** |

---

## 📑 Page Briefs & Internal Linking Strategy

### 1. Route: `/best-ai-engineering-studio`
* **Searcher Problem**: Found an idea or has budget, wants an agency that actually understands modern LLMs/agents rather than traditional WordPress/PHP dev.
* **Key Content Elements**: 6-agent swarm workflow, full source code ownership on GitHub, MSME registered entity, transparent deliverables.
* **Internal Links**: Links out to [`/saas-mvp`](file:///d:/Signhify/src/routes/saas-mvp.tsx), [`/pricing`](file:///d:/Signhify/src/routes/pricing.tsx), and [`/projects`](file:///d:/Signhify/src/routes/projects.tsx).

### 2. Route: `/saas-mvp`
* **Searcher Problem**: Needs a working subscription SaaS with Auth, Database, Stripe, and AI features delivered fast without agency delays.
* **Key Content Elements**: 14-day delivery timeline, Supabase + TanStack Start tech stack, live project examples.
* **Internal Links**: Links to [`/pricing`](file:///d:/Signhify/src/routes/pricing.tsx) and [`/contact`](file:///d:/Signhify/src/routes/contact.tsx).

### 3. Route: `/brand`
* **Searcher Problem**: Google searchers or investors verifying that "Signhify" is an official AI engineering firm and disambiguating against music apps.
* **Key Content Elements**: Legal corporate name, Govt MSME ID `UDYAM-UP-30-0081308`, founder bio, official social profiles.
* **Internal Links**: Canonical root link back to [`/`](file:///d:/Signhify/src/routes/index.tsx).
