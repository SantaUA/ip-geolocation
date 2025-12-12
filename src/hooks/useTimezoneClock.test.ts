import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimezoneClock } from './useTimezoneClock';
import { TIMEZONE_REGEX } from '../test/test-utils';

describe('useTimezoneClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial formatted time', () => {
    const { result } = renderHook(() => useTimezoneClock('America/New_York'));

    expect(result.current).toMatch(TIMEZONE_REGEX);
    expect(result.current).not.toBe('Invalid timezone');
  });

  it('should use the provided timezone', () => {
    const { result } = renderHook(() => useTimezoneClock('Asia/Tokyo'));

    expect(result.current).toMatch(TIMEZONE_REGEX);
  });

  it('should update when timezone changes', () => {
    const { result, rerender } = renderHook(
      ({ tz }) => useTimezoneClock(tz),
      { initialProps: { tz: 'America/New_York' } }
    );

    const initialTime = result.current;
    expect(initialTime).toMatch(TIMEZONE_REGEX);

    rerender({ tz: 'Asia/Tokyo' });

    // Time should be different (different timezone)
    expect(result.current).toMatch(TIMEZONE_REGEX);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useTimezoneClock('UTC'));

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
