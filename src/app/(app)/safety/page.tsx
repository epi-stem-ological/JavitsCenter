import { ComingNext } from "@/components/ui/ComingNext";

export default function SafetyPage() {
  return (
    <ComingNext
      screen="Safety & ADA"
      description="Three tabs: Accessibility (ADA locations with filters), Emergency (exits, AEDs, extinguishers, muster areas), Evacuation (muster point, steps, tap-to-call Public Safety)."
      nextPrompt={`Build /safety with three tabs. Accessibility tab = list of seed.adaLocations grouped by category with a filter row (restroom/entrance/elevator/ramp/...). Emergency tab = seed.emergencyLocations, similarly filtered. Evacuation tab = steps + safety instructions from seed.evacuation, a call-to-action phone tile (tel: ${"{evacuation.publicSafetyPhone}"}), and the muster point callout. All content sourced from the JKJCC evacuation plan.`}
    />
  );
}
