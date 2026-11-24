'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { DemoAccounts } from '@/components/auth/demo-accounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/useAuth';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

const fields = [
  {
    name: 'name',
    label: 'Full name',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Priya Sharma',
    icon: UserRound,
  },
  {
    name: 'email',
    label: 'Work email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@company.com',
    icon: Mail,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Create a password',
    icon: Lock,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Repeat your password',
    icon: Lock,
  },
] as const;

export default function RegisterPage() {
  const registerUser = useRegister();
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const password = useWatch({ control, name: 'password' }) ?? '';
  const rules = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'A number', met: /[0-9]/.test(password) },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card/90 p-6 shadow-xl backdrop-blur sm:p-8">
      <div aria-hidden className="bg-brand-gradient absolute inset-x-0 top-0 h-1" />

      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-1">
        <ShieldCheck className="size-5" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Start with read-only access, then ask an admin for a role.
      </p>

      <form
        onSubmit={handleSubmit((values) => registerUser.mutate(values))}
        noValidate
        className="mt-6 space-y-4"
      >
        {fields.map((f) => {
          const Icon = f.icon;
          const isPassword = f.type === 'password';
          return (
            <div key={f.name} className="space-y-2">
              <Label htmlFor={f.name}>{f.label}</Label>
              <div className="relative">
                <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={f.name}
                  type={isPassword && visible[f.name] ? 'text' : f.type}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  className={cn('h-10 pl-9', isPassword && 'pr-10')}
                  aria-invalid={!!errors[f.name]}
                  {...register(f.name)}
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setVisible((v) => ({ ...v, [f.name]: !v[f.name] }))}
                    className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={
                      visible[f.name]
                        ? `Hide ${f.label.toLowerCase()}`
                        : `Show ${f.label.toLowerCase()}`
                    }
                  >
                    {visible[f.name] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                )}
              </div>
              {f.name === 'password' && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {rules.map((rule) => (
                    <span
                      key={rule.label}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors',
                        rule.met
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'text-muted-foreground',
                      )}
                    >
                      <Check className="size-2.5" />
                      {rule.label}
                    </span>
                  ))}
                </div>
              )}
              {errors[f.name] && (
                <p className="text-sm text-destructive">{errors[f.name]?.message}</p>
              )}
            </div>
          );
        })}

        <Button
          type="submit"
          className="bg-brand-gradient shadow-brand h-10 w-full text-white hover:brightness-105"
          disabled={registerUser.isPending}
        >
          {registerUser.isPending ? 'Creating account…' : 'Create account'}
          {!registerUser.isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
        New accounts start as <span className="font-medium text-foreground">viewers</span>. An
        administrator can grant agent or admin permissions from Settings.
      </p>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>

      <DemoAccounts />
    </div>
  );
}
