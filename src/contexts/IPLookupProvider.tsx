import { useMemo } from 'react';
import { IPLookupStore } from '../store';
import { IPLookupContext } from './IPLookupContext';

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
