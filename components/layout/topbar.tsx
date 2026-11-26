'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleHelp, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LogoMark } from '@/components/brand/logo';
import { navItems } from '@/lib/navigation';
import { useUiStore } from '@/lib/ui-store';
import { CommandPalette, CommandPaletteTrigger } from './command-palette';
import { HelpDialog } from './help-dialog';
import { NotificationsBell } from './notifications-bell';
import { SidebarNav } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

function resolvePage(pathname: string) {
  const detail = [
    { prefix: '/workflows/new', label: 'New workflow', group: 'Workflows' },
    { prefix: '/workflows/', suffix: '/edit', label: 'Edit workflow', group: 'Workflows' },
    { prefix: '/runs/', label: 'Run detail', group: 'Agent runs' },
    { prefix: '/extractions/', label: 'Extraction detail', group: 'Data extraction' },
  ].find((entry) =>
    entry.suffix
      ? pathname.startsWith(entry.prefix) && pathname.endsWith(entry.suffix)
      : pathname.startsWith(entry.prefix),
  );

  if (detail) return { label: detail.label, group: detail.group };

  const match = [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return { label: match?.label ?? 'Workspace', group: match?.group ?? 'AI Agent Platform' };
}

export function Topbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const setHelpOpen = useUiStore((s) => s.setHelpOpen);
  const page = resolvePage(pathname);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-card/70 px-3 backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <li className="hidden sm:block">{page.group}</li>
              <li aria-hidden className="hidden text-muted-foreground/50 sm:block">
                /
              </li>
              <li className="truncate text-sm font-medium text-foreground">{page.label}</li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <CommandPaletteTrigger />
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Search"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open platform guide"
            title="Platform guide"
            onClick={() => setHelpOpen(true)}
            className="hidden sm:inline-flex"
          >
            <CircleHelp className="size-4" />
          </Button>

          <NotificationsBell />
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5"
              >
                <LogoMark className="size-8 rounded-lg" />
                AI Agent Platform
              </Link>
            </SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <CommandPalette />
      <HelpDialog />
    </>
  );
}
