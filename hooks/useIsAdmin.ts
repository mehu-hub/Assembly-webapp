import { useAuth } from '@/lib/auth-context';

/**
 * Returns true if the current logged-in user has the ADMIN role.
 * Use this hook to conditionally render CRUD controls.
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
}
