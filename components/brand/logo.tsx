import { Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-brand-gradient shadow-brand relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white',
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.45),transparent_48%)]" />
      <span className="absolute inset-0 rounded-xl ring-1 ring-white/25 ring-inset" />
      <Bot className="relative size-[1.15rem]" strokeWidth={2.2} />
      <Sparkles className="absolute -top-1 -right-1 size-3 text-white/80" />
    </span>
  );
}

export function Logo({
  className,
  markClassName,
  subtitle = 'Agent operations cloud',
}: {
  className?: string;
  markClassName?: string;
  subtitle?: string | null;
}) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <LogoMark className={markClassName} />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="truncate text-[0.95rem] font-semibold tracking-tight">
          AI Agent Platform
        </span>
        {subtitle && (
          <span className="mt-1 truncate text-[0.6rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
