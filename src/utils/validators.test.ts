import { describe, it, expect } from 'vitest';
import {
  isValidIPv4,
  isValidIPv6,
  isValidIP,
  validateIP,
} from './validators';

describe('validators', () => {
  describe('isValidIPv4', () => {
    it('should return true for valid IPv4 addresses', () => {
      expect(isValidIPv4('192.168.1.1')).toBe(true);
      expect(isValidIPv4('8.8.8.8')).toBe(true);
    });

    it('should return false for invalid IPv4 addresses', () => {
      expect(isValidIPv4('256.1.1.1')).toBe(false);
      expect(isValidIPv4('not-an-ip')).toBe(false);
    });
  });

  describe('isValidIPv6', () => {
    it('should return true for valid IPv6 addresses', () => {
      expect(isValidIPv6('2001:db8:85a3::8a2e:370:7334')).toBe(true);
      expect(isValidIPv6('::1')).toBe(true);
    });

    it('should return false for invalid IPv6 addresses', () => {
      expect(isValidIPv6('192.168.1.1')).toBe(false);
      expect(isValidIPv6('not-an-ip')).toBe(false);
    });
  });

  describe('isValidIP', () => {
    it('should return true for valid IPv4 or IPv6', () => {
      expect(isValidIP('192.168.1.1')).toBe(true);
      expect(isValidIP('::1')).toBe(true);
    });

    it('should return false for invalid IPs', () => {
      expect(isValidIP('not-an-ip')).toBe(false);
    });
  });

  describe('validateIP', () => {
    it('should return valid result for valid IPs', () => {
      const result = validateIP('8.8.8.8');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error for empty string', () => {
      const result = validateIP('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('IP address is required');
    });

    it('should return error for invalid IP', () => {
      const result = validateIP('invalid-ip');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid IPv4 or IPv6 address');
    });

    it('should trim whitespace', () => {
      const result = validateIP('  8.8.8.8  ');
      expect(result.valid).toBe(true);
    });
  });
});
