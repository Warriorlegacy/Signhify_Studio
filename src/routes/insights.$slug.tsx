import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, User, Tag, Calendar } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ARTICLES_MAP, type ArticleData } from "@/lib/insights.data";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params: { slug } }) => {
    const article = ARTICLES_MAP[slug];
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Engineering Insights — Signhify" }] };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Signhify Engineering Insights` },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://signhify.dpdns.org/insights/${loaderData.id}` },
        { property: "article:published_time", content: loaderData.date },
        { property: "article:author", content: loaderData.author },
        { property: "article:tag", content: loaderData.tags.join(",") },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.summary },
      ],
      links: [{ rel: "canonical", href: `https://signhify.dpdns.org/insights/${loaderData.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: loaderData.title,
            description: loaderData.summary,
            datePublished: loaderData.date,
            author: {
              "@type": "Person",
              name: loaderData.author,
            },
            publisher: {
              "@type": "Organization",
              name: "Signhify",
              url: "https://signhify.dpdns.org",
            },
            url: `https://signhify.dpdns.org/insights/${loaderData.id}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://signhify.dpdns.org/insights/${loaderData.id}`,
            },
            keywords: loaderData.tags.join(", "),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Insights",
                item: "https://signhify.dpdns.org/insights",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: loaderData.title,
                item: `https://signhify.dpdns.org/insights/${loaderData.id}`,
              },
            ],
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const article: ArticleData = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Insights", to: "/insights" as const },
            { label: article.title, to: `/insights/${article.id}` },
          ]}
        />

        <Link
          to="/insights"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-6 mb-8 transition"
        >
          <ArrowLeft size={14} /> Back to insights
        </Link>

        <article>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-medium">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {article.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <User size={14} />
            <span>{article.author}</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-border text-xs text-muted-foreground"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 prose prose-invert max-w-none">
            {article.content.split("\n").map((line, i) => {
              if (line.startsWith("## "))
                return (
                  <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
                    {line.slice(3)}
                  </h2>
                );
              if (line.startsWith("### "))
                return (
                  <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                    {line.slice(4)}
                  </h3>
                );
              if (line.startsWith("```")) return null;
              if (line.startsWith("| ")) return null;
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*(.+?)\*\*(.*)/);
                return match ? (
                  <li key={i} className="ml-4 list-disc text-muted-foreground mb-1">
                    <strong>{match[1]}</strong>
                    {match[2]}
                  </li>
                ) : null;
              }
              if (line.startsWith("- "))
                return (
                  <li key={i} className="ml-4 list-disc text-muted-foreground mb-1">
                    {line.slice(2)}
                  </li>
                );
              if (line.trim() === "") return <div key={i} className="h-3" />;
              return (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {line}
                </p>
              );
            })}
          </div>
        </article>

        <div className="mt-16 border-t border-border pt-10 text-center">
          <h2 className="text-xl font-bold">Need this built for your product?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a custom architecture, tech stack, and fixed-price estimate within 24 hours.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-110 transition"
          >
            Start a project
          </Link>
        </div>
      </div>
    </div>
  );
}
