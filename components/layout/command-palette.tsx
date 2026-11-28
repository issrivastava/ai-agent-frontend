'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  BookOpen,
  CornerDownLeft,
  FileSearch,
  Moon,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  UploadCloud,
  type LucideIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useRuns } from '@/hooks/useRun';
import { useAuth } from '@/providers/auth-provider';
import { navItems } from '@/lib/navigation';
import { useUiStore } from '@/lib/ui-store';
import { cn } from '@/lib/utils';

type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  group: 'Suggested' | 'Pages' | 'Actions' | 'Help';
  icon: LucideIcon;
  onSelect: () => void;
};

const groupOrder = ['Suggested', 'Pages', 'Actions', 'Help'] as const;

export function CommandPalette() {
  const router = useRouter();
  const { can } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const commandOpen = useUiStore((s) => s.commandOpen);
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const setHelpOpen = useUiStore((s) => s.setHelpOpen);
  const setTourOpen = useUiStore((s) => s.setTourOpen);
  const runs = useRuns();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const pendingApprovals = (runs.data ?? []).filter(
    (run) => run.status === 'waiting_approval',
  ).length;

  const items = useMemo<PaletteItem[]>(() => {
    const close = () => {
      setCommandOpen(false);
      setQuery('');
      setActive(0);
    };

    const suggested: PaletteItem[] = [];

    if (pendingApprovals > 0) {
      suggested.push({
        id: 'suggested-approvals',
        label: 'Review pending approvals',
        hint: `${pendingApprovals} run${pendingApprovals === 1 ? '' : 's'} waiting for a decision`,
        group: 'Suggested',
        icon: ShieldCheck,
        onSelect: () => {
          close();
          router.push('/runs');
        },
      });
    }

    suggested.push({
      id: 'suggested-tour',
      label: 'Take a product tour',
      hint: 'A 60-second walkthrough of the workspace',
      group: 'Suggested',
      icon: Rocket,
      onSelect: () => {
        close();
        setTourOpen(true);
      },
    });

    const pages: PaletteItem[] = navItems
      .filter((item) => !item.permission || can(item.permission))
      .map((item) => ({
        id: `page-${item.href}`,
        label: item.label,
        hint: item.description,
        group: 'Pages',
        icon: item.icon,
        onSelect: () => {
          close();
          router.push(item.href);
        },
      }));

    const actions: PaletteItem[] = [];

    if (can('workflows:manage')) {
      actions.push({
        id: 'action-new-workflow',
        label: 'New workflow',
        hint: 'Start from a template or a blank playbook',
        group: 'Actions',
        icon: Plus,
        onSelect: () => {
          close();
          router.push('/workflows/new');
        },
      });
    }

    if (can('extractions:upload')) {
      actions.push({
        id: 'action-upload-document',
        label: 'Upload a document',
        hint: 'Send a PDF, image, or CSV to extraction',
        group: 'Actions',
        icon: UploadCloud,
        onSelect: () => {
          close();
          router.push('/extractions');
        },
      });
    }

    actions.push({
      id: 'action-toggle-theme',
      label: resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      hint: 'Change how the workspace looks',
      group: 'Actions',
      icon: Moon,
      onSelect: () => {
        close();
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      },
    });

    const help: PaletteItem[] = [
      {
        id: 'help-guide',
        label: 'Open the platform guide',
        hint: 'Concepts, roles, and how a run works',
        group: 'Help',
        icon: BookOpen,
        onSelect: () => {
          close();
          setTimeout(() => setHelpOpen(true), 120);
        },
      },
    ];

    return [...suggested, ...pages, ...actions, ...help];
  }, [
    can,
    router,
    resolvedTheme,
    setCommandOpen,
    setHelpOpen,
    setTheme,
    setTourOpen,
    pendingApprovals,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${item.label} ${item.hint} ${item.group}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (!commandOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [commandOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const open = useUiStore.getState().commandOpen;
        if (open) {
          setQuery('');
          setActive(0);
        }
        setCommandOpen(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setCommandOpen]);

  function handleOpenChange(open: boolean) {
    setCommandOpen(open);
    if (!open) {
      setQuery('');
      setActive(0);
    }
  }

  const activeItem = filtered[active];

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => (filtered.length ? (current + 1) % filtered.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) =>
        filtered.length ? (current - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      activeItem?.onSelect();
    }
  }

  return (
    <Dialog open={commandOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages and actions across the workspace.
        </DialogDescription>

        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions, and help…"
            aria-label="Search commands"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            esc
          </kbd>
        </div>

        <div className="max-h-[22rem] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-10 text-center text-sm text-muted-foreground">
              No matches for “{query}”.
            </div>
          ) : (
            groupOrder.map((group) => {
              const groupItems = filtered.filter((item) => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="mb-1">
                  <p className="px-2 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {group}
                  </p>
                  {groupItems.map((item) => {
                    const index = filtered.indexOf(item);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActive(index)}
                        onClick={item.onSelect}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                          active === index
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-muted/70',
                        )}
                      >
                        <span
                          className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-md',
                            active === index
                              ? 'bg-brand-gradient text-white'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          <Icon className="size-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {item.label}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {item.hint}
                          </span>
                        </span>
                        {active === index && (
                          <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1 py-0.5">↑</kbd>
              <kbd className="rounded border bg-background px-1 py-0.5">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-background px-1 py-0.5">↵</kbd>
              open
            </span>
          </span>
          <span className="flex items-center gap-1">
            <FileSearch className="size-3" />
            <span className="hidden sm:inline">Command palette</span>
            <kbd className="rounded border bg-background px-1 py-0.5">⌘K</kbd>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommandPaletteTrigger() {
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);

  return (
    <button
      type="button"
      data-tour="search"
      onClick={() => setCommandOpen(true)}
      className="hidden h-8 items-center gap-2 rounded-lg border border-transparent bg-muted/60 px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
      aria-label="Open command palette"
    >
      <Search className="size-3.5" />
      <span>Search or jump to…</span>
      <kbd className="ml-4 rounded border bg-background px-1.5 py-0.5 text-[10px]">⌘K</kbd>
    </button>
  );
}
