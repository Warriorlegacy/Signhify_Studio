import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ label: "Home", to: "/" }, ...items];

  const schemaItems = allItems.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: item.to ? `https://signhify.dpdns.org${item.to}` : undefined,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: schemaItems,
          }),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <ol className="flex items-center gap-1.5 flex-wrap">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight size={12} className="text-muted-foreground/60 shrink-0" />
                )}
                {isLast || !item.to ? (
                  <span className="font-medium text-foreground tracking-wide truncate max-w-[200px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {idx === 0 && <Home size={12} className="shrink-0 text-primary" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
