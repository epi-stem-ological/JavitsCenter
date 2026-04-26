/**
 * Javits App — Data Models
 * --------------------------------
 * Every model referenced in the App Development spec lives here. Keep these
 * platform-agnostic (no React/Next imports) so the RN port can reuse them.
 *
 * Models are intentionally thin. Domain rules live in services/.
 */

export type Role = "attendee" | "exhibitor" | "tenant" | "organizer";

// ---------- USERS ----------
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  marketingOptIn: boolean;
  createdAt: string;
}

// ---------- EVENTS ----------
export type EventCategory =
  | "trade-show"
  | "conference"
  | "consumer"
  | "private"
  | "community"
  | "summit";

export interface Event {
  id: string;
  title: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  hall: string;
  category: EventCategory;
  heroColor: "gold" | "green" | "blue";
  description: string;
  attendeeExpected: number;
  isPublic: boolean;
  tags: string[];
}

export interface FeaturedPlacement {
  id: string;
  eventId: string;
  tier: "premium" | "standard";
  startsAt: string;
  endsAt: string;
  sponsorName: string;
  rank: number;
}

// ---------- CAMPUS / WAYFINDING ----------
export type VenueCategory =
  | "hall"
  | "meeting-room"
  | "restroom"
  | "dining"
  | "service"
  | "entrance"
  | "amenity";

export interface VenueLocation {
  id: string;
  name: string;
  level: "concourse" | "1" | "3" | "4" | "roof";
  category: VenueCategory;
  xy: [number, number]; // abstract 0-100 map coords; mock only
  accessible: boolean;
  description?: string;
}

export interface Route {
  fromId: string;
  toId: string;
  distanceMeters: number;
  accessiblePath: boolean;
  steps: string[];
}

// ---------- QUIET COVE ----------
export interface QuietCovePod {
  id: string;
  name: string;
  capacity: 1 | 2 | 4;
  level: VenueLocation["level"];
  amenities: string[];
  hourlyRateUSD: number;
}

export interface QuietCoveBooking {
  id: string;
  podId: string;
  userContact: { firstName: string; lastName: string; email: string; phone?: string };
  startsAt: string;
  endsAt: string;
  marketingOptIn: boolean;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

// Separated from booking so it can be sync'd to CRM independently.
// The marketing team needs leads filterable even when bookings are cancelled.
export interface MarketingLead {
  id: string;
  sourceBookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventContext?: string;
  consentCapturedAt: string;
  syncStatus: "pending" | "synced" | "failed";
  destination: "momentous" | "none";
}

// ---------- PARTNER OFFERS / ECONOMIC IMPACT ----------
export type OfferCategory = "dining" | "attraction" | "hotel" | "transit" | "retail";

export interface PartnerOffer {
  id: string;
  partnerName: string;
  category: OfferCategory;
  neighborhood: string;
  headline: string;
  body: string;
  discountLabel: string;
  estimatedTicketUSD: number;
  activeFrom: string;
  activeTo: string;
}

export interface OfferRedemption {
  id: string;
  offerId: string;
  userId?: string;
  action: "view" | "claim" | "redeem";
  at: string;
  impactEstimateUSD?: number;
}

// ---------- SURVEYS ----------
export type SurveyQuestionType = "rating" | "single-choice" | "multi-choice" | "text";

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  prompt: string;
  options?: string[]; // for single/multi choice
  scale?: number;     // for rating
}

export interface Survey {
  id: string;
  title: string;
  eventId?: string;
  estMinutes: number;
  rewardLabel: string;
  questions: SurveyQuestion[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId?: string;
  answers: Record<string, string | string[] | number>;
  completedAt: string;
}

export interface Reward {
  id: string;
  label: string;
  type: "coupon" | "raffle" | "recognition";
  redeemableAt: string;
}

// ---------- NOTIFICATIONS ----------
export interface Notification {
  id: string;
  title: string;
  body: string;
  category: "event" | "system" | "offer" | "survey" | "safety";
  createdAt: string;
  read: boolean;
}

// ---------- INTEGRATION / OPS ----------
export interface IntegrationConfig {
  key: "cisco-spaces" | "momentous" | "cultivated" | "notifications" | "payments";
  enabled: boolean;
  notes?: string;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  props: Record<string, string | number | boolean>;
  at: string;
}

// ---------- ADA + EMERGENCY (from the Replit follow-up) ----------
export interface ADALocation {
  id: string;
  category:
    | "restroom"
    | "entrance"
    | "elevator"
    | "ramp"
    | "service-animal-relief"
    | "assistive-listening"
    | "wheelchair-seating"
    | "parking"
    | "tactile-signage"
    | "nursing";
  name: string;
  level: VenueLocation["level"];
  xy: [number, number];
  notes?: string;
}

export interface EmergencyLocation {
  id: string;
  category:
    | "exit"
    | "aed"
    | "fire-extinguisher"
    | "fire-hose"
    | "pull-station"
    | "assistance-muster"
    | "stairwell"
    | "egress-corridor";
  name: string;
  level: VenueLocation["level"];
  xy: [number, number];
}

export interface EvacuationInfo {
  musterPoint: { name: string; address: string };
  publicSafetyPhone: string;
  steps: string[];
  safetyInstructions: string[];
}
