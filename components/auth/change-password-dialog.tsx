'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Check, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '@/hooks/useAuth';
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

const fields = [
  {
    name: 'currentPassword',
    label: 'Current password',
    autoComplete: 'current-password',
    placeholder: 'Enter your current password',
  },
  {
    name: 'newPassword',
    label: 'New password',
    autoComplete: 'new-password',
    placeholder: 'Create a new password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm new password',
    autoComplete: 'new-password',
    placeholder: 'Repeat your new password',
  },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const changePassword = useChangePassword();
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  const password = useWatch({ control, name: 'newPassword' }) ?? '';
  const rules = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'A number', met: /[0-9]/.test(password) },
  ];

  function close() {
    reset();
    setVisible({});
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand-1">
              <KeyRound className="size-4" />
            </span>
            Change password
          </DialogTitle>
          <DialogDescription>
            Confirm your current password, then choose a new one. You stay signed in.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) =>
            changePassword.mutate(values, { onSuccess: close }),
          )}
          noValidate
          className="space-y-4"
        >
          {fields.map((f) => {
            return (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={f.name}>{f.label}</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id={f.name}
                    type={visible[f.name] ? 'text' : 'password'}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    className="h-10 pr-10 pl-9"
                    aria-invalid={!!errors[f.name]}
                    {...register(f.name)}
                  />
                  <button
                    type="button"
                    onClick={() => setVisible((v) => ({ ...v, [f.name]: !v[f.name] }))}
                    className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={visible[f.name] ? `Hide ${f.label.toLowerCase()}` : `Show ${f.label.toLowerCase()}`}
                  >
                    {visible[f.name] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {f.name === 'newPassword' && (
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-gradient shadow-brand text-white hover:brightness-105"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? 'Updating…' : 'Update password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
