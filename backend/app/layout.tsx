import type { ReactNode } from 'react';

export const metadata = {
  title: 'Voziba Backend API',
  description: 'Next.js 15 & MongoDB Backend API Server for Voziba Marketplace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
