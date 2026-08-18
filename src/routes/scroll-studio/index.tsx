import { createFileRoute } from "@tanstack/react-router";
import { ScrollStudioBuilder } from "@/components/scroll-studio/ScrollStudioBuilder";

export const Route = createFileRoute("/scroll-studio/")({
  validateSearch: (search: Record<string, unknown>) => ({
    prompt: typeof search.prompt === "string" ? search.prompt.slice(0, 4000) : undefined,
  }),
  component: ScrollStudioPage,
});

function ScrollStudioPage() {
  return <ScrollStudioBuilder />;
}
