import { createFileRoute } from "@tanstack/react-router";
import { ScrollStudioBuilder } from "@/components/scroll-studio/ScrollStudioBuilder";

export const Route = createFileRoute("/scroll-studio/")({
  component: ScrollStudioPage,
});

function ScrollStudioPage() {
  return (
    <ScrollStudioBuilder />
  );
}