'use client';

import { createContext, useContext, ReactNode } from 'react';

const GlobalStateContext = createContext<any>(null);

export function GlobalStateProvider({ children, initialState }: { children: ReactNode, initialState: any }) {
  return (
    <GlobalStateContext.Provider value={initialState}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalStateProvider');
  }
  return context;
}
