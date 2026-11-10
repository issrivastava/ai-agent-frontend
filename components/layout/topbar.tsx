'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';

export function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        <div className="hidden md:block" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Replaced with a real user menu once auth is wired up */}
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            U
          </div>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b">
            <SheetTitle>AI Agent Platform</SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
