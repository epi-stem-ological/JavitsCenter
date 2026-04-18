export type Id = string;

export type Unsubscribe = () => void;

export type Iso8601 = string;

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
}

export type PermissionStatus =
  | 'unknown'
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'restricted';
