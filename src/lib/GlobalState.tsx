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
  return context; // Returns null if outside provider; callers use `|| {}` fallback
}
