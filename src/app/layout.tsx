'use client';

import { Provider } from '@/components/ui/provider';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <SessionProvider>
          <Provider>{ children }</Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
