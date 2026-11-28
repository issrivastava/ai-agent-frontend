'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Compass,
  Keyboard,
  LayoutDashboard,
  Moon,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fireConfetti } from '@/components/shared/confetti';
import { useUiStore } from '@/lib/ui-store';
import { cn } from '@/lib/utils';

const SEEN_KEY = 'agent-platform:tour-seen';
const CARD_WIDTH = 320;
const CARD_HEIGHT_ESTIMATE = 230;
const GAP = 14;

type TourStep = {
  selector?: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: TourStep[] = [
  {
    selector: '[data-tour="sidebar"]',
    icon: LayoutDashboard,
    title: 'Your workspace, one click away',
    description:
      'The sidebar groups everything: the support queue, workflows, agent runs, extraction, and admin settings. You only see what your role allows.',
  },
  {
    selector: '[data-tour="search"]',
    icon: Keyboard,
    title: 'Jump anywhere with the command palette',
    description:
      'Press Ctrl or Cmd + K to search pages, create workflows, upload documents, or switch theme — without leaving the keyboard.',
  },
  {
    selector: '[data-tour="notifications"]',
    icon: Bell,
    title: 'Approvals come to you',
    description:
      'The bell lights up when a run pauses for a human decision or when something failed. Unread items stay marked until you open them.',
  },
  {
    selector: '[data-tour="theme"]',
    icon: Moon,
    title: 'Light or dark, your call',
    description:
      'Toggle the theme here, or ask the command palette. The platform follows your system setting until you pick one.',
  },
  {
    icon: Sparkles,
    title: 'You are ready to go',
    description:
      'Start with the getting-started checklist on your dashboard, or dive straight into the queue. The platform guide is always in the top bar.',
  },
];

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Private mode — the tour simply offers itself again next visit.
  }
}

export function ProductTour() {
  const pathname = usePathname();
  const tourOpen = useUiStore((s) => s.tourOpen);
  const setTourOpen = useUiStore((s) => s.setTourOpen);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Offer the tour once on the dashboard for first-time visitors.
  useEffect(() => {
    if (pathname !== '/dashboard') return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = true;
    }
    if (seen) return;
    const timer = setTimeout(() => setTourOpen(true), 900);
    return () => clearTimeout(timer);
  }, [pathname, setTourOpen]);

  const close = (seen: boolean) => {
    if (seen) markSeen();
    setTourOpen(false);
    setStep(0);
  };

  const next = () => {
    if (step >= steps.length - 1) {
      fireConfetti();
      close(true);
    } else setStep((s) => s + 1);
  };

  const previous = () => setStep((s) => Math.max(0, s - 1));

  // Measure the highlighted element and handle keyboard navigation.
  useEffect(() => {
    if (!tourOpen) return;
    const current = steps[step];
    const measure = () => {
      const target = current.selector ? document.querySelector(current.selector) : null;
      setRect(target instanceof HTMLElement ? target.getBoundingClientRect() : null);
    };
    measure();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
      if (event.key === 'ArrowRight' || event.key === 'Enter') next();
      if (event.key === 'ArrowLeft') previous();
    };
    const onChange = () => measure();

    window.addEventListener('resize', onChange);
    window.addEventListener('scroll', onChange, true);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('scroll', onChange, true);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourOpen, step]);

  if (!tourOpen) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  // Place the card below the target, above it when there isn't room, and clamp
  // horizontally so it never leaves the viewport.
  let cardTop: number;
  let cardLeft: number | null = null;
  if (rect) {
    const below = rect.bottom + GAP + CARD_HEIGHT_ESTIMATE < window.innerHeight;
    cardTop = below ? rect.bottom + GAP : Math.max(GAP, rect.top - GAP - CARD_HEIGHT_ESTIMATE);
    cardLeft = Math.min(
      Math.max(GAP, rect.left),
      Math.max(GAP, window.innerWidth - CARD_WIDTH - GAP),
    );
  } else {
    cardTop = Math.max(GAP, (window.innerHeight - CARD_HEIGHT_ESTIMATE) / 2);
    cardLeft = (window.innerWidth - CARD_WIDTH) / 2;
  }

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Click catcher so the underlying UI stays inert while the tour runs. */}
      <div className="absolute inset-0" aria-hidden />
      {rect ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] ring-2 ring-brand-1 transition-all duration-300 ease-out"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
          }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-black/55" />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Product tour, step ${step + 1} of ${steps.length}`}
        className="absolute w-80 rounded-2xl border bg-card p-4 shadow-2xl"
        style={{ top: cardTop, left: cardLeft ?? GAP, width: CARD_WIDTH }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-brand-1 uppercase">
            <Compass className="size-3.5" />
            Step {step + 1} of {steps.length}
          </span>
          <div className="flex gap-1" aria-hidden>
            {steps.map((s, index) => (
              <span
                key={s.title}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === step ? 'w-4 bg-brand-1' : 'w-1.5 bg-border',
                )}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-3">
          <span className="bg-brand-gradient shadow-brand flex size-9 shrink-0 items-center justify-center rounded-xl text-white">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm leading-snug font-semibold text-balance">{current.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {current.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => close(true)}
            className="text-muted-foreground"
          >
            Skip tour
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={previous}>
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={next}
              className="bg-brand-gradient text-white hover:brightness-105"
              autoFocus
            >
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
