import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IPLookupProvider } from './IPLookupProvider';
import { useIPLookupStore } from './useIPLookupStore';

describe('IPLookupProvider', () => {
  it('should render children', () => {
    render(
      <IPLookupProvider>
        <div>Test Child</div>
      </IPLookupProvider>
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should provide store to children', () => {
    const TestComponent = () => {
      const store = useIPLookupStore();
      return <div>Store: {store ? 'exists' : 'missing'}</div>;
    };

    render(
      <IPLookupProvider>
        <TestComponent />
      </IPLookupProvider>
    );

    expect(screen.getByText('Store: exists')).toBeInTheDocument();
  });
});

