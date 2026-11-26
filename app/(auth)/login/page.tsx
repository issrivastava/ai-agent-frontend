'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { DemoAccounts } from '@/components/auth/demo-accounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export default function LoginPage() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/90 p-6 shadow-xl backdrop-blur sm:p-8">
      <div aria-hidden className="bg-brand-gradient absolute inset-x-0 top-0 h-1" />

      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-1">
        <Sparkles className="size-5" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to your agent operations workspace.
      </p>

      <form
        onSubmit={handleSubmit((values) => login.mutate(values))}
        noValidate
        className="mt-6 space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@company.com"
              className="h-10 pl-9"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-[11px] text-muted-foreground">
              Protected with httpOnly cookies
            </span>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-10 pr-10 pl-9"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          className="bg-brand-gradient shadow-brand h-10 w-full text-white hover:brightness-105"
          disabled={login.isPending}
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
          {!login.isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to the platform?{' '}
        <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
          Create an account
        </Link>
      </p>

      <DemoAccounts />
    </div>
  );
}
