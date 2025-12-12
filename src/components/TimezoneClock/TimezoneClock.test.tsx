import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimezoneClock } from './TimezoneClock';
import { TIMEZONE_REGEX } from '../../test/test-utils';

describe('TimezoneClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render time from hook', () => {
    render(<TimezoneClock timezone="America/New_York" />);

    const timeElement = screen.getByTitle('America/New_York');
    expect(timeElement.textContent).toMatch(TIMEZONE_REGEX);
  });

  it('should pass timezone to hook and display it', () => {
    render(<TimezoneClock timezone="Asia/Tokyo" />);

    const timeElement = screen.getByTitle('Asia/Tokyo');
    expect(timeElement.textContent).toMatch(TIMEZONE_REGEX);
  });

  it('should show timezone in title attribute', () => {
    render(<TimezoneClock timezone="Europe/London" />);

    const element = screen.getByTitle('Europe/London');
    expect(element).toBeInTheDocument();
    expect(element.textContent).toMatch(TIMEZONE_REGEX);
  });

  it('should update when timezone changes', () => {
    const { rerender } = render(<TimezoneClock timezone="UTC" />);

    const initialElement = screen.getByTitle('UTC');
    expect(initialElement.textContent).toMatch(TIMEZONE_REGEX);

    rerender(<TimezoneClock timezone="America/New_York" />);

    const updatedElement = screen.getByTitle('America/New_York');
    expect(updatedElement.textContent).toMatch(TIMEZONE_REGEX);
  });
});
