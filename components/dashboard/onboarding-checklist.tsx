'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  FileSearch,
  Play,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExtractions } from '@/hooks/useExtractions';
import { useRuns } from '@/hooks/useRun';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useAuth } from '@/providers/auth-provider';
import { useUiStore } from '@/lib/ui-store';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'agent-platform:onboarding-dismissed';
const GUIDE_KEY = 'agent-platform:guide-opened';

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function useStoredFlag(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key) === '1',
    () => false,
  );
}

function setStoredFlag(key: string, value: boolean) {
  window.localStorage.setItem(key, value ? '1' : '0');
  for (const listener of listeners) listener();
}

export function OnboardingChecklist() {
  const { can } = useAuth();
  const setHelpOpen = useUiStore((s) => s.setHelpOpen);
  const workflows = useWorkflows();
  const runs = useRuns();
  const extractions = useExtractions();
  const dismissed = useStoredFlag(STORAGE_KEY);
  const guideOpened = useStoredFlag(GUIDE_KEY);

  const tasks = [
    {
      id: 'queue',
      label: 'Explore the support queue',
      description: 'See what your agents are triaging',
      href: '/tickets',
      icon: Sparkles,
      done: false,
    },
    {
      id: 'workflow',
      label: 'Create or review a workflow',
      description: 'Agents, prompts, and allowed tools',
      href: '/workflows',
      icon: Workflow,
      done: (workflows.data?.length ?? 0) > 0,
    },
    {
      id: 'run',
      label: 'Start or watch an agent run',
      description: 'See every step as it happens',
      href: '/runs',
      icon: Play,
      done: (runs.data?.length ?? 0) > 0,
    },
    {
      id: 'extraction',
      label: 'Process a document',
      description: 'Upload a PDF and review extracted fields',
      href: '/extractions',
      icon: FileSearch,
      done: (extractions.data?.length ?? 0) > 0,
    },
    {
      id: 'guide',
      label: 'Read the platform guide',
      description: 'Concepts and guardrails in two minutes',
      icon: BookOpen,
      action: 'guide',
      done: guideOpened,
    },
  ];

  const completed = tasks.filter((task) => task.done).length;
  const percent = Math.round((completed / tasks.length) * 100);

  if (dismissed) return null;

  return (
    <Card className="relative h-full overflow-hidden">
      <div aria-hidden className="bg-brand-gradient absolute inset-x-0 top-0 h-0.5" />
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-brand-1" />
            Getting started
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {completed} of {tasks.length} complete · a quick tour of the workspace
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss getting started"
          onClick={() => {
            setStoredFlag(STORAGE_KEY, true);
          }}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-brand-gradient h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="space-y-1">
          {tasks.map((task) => {
            const Icon = task.icon;
            const content = (
              <span className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/70">
                {task.done ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-3" />
                  </span>
                ) : (
                  <Circle className="size-5 shrink-0 text-muted-foreground/50" />
                )}
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block truncate text-xs font-medium',
                      task.done && 'text-muted-foreground line-through',
                    )}
                  >
                    {task.label}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {task.description}
                  </span>
                </span>
                <Icon className="size-3.5 shrink-0 text-muted-foreground/60" />
                {!task.done && <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />}
              </span>
            );

            return (
              <li key={task.id}>
                {task.action === 'guide' ? (
                  <button
                    type="button"
                    className="w-full"
                    onClick={() => {
                      setStoredFlag(GUIDE_KEY, true);
                      setHelpOpen(true);
                    }}
                  >
                    {content}
                  </button>
                ) : (
                  <Link href={task.href ?? '/dashboard'}>{content}</Link>
                )}
              </li>
            );
          })}
        </ul>

        {completed === tasks.length && (
          <p className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            <Check className="size-3.5" />
            You&apos;re set up. Nice work.
          </p>
        )}

        {can('workflows:run') && (
          <Link
            href="/workflows"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-brand-1/20 bg-brand-soft px-3 py-2 text-xs font-medium text-brand-1 transition-colors hover:brightness-[0.98]"
          >
            <Play className="size-3.5" />
            Start your first run
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
