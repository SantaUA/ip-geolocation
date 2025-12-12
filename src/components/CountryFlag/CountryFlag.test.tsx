import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountryFlag } from './CountryFlag';

describe('CountryFlag', () => {
  it('should render flag emoji for country code', () => {
    render(<CountryFlag countryCode="US" countryName="United States" />);

    const flag = screen.getByRole('img');
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveTextContent('🇺🇸');
  });

  it('should use country code in aria-label', () => {
    render(<CountryFlag countryCode="JP" countryName="Japan" />);

    const flag = screen.getByRole('img');
    expect(flag).toHaveAttribute('aria-label', 'JP flag');
  });

  it('should show country name in title attribute', () => {
    render(<CountryFlag countryCode="FR" countryName="France" />);

    const flag = screen.getByRole('img');
    expect(flag).toHaveAttribute('title', 'France');
  });

  it('should handle different country codes', () => {
    const countries = [
      { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧' },
      { code: 'DE', name: 'Germany', emoji: '🇩🇪' },
      { code: 'CA', name: 'Canada', emoji: '🇨🇦' },
    ];

    countries.forEach(({ code, name, emoji }) => {
      const { unmount } = render(<CountryFlag countryCode={code} countryName={name} />);
      
      const flag = screen.getByRole('img');
      expect(flag).toHaveTextContent(emoji);
      expect(flag).toHaveAttribute('title', name);
      
      unmount();
    });
  });
});

