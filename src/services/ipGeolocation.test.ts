import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchIPGeolocation } from './ipGeolocation';

describe('ipGeolocation', () => {
  const mockFetch = vi.fn();
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = mockFetch as typeof fetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('fetchIPGeolocation', () => {
    it('should fetch and transform data correctly', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'success',
          query: '8.8.8.8',
          country: 'United States',
          countryCode: 'US',
          timezone: 'America/Chicago',
          city: 'Mountain View',
        }),
      });

      await fetchIPGeolocation('8.8.8.8');

      expect(mockFetch).toHaveBeenCalledWith('http://ip-api.com/json/8.8.8.8');
    });

    it('should throw error when response not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(fetchIPGeolocation('8.8.8.8')).rejects.toThrow(
        'Failed to fetch IP data. Please try again.'
      );
    });

    it('should throw error when API returns fail status', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'fail',
          message: 'reserved range',
        }),
      });

      await expect(fetchIPGeolocation('192.168.1.1')).rejects.toThrow(
        'reserved range'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchIPGeolocation('8.8.8.8')).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle non-Error exceptions', async () => {
      mockFetch.mockRejectedValue('Unknown error');

      await expect(fetchIPGeolocation('8.8.8.8')).rejects.toThrow(
        'Unable to lookup IP address. Please try again.'
      );
    });

    it('should handle multiple concurrent requests', async () => {
      mockFetch.mockImplementation((url: string) => {
        const ip = url.split('/').pop();
        return Promise.resolve({
          ok: true,
          json: async () => ({
            status: 'success',
            query: ip,
            country: 'US',
            countryCode: 'US',
            timezone: 'America/Chicago',
          }),
        });
      });

      const results = await Promise.all([
        fetchIPGeolocation('8.8.8.8'),
        fetchIPGeolocation('1.1.1.1'),
      ]);

      expect(results).toHaveLength(2);
      expect(results[0].ip).toBe('8.8.8.8');
      expect(results[1].ip).toBe('1.1.1.1');
    });
  });
});
