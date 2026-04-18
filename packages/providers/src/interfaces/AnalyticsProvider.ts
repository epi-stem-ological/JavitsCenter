import type { WayfindingEvent } from '@javits/domain';

/**
 * Analytics pipeline. Screens fire typed events; the provider handles
 * enrichment and transport. Prototype uses a console logger that prints
 * the production-shaped envelope so the schema is exercised.
 */
export interface AnalyticsProvider {
  track(event: WayfindingEvent): void;
  /** Flush buffered events. No-op in prototype. */
  flush(): Promise<void>;
}
