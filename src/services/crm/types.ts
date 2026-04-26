import type { MarketingLead } from "@/types/models";

/**
 * CrmService — adapter for pushing marketing leads to an upstream CRM.
 * v1 target is Momentous (our events CRM); interface is CRM-agnostic so we
 * can swap in Salesforce, HubSpot, or a data warehouse later without churn.
 */
export interface CrmService {
  providerName(): string;
  syncLead(lead: MarketingLead): Promise<{ ok: boolean; externalId?: string; error?: string }>;
  listLeads(): Promise<MarketingLead[]>;
}
