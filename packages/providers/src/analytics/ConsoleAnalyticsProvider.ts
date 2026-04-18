import type { WayfindingEvent, AnalyticsEnvelope } from '@javits/domain';
import type { AnalyticsProvider } from '../interfaces/AnalyticsProvider.js';

/**
 * Prototype analytics transport. Prints the production-shaped envelope to
 * the console so the event schema is exercised during demos. Swap for a real
 * transport (Segment, Rudderstack, warehouse ingest) in production.
 */
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  private readonly sessionId: string;
  private readonly anonymousUserId: string;

  constructor(opts: { sessionId: string; anonymousUserId: string }) {
    this.sessionId = opts.sessionId;
    this.anonymousUserId = opts.anonymousUserId;
  }

  track(event: WayfindingEvent): void {
    const envelope: AnalyticsEnvelope = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      anonymousUserId: this.anonymousUserId,
    };
    // eslint-disable-next-line no-console
    console.log('[analytics]', envelope.event.name, envelope);
  }

  async flush(): Promise<void> {
    return;
  }
}
