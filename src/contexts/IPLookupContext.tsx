import { createContext } from 'react';
import { IPLookupStore } from '../store';

export interface IPLookupContextValue {
  store: IPLookupStore;
}

export const IPLookupContext = createContext<IPLookupContextValue | null>(null);
