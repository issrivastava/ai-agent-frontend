'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  ShieldAlert,
  Ticket,
  Workflow,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/providers/auth-provider';
import { useUiStore } from '@/lib/ui-store';

const concepts = [
  {
    icon: Ticket,
    title: 'Ticket',
    text: 'A customer request waiting in the support queue. Agents can triage, prioritise, and route it.',
  },
  {
    icon: Workflow,
    title: 'Workflow',
    text: 'An ordered playbook of agents and tools. Only active workflows can be started.',
  },
  {
    icon: Activity,
    title: 'Run',
    text: 'One execution of a workflow. The run viewer streams each step, tool, and timing as it happens.',
  },
  {
    icon: ShieldAlert,
    title: 'Approval',
    text: 'A pause before a risky tool runs. Approve to continue or reject to stop the run.',
  },
  {
    icon: FileSearch,
    title: 'Extraction',
    text: 'A document processed into structured fields, with a confidence score for each field.',
  },
];

const roleCopy: Record<string, string> = {
  admin:
    'You can manage people and workflows, run agents, decide approvals, reassign tickets, and upload documents.',
  agent:
    'You can run workflows, decide approvals, reassign tickets, and upload documents. Workflow editing is limited to admins.',
  viewer:
    'You have read-only access to tickets, workflows, runs, and extractions. Ask an admin if you need to take action.',
};

export function HelpDialog() {
  const { user, can } = useAuth();
  const helpOpen = useUiStore((s) => s.helpOpen);
  const setHelpOpen = useUiStore((s) => s.setHelpOpen);

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b bg-brand-soft p-5 pr-12">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-brand-1 uppercase">
            <CheckCircle2 className="size-3.5" />
            Platform guide
          </p>
          <DialogTitle className="mt-1 text-xl">How this platform works</DialogTitle>
          <DialogDescription>
            AI Agent Platform is a supervised workspace for customer operations. Agents do the work;
            your team keeps the final say.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[58vh] space-y-5 overflow-y-auto p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Core concepts
            </p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {concepts.map((concept) => (
                <div key={concept.title} className="rounded-xl border bg-card p-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="flex size-6 items-center justify-center rounded-md bg-brand-soft text-brand-1">
                      <concept.icon className="size-3.5" />
                    </span>
                    {concept.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {concept.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              A typical run
            </p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-4">
              {['Work arrives', 'Agents act', 'Risky step pauses', 'You decide'].map(
                (step, index) => (
                  <li key={step} className="flex items-center gap-2 text-xs">
                    <span className="bg-brand-gradient flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ),
              )}
            </ol>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/30">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">
                Your role: <span className="capitalize">{user.role}</span>
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {roleCopy[user.role] ?? roleCopy.viewer}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Go somewhere
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/tickets', label: 'Tickets' },
                ...(can('workflows:run') ? [{ href: '/workflows', label: 'Workflows' }] : []),
                { href: '/runs', label: 'Agent runs' },
                { href: '/extractions', label: 'Data extraction' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setHelpOpen(false)}
                  className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {link.label}
                  <ArrowRight className="size-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-muted/40 p-4">
          <p className="hidden text-[11px] text-muted-foreground sm:block">
            Open this guide anytime with the help icon in the top bar.
          </p>
          <button
            type="button"
            onClick={() => setHelpOpen(false)}
            className="bg-brand-gradient shadow-brand ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
