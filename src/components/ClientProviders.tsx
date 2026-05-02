'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';

const ParticleBg  = dynamic(() => import('@/components/ParticleBg'),  { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

export default function ClientProviders({ children }: { children?: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <CustomCursor />
      <ParticleBg />
      {children}
    </SessionProvider>
  );
}
