import { integrations } from "@/data/seed";
import type { IntegrationConfig } from "@/types/models";

/**
 * Feature flags / integration toggles.
 * --------------------------------
 * Drives conditional UI — e.g., hide the "Sync to Momentous" button until
 * the integration is enabled. Sourced from seed data today; swap to a
 * remote config fetch in production.
 */
export function isEnabled(key: IntegrationConfig["key"]) {
  return integrations.find((i) => i.key === key)?.enabled === true;
}

export const flags = {
  wayfinding: () => isEnabled("cisco-spaces"),
  crmSync: () => isEnabled("momentous"),
  surveysDeepLink: () => isEnabled("cultivated"),
  pushNotifications: () => isEnabled("notifications"),
  payments: () => isEnabled("payments"),
};
