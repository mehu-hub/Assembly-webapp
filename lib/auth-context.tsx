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
  login: (email: string, password?: string) => void;
  signup: (email: string, password?: string, name?: string) => void;
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

  const login = (email: string, password?: string) => {
    // Check if we have registered users
    const storedUsersJson = localStorage.getItem('ams_users');
    const users: any[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Find the user
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }

    const authUser: User = {
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };
    
    setUser(authUser);
    localStorage.setItem('ams_user', JSON.stringify(authUser));
    router.push('/');
  };

  const signup = (email: string, password?: string, name?: string) => {
    const storedUsersJson = localStorage.getItem('ams_users');
    const users: any[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error('Account with this email already exists.');
    }

    const newUser = {
      name: name || email.split('@')[0] || 'User',
      email: email,
      password: password,
      role: email === 'admin' || email.includes('admin') ? 'ADMIN' : 'USER',
    };
    
    users.push(newUser);
    localStorage.setItem('ams_users', JSON.stringify(users));

    const authUser: User = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'ADMIN' | 'USER',
    };

    setUser(authUser);
    localStorage.setItem('ams_user', JSON.stringify(authUser));
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ams_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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
