import { ComingNext } from "@/components/ui/ComingNext";

export default function AdminPage() {
  return (
    <ComingNext
      screen="Admin / Internal Dashboard"
      description="Featured-listing mgmt, offer mgmt, survey mgmt, Quiet Cove leads, and analytics cards (bookings · leads · offer claims · redemptions · survey completions · featured clicks · estimated economic impact)."
      nextPrompt={`Build /admin: top-row KPI cards (bookings, leads captured, offer claims/redemptions, survey completions, featured clicks, estimated economic impact). Below: tabbed management views for Featured Placements (rank, tier, sponsor), Offers, Surveys, and Quiet Cove Leads. Leads table shows sync status from crm.listLeads().`}
    />
  );
}
