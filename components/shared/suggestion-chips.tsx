'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Suggestion = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

type SuggestionChipsProps = {
  suggestions: Suggestion[];
  label?: string;
  className?: string;
};

/**
 * A row of "next best action" chips used in empty states, the command palette,
 * and the dashboard. Each chip either navigates (href) or runs an action.
 */
export function SuggestionChips({ suggestions, label, className }: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {label && (
        <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          const content = (
            <>
              {Icon && <Icon className="size-3.5" />}
              <span>{suggestion.label}</span>
              <ArrowRight className="size-3 opacity-50" aria-hidden />
            </>
          );
          const className =
            'inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium shadow-xs transition-all hover:-translate-y-px hover:border-brand-1/40 hover:text-brand-1 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-brand-1/50 focus-visible:outline-none';

          if (suggestion.href) {
            return (
              <Link key={suggestion.label} href={suggestion.href} className={className}>
                {content}
              </Link>
            );
          }
          return (
            <button
              key={suggestion.label}
              type="button"
              onClick={suggestion.onClick}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
