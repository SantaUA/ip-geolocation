import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IPLookupStore } from './IPLookupStore';
import type { IPGeolocationData } from '../types';

vi.mock('../services', () => ({
  fetchIPGeolocation: vi.fn(),
}));

import { fetchIPGeolocation } from '../services';

describe('IPLookupStore', () => {
  let store: IPLookupStore;

  beforeEach(() => {
    store = new IPLookupStore();
    vi.clearAllMocks();
  });

  it('should initialize with default entry', () => {
    const entries = store.getAllEntries();
    
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe(1);
    expect(entries[0].ipAddress).toBe('');
  });

  it('should add new entry', () => {
    store.addEntry();
    
    const entries = store.getAllEntries();
    expect(entries).toHaveLength(2);
    expect(entries[1].id).toBe(2);
  });

  it('should get entry by id', () => {
    const entry = store.getEntry(1);
    
    expect(entry.id).toBe(1);
  });

  it('should update IP address', () => {
    store.updateIP(1, '8.8.8.8');
    
    const entry = store.getEntry(1);
    expect(entry.ipAddress).toBe('8.8.8.8');
  });

  it('should remove entry', () => {
    store.addEntry();
    expect(store.getAllEntries()).toHaveLength(2);
    
    store.removeEntry(2);
    expect(store.getAllEntries()).toHaveLength(1);
  });

  it('should notify subscribers on update', () => {
    const listener = vi.fn();
    store.subscribe(1, listener);
    
    store.updateIP(1, '8.8.8.8');
    
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should notify global subscribers on add', () => {
    const listener = vi.fn();
    store.subscribeToAll(listener);
    
    store.addEntry();
    
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should handle successful IP lookup', async () => {
    const mockData: IPGeolocationData = {
      ip: '8.8.8.8',
      ip_decimal: 0,
      country: 'United States',
      country_iso: 'US',
      time_zone: 'America/Chicago',
    };

    vi.mocked(fetchIPGeolocation).mockResolvedValue(mockData);
    
    await store.lookupIP(1, '8.8.8.8');
    
    const entry = store.getEntry(1);
    expect(entry.data).toEqual(mockData);
    expect(entry.error).toBeNull();
  });

  it('should handle validation errors', async () => {
    await store.lookupIP(1, 'invalid-ip');
    
    const entry = store.getEntry(1);
    expect(entry.error).toBe('Please enter a valid IPv4 or IPv6 address');
    expect(vi.mocked(fetchIPGeolocation)).not.toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    vi.mocked(fetchIPGeolocation).mockRejectedValue(new Error('Network error'));
    
    await store.lookupIP(1, '8.8.8.8');
    
    const entry = store.getEntry(1);
    expect(entry.error).toBe('Network error');
  });

  it('should set loading state during lookup', async () => {
    vi.mocked(fetchIPGeolocation).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    const lookupPromise = store.lookupIP(1, '8.8.8.8');
    
    expect(store.getEntry(1).isLoading).toBe(true);
    
    await lookupPromise;
    expect(store.getEntry(1).isLoading).toBe(false);
  });
});
