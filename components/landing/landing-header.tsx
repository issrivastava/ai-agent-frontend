'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const links = [
  { href: '#product', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '#security', label: 'Security' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-40 border-b border-border/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="AI Agent Platform home" className="shrink-0">
          <Logo markClassName="size-8 rounded-lg" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 shadow-xs lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'hidden text-muted-foreground sm:inline-flex',
            )}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'bg-brand-gradient shadow-brand hidden px-3.5 text-white hover:brightness-105 sm:inline-flex',
            )}
          >
            Get started
            <ArrowRight className="size-3.5" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[88vw] max-w-sm">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>
              <Logo markClassName="size-8 rounded-lg" subtitle={null} />
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 px-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
                <ArrowRight className="size-3.5 opacity-50" />
              </a>
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t p-4">
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants(),
                'bg-brand-gradient shadow-brand w-full text-white hover:brightness-105',
              )}
            >
              Create your account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            >
              Sign in
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
