'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import * as React from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>AMS - Assembly Management System</title>
        <meta name="description" content="Professional assembly management system for products, components, inventory, and assembly calculations." />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <AuthProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen">
              <Header onMobileMenuOpen={() => {}} />
              <main className="flex-1 relative bg-slate-50/50 flex flex-col">
                {/* Grid pattern background */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f090_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f090_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-indigo-100/40 via-transparent to-purple-100/40 pointer-events-none" />
                {/* Glow shapes */}
                <div className="absolute top-[20%] left-[20%] w-[32rem] h-[32rem] rounded-full bg-indigo-200/20 blur-3xl z-0 pointer-events-none" />
                <div className="absolute bottom-[20%] right-[20%] w-[32rem] h-[32rem] rounded-full bg-purple-200/20 blur-3xl z-0 pointer-events-none" />

                <div className="relative z-10 p-6 max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    {children}
                  </div>
                </div>
                <Footer />
              </main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
