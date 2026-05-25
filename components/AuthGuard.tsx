'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/', '/auth'];

// Previously had ADMIN_ROUTES, but all logged-in users should access all dashboard routes now
const ADMIN_ROUTES: string[] = [];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    // Is it a public route?
    const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '?'));

    // Unauthenticated users trying to access protected routes go to login
    if (!user && !isPublic) {
      router.push('/auth?mode=login');
      return;
    }

    // "Dropdown data management pages must be visible and accessible only to users with the ADMIN role.
    // All other pages must be visible and accessible to users with the USER role."
    if (user) {
      const requiresAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
      if (requiresAdmin && user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
    }

  }, [user, loading, pathname, router]);

  if (loading) return null;

  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '?'));
  if (!user && !isPublic) return null;

  if (user) {
    const requiresAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    if (requiresAdmin && user.role !== 'ADMIN') return null;
  }

  return <>{children}</>;
}
