import { ComingNext } from "@/components/ui/ComingNext";

export default function NotificationsPage() {
  return (
    <ComingNext
      screen="Notifications"
      description="Type-categorized feed: event · system · offer · survey · safety. Local state only until web push is wired up."
      nextPrompt={`Build /notifications: grouped list from seed.notifications by category. Unread items show the Javits Gold dot. Add a 'Mark all read' control that updates local state. Safety-category notifications deep-link to /safety.`}
    />
  );
}
