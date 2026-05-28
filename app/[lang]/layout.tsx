// @ts-expect-error - Next.js font issue
import { Geist } from 'next/font/google';
import '@/app/globals.css';
import * as React from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthGuard } from '@/components/AuthGuard';
import { cn } from "@/lib/utils";

import { DictionaryProvider } from '@/components/DictionaryProvider';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/lib/i18n';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <title>AMS - Assembly Management System</title>
        <meta
          name="description"
          content="Professional assembly management system for products, components, inventory, and assembly calculations."
        />
      </head>

      <body className="min-h-screen bg-background font-sans antialiased text-foreground" suppressHydrationWarning>
        <DictionaryProvider dictionary={dictionary}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />

                  <main className="flex-1 relative bg-background flex flex-col">
                    <div className="absolute inset-0 z-0 bg-grid-pattern bg-[size:32px_32px] pointer-events-none" />
                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-indigo-950/40 via-transparent to-purple-950/40 pointer-events-none" />

                    <div className="absolute top-[20%] left-[20%] w-[32rem] h-[32rem] rounded-full bg-indigo-600/8 blur-3xl z-0 pointer-events-none" />
                    <div className="absolute bottom-[20%] right-[20%] w-[32rem] h-[32rem] rounded-full bg-purple-600/8 blur-3xl z-0 pointer-events-none" />

                    <div className="relative z-10 p-6 max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
                      <div className="flex-1 flex flex-col">
                        <AuthGuard>{children}</AuthGuard>
                      </div>
                    </div>

                    <Footer />
                  </main>
                </div>
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}