import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { IPLookupProvider } from './IPLookupProvider';
import { useIPLookupStore } from './useIPLookupStore';

describe('useIPLookupStore', () => {
  it('should return store when used inside provider', () => {
    const { result } = renderHook(() => useIPLookupStore(), {
      wrapper: IPLookupProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.getAllEntries).toBeDefined();
    expect(result.current.addEntry).toBeDefined();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useIPLookupStore());
    }).toThrow('useIPLookupStore must be used within IPLookupProvider');
  });

  it('should return working store instance', () => {
    const { result } = renderHook(() => useIPLookupStore(), {
      wrapper: IPLookupProvider,
    });

    const initialEntries = result.current.getAllEntries();
    expect(initialEntries).toHaveLength(1);

    result.current.addEntry();
    const updatedEntries = result.current.getAllEntries();
    expect(updatedEntries).toHaveLength(2);
  });
});

