'use client';

import { useState } from 'react';
import { BadgeCheck, Pencil, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { fireConfetti } from '@/components/shared/confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStore } from '@/hooks/use-local-store';
import { useAuth } from '@/providers/auth-provider';

type ProfileDetails = {
  phone: string;
  company: string;
  timezone: string;
  bio: string;
};

const DETAILS_KEY = 'agent-platform:profile-details';
const EMPTY_DETAILS: ProfileDetails = { phone: '', company: '', timezone: '', bio: '' };

const optionalFields: { key: keyof ProfileDetails; label: string; placeholder: string }[] = [
  { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
  { key: 'company', label: 'Company', placeholder: 'Acme Logistics' },
  { key: 'timezone', label: 'Time zone', placeholder: 'Asia/Kolkata' },
  { key: 'bio', label: 'Bio', placeholder: 'One line about you and your team' },
];

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * "Your profile" card with a profile-completion bar. Identity fields come from
 * the account; the optional detail fields live on this device until the
 * backend grows matching columns.
 */
export function ProfileCard() {
  const { user } = useAuth();
  const [details, setDetails] = useLocalStore<ProfileDetails>(DETAILS_KEY, EMPTY_DETAILS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDetails>(details);

  const filledOptional = optionalFields.filter(
    (field) => (details[field.key] ?? '').trim().length > 0,
  ).length;
  // name + email + role always exist, then the optional detail fields.
  const total = 3 + optionalFields.length;
  const done = 3 + filledOptional;
  const percent = Math.round((done / total) * 100);
  const missing = optionalFields.filter((field) => !(details[field.key] ?? '').trim());

  const summary =
    percent === 100
      ? 'Profile complete — everything is filled in.'
      : filledOptional === 0
        ? 'Add a few details to help teammates recognise you.'
        : `${missing.length} detail${missing.length === 1 ? '' : 's'} left: ${missing
            .map((field) => field.label.toLowerCase())
            .join(', ')}.`;

  const save = () => {
    setDetails(draft);
    setEditing(false);
    const nowFilled =
      3 + optionalFields.filter((field) => (draft[field.key] ?? '').trim().length > 0).length;
    const nowPercent = Math.round((nowFilled / total) * 100);
    toast.success(nowPercent === 100 ? 'Profile complete — nice work!' : 'Profile details saved');
    if (nowPercent === 100) fireConfetti();
  };

  return (
    <Card className="relative mb-5 overflow-hidden">
      <div aria-hidden className="bg-brand-gradient absolute inset-x-0 top-0 h-0.5" />
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
            {initialsOf(user.name)}
          </span>
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{user.name}</CardTitle>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-1 capitalize">
            <BadgeCheck className="size-3" />
            {user.role}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (editing) setDraft(details);
            setEditing(!editing);
          }}
        >
          {editing ? 'Cancel' : <Pencil className="size-3.5" />}
          {editing ? null : 'Edit details'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Profile completion</span>
            <span className="font-semibold">{percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="bg-brand-gradient h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {percent === 100 ? (
              <Sparkles className="size-3 text-brand-1" />
            ) : (
              <span aria-hidden className="size-1.5 rounded-full bg-brand-1" />
            )}
            {summary}
          </p>
        </div>

        {editing ? (
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            {optionalFields
              .filter((field) => field.key !== 'bio')
              .map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={`profile-${field.key}`} className="text-xs">
                    {field.label}
                  </Label>
                  <Input
                    id={`profile-${field.key}`}
                    value={draft[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                    className="h-9"
                  />
                </div>
              ))}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="profile-bio" className="text-xs">
                Bio
              </Label>
              <Textarea
                id="profile-bio"
                value={draft.bio}
                placeholder={optionalFields.find((field) => field.key === 'bio')?.placeholder}
                onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                rows={2}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button
                type="submit"
                size="sm"
                className="bg-brand-gradient text-white hover:brightness-105"
              >
                <Save className="size-3.5" />
                Save details
              </Button>
            </div>
          </form>
        ) : (
          <dl className="grid gap-2 sm:grid-cols-2">
            {optionalFields.map((field) => (
              <div key={field.key} className="rounded-lg bg-muted/50 px-3 py-2">
                <dt className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  {field.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm">
                  {(details[field.key] || '').trim() || (
                    <span className="text-muted-foreground/70">Not added yet</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
