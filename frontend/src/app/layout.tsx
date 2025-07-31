import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz Creation Platform',
  description: 'Create and manage quizzes with multiple question types',
  icons: {
    icon: 'https://public-assets.develops.today/favicon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-background min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
