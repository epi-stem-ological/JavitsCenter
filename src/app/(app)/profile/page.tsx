import { ComingNext } from "@/components/ui/ComingNext";

export default function ProfilePage() {
  return (
    <ComingNext
      screen="Profile"
      description="Role switcher, marketing preference center, saved events, claimed offers, and a reset for the demo."
      nextPrompt={`Build /profile: display current role with a 'Switch role' control (→ /role). Marketing preferences toggle writes useApp.setMarketingOptIn. Show stats: saved events count, claimed offers count, completed surveys count. Add a 'Reset app' danger action bound to useApp.resetAll for demos.`}
    />
  );
}
