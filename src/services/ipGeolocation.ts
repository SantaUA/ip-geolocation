import type { IPGeolocationData } from '../types';

const API_URL = 'http://ip-api.com/json';

export async function fetchIPGeolocation(ip: string): Promise<IPGeolocationData> {
  try {
    const response = await fetch(`${API_URL}/${ip}`);

    if (!response.ok) {
      throw new Error('Failed to fetch IP data. Please try again.');
    }

    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error(data.message || 'Invalid IP address');
    }

    return {
      ip: data.query,
      ip_decimal: 0,
      country: data.country,
      country_iso: data.countryCode,
      time_zone: data.timezone,
      city: data.city,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unable to lookup IP address. Please try again.');
  }
}

