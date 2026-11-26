import {
  CheckCircle2,
  Clock,
  CreditCard,
  Cpu,
  ShieldAlert,
  Sparkles,
  Ticket,
  UserCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';

const steps = [
  {
    icon: Ticket,
    agent: 'Triage agent',
    detail: 'Classified as a billing / refund request · high priority',
    meta: '1.2s · ticket_lookup',
    state: 'done' as const,
  },
  {
    icon: CreditCard,
    agent: 'Billing agent',
    detail: 'Wants to call refund_api for invoice INV-20841',
    meta: 'Waiting for a human decision',
    state: 'approval' as const,
  },
  {
    icon: UserCheck,
    agent: 'Dispatch agent',
    detail: 'Notify the customer and assign the ticket owner',
    meta: 'Queued',
    state: 'pending' as const,
  },
];

export function ProductPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_30%_10%,color-mix(in_oklab,var(--brand-1)_30%,transparent),transparent_70%)] blur-2xl"
      />

      <div className="animate-float">
        <div className="animate-pulse-soft absolute -top-5 -right-3 z-10 hidden items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-lg sm:flex dark:border-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300">
          <ShieldAlert className="size-3.5" />
          Human in the loop
        </div>

        <div
          role="img"
          aria-label="Preview of a workflow run paused for human approval"
          className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-[0_30px_80px_-30px_rgb(15_23_42/0.45)] backdrop-blur"
        >
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Cpu className="size-3" />
              Agent runs / RUN-104
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
              </span>
              Live
            </span>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Support ticket triage</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Started 42s ago · 3 agents · 1 approval required
                </p>
              </div>
              <StatusBadge status="waiting_approval" />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Step 2 of 3</span>
                <span>67%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="bg-brand-gradient h-full w-2/3 rounded-full" />
              </div>
            </div>

            <ol className="space-y-1">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                return (
                  <li key={step.agent} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          step.state === 'done'
                            ? 'flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                            : step.state === 'approval'
                              ? 'flex size-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-4 ring-amber-100/60 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-950/60'
                              : 'flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground'
                        }
                      >
                        {step.state === 'done' ? (
                          <CheckCircle2 className="size-4" />
                        ) : step.state === 'approval' ? (
                          <ShieldAlert className="size-4" />
                        ) : (
                          <Clock className="size-4" />
                        )}
                      </span>
                      {!isLast && (
                        <span
                          className={
                            step.state === 'done'
                              ? 'my-1 w-px flex-1 bg-emerald-300 dark:bg-emerald-800'
                              : 'my-1 w-px flex-1 bg-border'
                          }
                        />
                      )}
                    </div>

                    <div className={isLast ? 'min-w-0 pb-1' : 'min-w-0 pb-4'}>
                      <div className="flex flex-wrap items-center gap-2">
                        <Icon className="size-3.5 text-muted-foreground" />
                        <p className="text-sm font-medium">{step.agent}</p>
                        {step.state === 'approval' && <StatusBadge status="waiting_approval" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/80">{step.meta}</p>

                      {step.state === 'approval' && (
                        <div className="mt-2.5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 dark:border-amber-900/70 dark:bg-amber-950/40">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-200">
                            <Sparkles className="size-3.5" />
                            This action changes customer data
                          </p>
                          <p className="mt-1 text-[11px] text-amber-700/90 dark:text-amber-300/80">
                            Refund of ₹4,200.00 for INV-20841. Approve to continue.
                          </p>
                          <div className="mt-2.5 flex gap-2">
                            <span className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white">
                              Approve
                            </span>
                            <span className="rounded-md border border-amber-300 bg-white/60 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-transparent dark:text-amber-200">
                              Reject
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Every decision is audited
              </span>
              <span>3 tools connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-up absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-xl border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur delay-500 sm:flex">
        <CheckCircle2 className="size-4 text-emerald-500" />
        <span>
          <span className="block font-medium">Approved by Priya</span>
          <span className="text-[11px] text-muted-foreground">Audit log saved · 12:04</span>
        </span>
      </div>
    </div>
  );
}
