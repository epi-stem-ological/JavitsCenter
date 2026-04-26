import { ComingNext } from "@/components/ui/ComingNext";

export default function QuietCovePage() {
  return (
    <ComingNext
      screen="Quiet Cove"
      description="Pod list → pod detail → time slot → contact info (+ explicit marketing opt-in) → confirmation. Marketing lead is stored separately from booking for CRM sync."
      nextPrompt={`Build /quiet-cove multi-step booking: (1) pod list from seed.quietCovePods grouped by level, (2) pod detail + time-slot picker, (3) contact form (name, email, phone) + marketingOptIn checkbox (UNCHECKED by default — legal requires explicit opt-in), (4) success screen. On submit, persist a QuietCoveBooking and, if opt-in true, a MarketingLead via crm.syncLead() when flags.crmSync() is true.`}
    />
  );
}
