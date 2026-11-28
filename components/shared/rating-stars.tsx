'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Fill = 'empty' | 'half' | 'full';

function fillFor(rating: number, index: number): Fill {
  if (rating >= index + 1) return 'full';
  if (rating >= index + 0.5) return 'half';
  return 'empty';
}

function StarGlyph({ fill, className }: { fill: Fill; className?: string }) {
  if (fill === 'half') {
    return (
      <span className={cn('relative inline-flex', className)}>
        <Star className="size-full text-border" />
        <span aria-hidden className="absolute inset-0 w-1/2 overflow-hidden">
          <Star className="size-full fill-amber-400 text-amber-400" />
        </span>
      </span>
    );
  }
  return (
    <Star
      className={cn(
        'size-full',
        fill === 'full' ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-border',
        className,
      )}
    />
  );
}

/**
 * Interactive or read-only star rating (0–5, halves supported for display).
 * Interactive mode exposes each star as a labelled button.
 */
export function RatingStars({
  value,
  onChange,
  label = 'Rating',
  size = 'md',
  className,
}: {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = typeof onChange === 'function';
  const shown = hovered ?? value;
  const sizeClass = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <span
      role={interactive ? 'group' : 'img'}
      aria-label={interactive ? undefined : `${label}: ${value} out of 5`}
      onMouseLeave={() => interactive && setHovered(null)}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = fillFor(shown, index);
        if (!interactive) {
          return <StarGlyph key={index} fill={fill} className={sizeClass} />;
        }
        return (
          <button
            key={index}
            type="button"
            aria-label={`Rate ${index + 1} out of 5`}
            onMouseEnter={() => setHovered(index + 1)}
            onFocus={() => setHovered(index + 1)}
            onBlur={() => setHovered(null)}
            onClick={() => onChange?.(index + 1)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <StarGlyph fill={fill} className={sizeClass} />
          </button>
        );
      })}
    </span>
  );
}
