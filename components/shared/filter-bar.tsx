'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

/**
 * Toolbar wrapper for facet selects plus removable chips describing what is
 * currently filtered. Renders inline next to the table search box.
 */
export function FilterBar({
  chips = [],
  onClearAll,
  children,
  className,
}: {
  chips?: FilterChip[];
  onClearAll?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  if (chips.length === 0 && !children) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-brand-1/25 bg-brand-soft px-3 text-xs font-medium text-brand-1 transition-colors hover:border-brand-1/40 hover:brightness-[0.97]"
        >
          {chip.label}
          <X className="size-3 opacity-50 transition-opacity group-hover:opacity-100" />
          <span className="sr-only">Remove this filter</span>
        </button>
      ))}
      {chips.length > 0 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="h-8 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
