import type { IPEntry, IPGeolocationData } from '../types';
import { validateIP } from '../utils';
import { fetchIPGeolocation } from '../services';

type Listener = () => void;

const DEFAULT_ENTITY = {
  id: 1,
  ipAddress: '',
  isLoading: false,
  error: null,
  data: null,
};

export class IPLookupStore {
  private entries = new Map<number, IPEntry>([[DEFAULT_ENTITY.id, DEFAULT_ENTITY]]);
  private listeners = new Map<number, Set<Listener>>();
  private globalListeners = new Set<Listener>();
  private lastID = DEFAULT_ENTITY.id;
  private cachedEntries = new Map<number, IPEntry>();
  private cachedAllEntries: IPEntry[] | null = null;

  subscribe(id: number, callback: Listener): () => void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    this.listeners.get(id)!.add(callback);

    return () => {
      this.listeners.get(id)?.delete(callback);
    };
  }

  subscribeToAll(callback: Listener): () => void {
    this.globalListeners.add(callback);
    return () => {
      this.globalListeners.delete(callback);
    };
  }

  private notifyEntry(id: number) {
    this.cachedEntries.delete(id);
    this.listeners.get(id)?.forEach(callback => callback());
  }

  private notifyAll() {
    this.cachedAllEntries = null;
    this.globalListeners.forEach(callback => callback());
  }

  getEntry(id: number): IPEntry {
    if (!this.cachedEntries.has(id)) {
      const entry = this.entries.get(id);
      if (entry) {
        this.cachedEntries.set(id, entry);
      }
    }
    return this.cachedEntries.get(id) || DEFAULT_ENTITY;
  }

  getAllEntries(): IPEntry[] {
    if (!this.cachedAllEntries) {
      this.cachedAllEntries = Array.from(this.entries.values());
    }
    return this.cachedAllEntries;
  }

  addEntry(): void {
    this.lastID += 1;

    const newEntry: IPEntry = {
      id: this.lastID,
      ipAddress: '',
      isLoading: false,
      error: null,
      data: null,
    };

    this.entries.set(this.lastID, newEntry);
    this.notifyAll();
  }

  updateIP(id: number, ipAddress: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;

    this.entries.set(id, { ...entry, ipAddress, error: null });
    this.notifyEntry(id);
  }

  private setEntryError(id: number, error: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;

    this.entries.set(id, { ...entry, error });
    this.notifyEntry(id);
  }

  private setEntryLoading(id: number, isLoading: boolean): void {
    const entry = this.entries.get(id);
    if (!entry) return;

    this.entries.set(id, { ...entry, isLoading, error: null });
    this.notifyEntry(id);
  }

  private setEntryData(id: number, data: IPGeolocationData): void {
    const entry = this.entries.get(id);
    if (!entry) return;

    this.entries.set(id, { ...entry, isLoading: false, data, error: null });
    this.notifyEntry(id);
  }

  private setEntryFailed(id: number, error: string): void {
    const entry = this.entries.get(id);
    if (!entry) return;

    this.entries.set(id, { ...entry, isLoading: false, error });
    this.notifyEntry(id);
  }

  async lookupIP(id: number, ipAddress: string): Promise<void> {
    const validation = validateIP(ipAddress);
    if (!validation.valid) {
      this.setEntryError(id, validation.error || 'Invalid IP address');
      return;
    }

    this.setEntryLoading(id, true);

    try {
      const data = await fetchIPGeolocation(ipAddress);
      this.setEntryData(id, data);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unable to lookup IP address. Please try again.';
      this.setEntryFailed(id, errorMessage);
    }
  }

  removeEntry(id: number): void {
    this.entries.delete(id);
    this.listeners.delete(id);
    this.notifyAll();
  }
}

