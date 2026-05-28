'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/', '/auth'];
const AUTH_ROUTES = ['/auth'];
const ADMIN_ROUTES: string[] = [];

/** Strip the leading locale segment (/en, /lt, …) so /en/auth → /auth */
function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match) return match[2] || '/';
  return pathname;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const rawPathname = usePathname();
  const router = useRouter();

  // Capture the locale prefix (e.g. "/en" or "/lt") for locale-aware redirects
  const localePrefix = rawPathname.match(/^(\/[a-z]{2})(\/|$)/)?.[1] ?? '';
  const pathname = stripLocale(rawPathname);

  React.useEffect(() => {
    if (loading) return;

    const isPublic    = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    const isAuthRoute = AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

    // Logged-in users visiting /auth → dashboard
    if (user && isAuthRoute) {
      router.push(`${localePrefix}/dashboard/products`);
      return;
    }

    // Unauthenticated users on protected routes → login
    if (!user && !isPublic) {
      router.push(`${localePrefix}/auth?mode=login`);
      return;
    }

    // Admin-only route enforcement
    if (user) {
      const requiresAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
      if (requiresAdmin && user.role !== 'ADMIN') {
        router.push(`${localePrefix}/`);
        return;
      }
    }
  }, [user, loading, pathname, localePrefix, router]);

  if (loading) return null;

  const isPublic    = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

  if (user && isAuthRoute) return null;
  if (!user && !isPublic) return null;

  if (user) {
    const requiresAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    if (requiresAdmin && user.role !== 'ADMIN') return null;
  }

  return <>{children}</>;
}
