import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from '@/components/providers/AppProviders';

const geistSans = GeistSans({ 
  variable: '--font-geist-sans',
});

const geistMono = GeistMono({ 
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Linkdrop - Share and Discover',
  description: 'Linkdrop - AI-powered content discovery and sharing platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
