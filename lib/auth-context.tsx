'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('ams_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('ams_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      name: name || email.split('@')[0] || 'User',
      email: email,
      role: email === 'admin' || email.includes('admin') ? 'ADMIN' : 'USER',
    };
    setUser(newUser);
    localStorage.setItem('ams_user', JSON.stringify(newUser));
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ams_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
