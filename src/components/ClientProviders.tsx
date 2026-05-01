'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';

const Background3D = dynamic(() => import('@/components/Background3D'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

export default function ClientProviders({ children }: { children?: React.ReactNode }) {
  return (
    // refetchInterval: check session every 5 min (catches server-side expiry)
    // refetchOnWindowFocus: re-validate when tab regains focus (catches cross-tab logout)
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <CustomCursor />
      <Background3D />
      {children}
    </SessionProvider>
  );
}
