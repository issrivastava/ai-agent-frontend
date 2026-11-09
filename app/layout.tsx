import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'AI Agent Platform',
  description: 'Multi-agent customer support dispatch and data extraction',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
