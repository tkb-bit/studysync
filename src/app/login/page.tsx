// app/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Update the import path below if your Alert components are located elsewhere
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const callbackError = searchParams.get('error');

  useEffect(() => {
    if (callbackError) {
      switch (callbackError) {
        case 'CredentialsSignin':
          setError('Invalid email or password provided.');
          break;
        default:
          setError('An unexpected error occurred during login. Please try again.');
          break;
      }
    }
  }, [callbackError]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // No try-catch needed here, signIn handles redirection and errors via URL callback
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/teacher', // Redirect to the teacher dashboard on success
    });
    
    // This part will only be reached if signIn fails without redirecting
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access your teacher portal."
    >
      <div className="grid gap-4">
        {message && (
            <Alert variant="default" className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-700" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid gap-2 relative">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-7 h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-[#2a358c] hover:bg-[#3a4a9f] text-white h-11 text-base">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Log In"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline font-semibold text-[#2a358c]">
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}