export interface IPEntry {
  id: number;
  ipAddress: string;
  isLoading: boolean;
  error: string | null;
  data: IPGeolocationData | null;
}

export interface IPGeolocationData {
  ip: string;
  ip_decimal: number;
  country: string;
  country_iso: string;
  time_zone: string;
  city?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

