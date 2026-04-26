import { ComingNext } from "@/components/ui/ComingNext";

export default function MapPage() {
  return (
    <ComingNext
      screen="Campus Map"
      description="Mock SVG floor plan with floor selector, search, destination cards, 'you are here', and accessible-route toggle. Driven by the wayfinding service behind the Cisco Spaces mock adapter."
      nextPrompt={`Build /map with three layers: Venues / ADA / Emergency. Render a 100x100 SVG floor plot positioned from VenueLocation.xy. Floor switcher: concourse · 1 · 3 · roof. Search bar calls wayfinding.search(). Tapping a venue shows a destination card and a 'Route me there' button that calls wayfinding.getRoute() with the accessible toggle. Use adaLocations + emergencyLocations from seed for the alternate layers.`}
    />
  );
}
