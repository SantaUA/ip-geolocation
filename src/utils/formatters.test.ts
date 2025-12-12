import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimezoneTime } from './formatters';
import { TIMEZONE_REGEX } from '../test/test-utils';

describe('formatters', () => {
  describe('formatTimezoneTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format time for valid timezone', () => {
      const result = formatTimezoneTime('America/New_York');
      
      expect(result).toMatch(TIMEZONE_REGEX);
    });

    it('should format time for UTC', () => {
      const result = formatTimezoneTime('UTC');
      
      expect(result).toMatch(TIMEZONE_REGEX);
    });

    it('should return "Invalid timezone" for invalid timezone', () => {
      const result = formatTimezoneTime('Invalid/Timezone');
      
      expect(result).toBe('Invalid timezone');
    });

    it('should handle different timezones', () => {
      const timezones = ['Europe/London', 'Asia/Tokyo', 'America/Los_Angeles'];

      timezones.forEach(timezone => {
        const result = formatTimezoneTime(timezone);
        expect(result).toMatch(TIMEZONE_REGEX);
      });
    });
  });
});
