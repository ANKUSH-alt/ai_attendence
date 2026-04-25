"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem('token', response.data.access_token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-900/80" />
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Secure, Accurate, Effortless.
          </h1>
          <p className="text-xl text-blue-100/80 leading-relaxed">
            Welcome back to the world's most advanced AI attendance system.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your teacher dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 animate-in">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  placeholder="john@school.edu"
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:bg-primary/50 disabled:shadow-none transition-all mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
