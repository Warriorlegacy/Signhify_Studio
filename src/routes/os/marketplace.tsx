import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Download, Star, ArrowLeft, Package, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/os/marketplace")({
  head: () => ({
    meta: [
      { title: "Agent Marketplace — Signhify OS" },
      {
        name: "description",
        content:
          "Signhify OS - Discover and deploy AI agents from the marketplace. Browse categories, ratings, and downloads.",
      },
      {
        property: "og:url",
        content: "https://signhify.online/os/marketplace",
      },
      { property: "og:title", content: "Agent Marketplace — Signhify OS" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/os/marketplace" }],
  }),
  component: MarketplacePage,
});

const CATEGORIES = ["All", "Development", "Research", "Design", "QA", "DevOps"] as const;

function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["os_marketplace"],
    queryFn: async () => [
      {
        id: "mp-1",
        name: "CodeGen Pro",
        description:
          "Advanced code generation agent with multi-language support, auto-documentation, and PR creation.",
        author: "Signhify Labs",
        downloads: 1247,
        rating: 4.8,
        category: "Development",
      },
      {
        id: "mp-2",
        name: "Research Assistant",
        description:
          "Deep research agent that searches, summarizes, and generates reports from multiple sources.",
        author: "DataForge",
        downloads: 892,
        rating: 4.6,
        category: "Research",
      },
      {
        id: "mp-3",
        name: "UI Designer",
        description: "Generates UI components and page layouts from natural language descriptions.",
        author: "Creative AI",
        downloads: 2103,
        rating: 4.9,
        category: "Design",
      },
      {
        id: "mp-4",
        name: "TestRunner",
        description:
          "Automated testing agent that writes, runs, and maintains test suites across frameworks.",
        author: "QA Labs",
        downloads: 654,
        rating: 4.5,
        category: "QA",
      },
      {
        id: "mp-5",
        name: "DeployBot",
        description:
          "CI/CD pipeline agent that manages deployments, rollbacks, and infrastructure as code.",
        author: "DevOps Inc",
        downloads: 1876,
        rating: 4.7,
        category: "DevOps",
      },
      {
        id: "mp-6",
        name: "DocSmith",
        description:
          "Documentation agent that reads your codebase and generates comprehensive docs automatically.",
        author: "Signhify Labs",
        downloads: 431,
        rating: 4.3,
        category: "Development",
      },
      {
        id: "mp-7",
        name: "Data Analyzer",
        description:
          "Analyzes datasets, generates visualizations, and produces insights with natural language queries.",
        author: "DataForge",
        downloads: 768,
        rating: 4.4,
        category: "Research",
      },
      {
        id: "mp-8",
        name: "Accessibility Checker",
        description:
          "Scans web apps for WCAG compliance and suggests fixes for accessibility issues.",
        author: "QA Labs",
        downloads: 312,
        rating: 4.2,
        category: "QA",
      },
    ],
  });

  const filtered = listings?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30",
        )}
      />
    ));
  }

  return (
    <section className="pt-20 pb-24 px-6 min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            to="/os"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to OS Dashboard
          </Link>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Signhify OS</div>
          <h1 className="font-display text-3xl font-bold text-gradient">Agent Marketplace</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover and deploy AI agents built by the community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search marketplace..."
              className="w-full rounded-md border border-border bg-surface/60 pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                category === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-border/80",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">
              {search ? "No listings found" : "Marketplace is empty"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Try a different search term or category."
                : "Check back later for new agent listings."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered?.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border bg-card p-5 flex flex-col hover:border-primary/30 transition-colors"
              >
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                  <h3 className="font-display text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {item.downloads.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating)}
                      <span className="text-xs text-muted-foreground ml-1">{item.rating}</span>
                    </div>
                    <button
                      onClick={() => {
                        /* mock deploy */
                      }}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Deploy Agent
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
