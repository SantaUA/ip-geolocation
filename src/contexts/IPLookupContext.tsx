import { createContext, useContext, useMemo } from 'react';
import { IPLookupStore } from '../store';

interface IPLookupContextValue {
  store: IPLookupStore;
}

const IPLookupContext = createContext<IPLookupContextValue | undefined>(undefined);

interface IPLookupProviderProps {
  children: React.ReactNode;
}

export const IPLookupProvider = ({ children }: IPLookupProviderProps) => {
  const store = useMemo(() => new IPLookupStore(), []);

  return (
    <IPLookupContext.Provider value={{ store }}>
      {children}
    </IPLookupContext.Provider>
  );
};

export const useIPLookupStore = () => {
  const context = useContext(IPLookupContext);
  if (context === undefined) {
    throw new Error('useIPLookupStore must be used within IPLookupProvider');
  }
  return context.store;
};
