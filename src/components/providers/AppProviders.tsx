"use client";

import type { ReactNode } from 'react';

// This component can be used to wrap multiple context providers
// For now, it's simple, but can be extended.
export function AppProviders({ children }: { children: ReactNode }) {
  // Example: <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  // For now, just return children as Zustand handles its own provider implicitly
  return <>{children}</>;
}
