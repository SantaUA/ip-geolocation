import { useContext } from 'react';
import { IPLookupContext } from './IPLookupContext';
import { IPLookupStore } from '../store';

export interface IPLookupContextValue {
  store: IPLookupStore;
}

export const useIPLookupStore = (): IPLookupStore => {
  const context = useContext(IPLookupContext);
  if (!context) {
    throw new Error('useIPLookupStore must be used within IPLookupProvider');
  }
  return context.store;
};
