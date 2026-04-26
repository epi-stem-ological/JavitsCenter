import type { MarketingLead } from "@/types/models";
import type { CrmService } from "./types";

/**
 * MomentousAdapter — stub.
 * --------------------------------
 * Momentous is Javits' events CRM + booking system. Marketing wants Quiet
 * Cove leads to land as a *separate filterable list* so they can be
 * segmented by event type (e.g., only B2B conference attendees).
 *
 * Consent policy (ENFORCED HERE, not just at the call site):
 *  - A lead MUST carry a non-empty `consentCapturedAt` ISO timestamp.
 *  - A lead MUST carry a plausible contact (at minimum, an email).
 *  - A lead MUST route to a known `destination` ("momentous" for v1).
 * Defence-in-depth: the booking screen also checks marketingOptIn before
 * constructing a lead. This second gate catches drift if the call-site
 * check is ever removed, renamed, or bypassed.
 *
 * TODO (production):
 *  - use OAuth + tenant-specific Momentous API
 *  - write to a dedicated list tagged with the source event context
 *  - surface sync errors to the admin dashboard for triage
 *  - persist a signed audit record of every accepted lead
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class MomentousAdapter implements CrmService {
  private leads: MarketingLead[] = [];

  providerName() {
    return "Momentous (stub)";
  }

  async syncLead(lead: MarketingLead) {
    // --- Consent + integrity gates (all reasons returned explicitly so the
    // admin UI can surface *why* a sync was refused without guessing). ---
    if (!lead) {
      return { ok: false as const, error: "no-lead" };
    }
    if (!lead.consentCapturedAt || typeof lead.consentCapturedAt !== "string") {
      return { ok: false as const, error: "missing-consent-timestamp" };
    }
    if (lead.destination !== "momentous") {
      return { ok: false as const, error: "invalid-destination" };
    }
    if (!lead.email || !EMAIL_RE.test(lead.email)) {
      return { ok: false as const, error: "invalid-email" };
    }

    // TODO: real HTTP call. For now: fake success after a short delay.
    await new Promise((r) => setTimeout(r, 200));

    const updated: MarketingLead = {
      ...lead,
      syncStatus: "synced",
      destination: "momentous",
    };
    this.leads = [...this.leads.filter((l) => l.id !== lead.id), updated];
    return { ok: true as const, externalId: `momentous_${lead.id}` };
  }

  async listLeads() {
    return this.leads;
  }
}

export const crm: CrmService = new MomentousAdapter();
