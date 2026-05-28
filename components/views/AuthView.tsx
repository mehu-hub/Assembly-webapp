'use client';

import * as React from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useSearchParams } from 'next/navigation';
import { Wrench, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/lib/auth-context';
import { useDictionary } from '@/components/DictionaryProvider';

function AuthForm() {
  const dict = useDictionary();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = React.useState(true);
  const { login, signup } = useAuth();
  const [error, setError] = React.useState('');

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        login(email, password);
      } else {
        signup(email, password, name);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
              <Wrench size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? (dict?.auth?.login || 'Welcome back') : (dict?.auth?.signup || 'Create an account')}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {isLogin
              ? 'Enter your credentials to access the assembly dashboard.'
              : 'Enter your details below to create your account and get started.'}
          </p>
        </div>

        <Card className="border-border shadow-sm bg-card">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-xl">{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin
                  ? 'Use your email and password to log in.'
                  : 'Fill out the form to register for a new account.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">{dict?.common?.name || 'Full Name'}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">{dict?.auth?.email || 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{dict?.auth?.password || 'Password'}</Label>
                  {isLogin && (
                    <Link href="#" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-10">
                {isLogin ? (dict?.auth?.login || 'Sign In') : (dict?.auth?.signup || 'Create Account')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              type="button"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <React.Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    }>
      <AuthForm />
    </React.Suspense>
  );
}
