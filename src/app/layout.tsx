'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <SessionProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
