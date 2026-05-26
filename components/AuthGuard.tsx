'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/', '/auth'];
const AUTH_ROUTES = ['/auth'];

// Previously had ADMIN_ROUTES, but all logged-in users should access all dashboard routes now
const ADMIN_ROUTES: string[] = [];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    // Is it a public route? (pathname never includes query params in Next.js App Router)
    const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    const isAuthRoute = AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

    // Logged-in users visiting /auth are redirected to the dashboard
    if (user && isAuthRoute) {
      router.push('/dashboard/products');
      return;
    }

    // Unauthenticated users trying to access protected routes go to login
    if (!user && !isPublic) {
      router.push('/auth?mode=login');
      return;
    }

    // Admin-only route enforcement
    if (user) {
      const requiresAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
      if (requiresAdmin && user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
    }

  }, [user, loading, pathname, router]);

  if (loading) return null;

  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

  // Don't render auth page for already logged-in users (redirect happens in useEffect)
  if (user && isAuthRoute) return null;

  if (!user && !isPublic) return null;

  if (user) {
    const requiresAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    if (requiresAdmin && user.role !== 'ADMIN') return null;
  }

  return <>{children}</>;
}
