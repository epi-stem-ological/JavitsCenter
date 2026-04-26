import { notFound } from "next/navigation";
import { events } from "@/data/seed";
import { ComingNext } from "@/components/ui/ComingNext";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);
  if (!event) return notFound();

  return (
    <ComingNext
      screen={event.title}
      description={`${event.hall} · ${event.organizer}. Detail screen coming next — hero colored ${event.heroColor}, save/share buttons, sessions, directions, consent for marketing.`}
      nextPrompt={`Build /events/${event.id} detail page: hero colored via event.heroColor, title, dates, hall, organizer, description. Include 'Save' and 'Share' buttons (save toggles useApp.toggleSaveEvent). Below: directions shortcut → /map, and a 'Book Quiet Cove nearby' shortcut. Use the event record from src/data/seed.ts.`}
    />
  );
}
