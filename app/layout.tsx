import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RegisterSW } from '@/components/pwa/register-sw';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: {
    default: 'AI Agent Platform',
    template: '%s · AI Agent Platform',
  },
  description:
    'Multi-agent operations for support dispatch, approval-gated actions, and document data extraction.',
  appleWebApp: {
    capable: true,
    title: 'AI Agent Platform',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdf7f7' },
    { media: '(prefers-color-scheme: dark)', color: '#140c0d' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster richColors />
          <RegisterSW />
        </ThemeProvider>
      </body>
    </html>
  );
}
