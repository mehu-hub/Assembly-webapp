'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import * as React from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>AMS - Assembly Management System</title>
        <meta name="description" content="Professional assembly management system for products, components, inventory, and assembly calculations." />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <AuthProvider>
          <ToastProvider>
            <div className="flex h-screen overflow-hidden bg-slate-50">
              <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Header onMobileMenuOpen={() => setMobileOpen(true)} />
              <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
                {/* Global soft modern gradient & grid pattern background theme */}
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f090_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f090_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-indigo-100/40 via-transparent to-purple-100/40 pointer-events-none"></div>
                
                {/* Glow shapes */}
                <div className="absolute top-[20%] left-[20%] w-[32rem] h-[32rem] rounded-full bg-indigo-200/20 blur-3xl z-0 pointer-events-none" />
                <div className="absolute bottom-[20%] right-[20%] w-[32rem] h-[32rem] rounded-full bg-purple-200/20 blur-3xl z-0 pointer-events-none" />

                <div className="p-6 max-w-[1400px] mx-auto min-h-[calc(100vh-4rem)] flex flex-col relative z-10">
                  {children}
                  {/* Footer */}
                  <footer className="mt-auto py-6 text-center border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      Copyright &copy; {new Date().getFullYear()} Mehedi Hasan. All rights reserved.
                    </p>
                  </footer>
                </div>
              </main>
            </div>
          </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
