import { nanoid } from "nanoid";
import type { AnalyticsEvent } from "@/types/models";

/**
 * Tiny client-side analytics shim — hardened.
 * --------------------------------
 *  - Typed event registry: only events declared in `AnalyticsEventMap` below
 *    can be tracked. Renaming an event or changing its payload now forces a
 *    type error everywhere it's emitted (and makes the admin dashboard's
 *    aggregations durable).
 *  - PII blocklist: refuses to track any prop whose key matches an identity
 *    pattern. Belt-and-suspenders against a drift where someone passes the
 *    attendee's email into a track() call. Drops the whole event on violation
 *    rather than silently redacting, so the issue surfaces in dev.
 *  - Ring buffer: caps memory at BUFFER_LIMIT events so a long kiosk session
 *    doesn't leak.
 *
 * Production hook points:
 *  - `flush()` should beacon to a server route or forward to Segment/Posthog
 *  - correlate with CRM identity only once the user is authenticated
 */

const BUFFER_LIMIT = 500;

/** Keys that must never appear in a tracked event's props. */
const PII_KEY_PATTERN =
  /^(email|phone|firstname|lastname|name|fullname|address|zip|postcode|ssn|dob|birthdate)$/i;

/**
 * Typed registry of every analytics event the app emits.
 * Extend this union when you add a new event. `track()` is typed against it.
 */
export type AnalyticsEventMap = {
  role_selected: { role: "attendee" | "exhibitor" | "tenant" | "organizer" };
  event_view: { id: string };
  offer_claimed: { id: string; partner: string; est: number };
  survey_completed: { id: string };
  quiet_cove_booked: { podId: string };
  marketing_consent_granted: { at: string };
  marketing_consent_revoked: { at: string };
  safety_tap_to_call: {};
  kiosk_idle_reset: {};
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

class Analytics {
  private buffer: AnalyticsEvent[] = [];

  track<K extends AnalyticsEventName>(name: K, props: AnalyticsEventMap[K] = {} as AnalyticsEventMap[K]) {
    // PII guard — reject the whole event so the violation is visible in dev.
    for (const key of Object.keys(props ?? {})) {
      if (PII_KEY_PATTERN.test(key)) {
        if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn(
            `[analytics] dropped "${name}" — prop key "${key}" matches PII blocklist. Hash or drop the field.`
          );
        }
        return;
      }
    }

    const evt: AnalyticsEvent = {
      id: nanoid(),
      name,
      props: props as Record<string, string | number | boolean>,
      at: new Date().toISOString(),
    };

    // Ring buffer — keep memory bounded.
    this.buffer.push(evt);
    if (this.buffer.length > BUFFER_LIMIT) {
      this.buffer = this.buffer.slice(-BUFFER_LIMIT);
    }

    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", name, props);
    }
  }

  /** Read-only snapshot for the admin analytics panel. */
  events() {
    return [...this.buffer];
  }

  /** Drain and return. Use when shipping to a server endpoint. */
  flush() {
    const drained = this.buffer;
    this.buffer = [];
    return drained;
  }
}

export const analytics = new Analytics();
