import { ComingNext } from "@/components/ui/ComingNext";

export default function EventsPage() {
  return (
    <ComingNext
      screen="Events"
      description="Searchable, filterable event list with sponsored/featured placements ranked above chronological. Seed data is ready in src/data/seed.ts."
      nextPrompt="Build /events as a client component: searchable input (by title/tag), filter pills (category), and a list of FeaturedEventCard components for sponsored placements on top, then a chronological list below. Use events + featured from src/data/seed.ts."
    />
  );
}
