import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { LogoMark } from '@/components/brand/logo';

const highlights = [
  {
    icon: Workflow,
    title: 'Compose agent playbooks',
    text: 'Chain triage, billing, dispatch, and extraction agents with only the tools they need.',
  },
  {
    icon: ShieldCheck,
    title: 'Keep the final say',
    text: 'Risky actions pause the run until a person approves or rejects them.',
  },
  {
    icon: Activity,
    title: 'See every step',
    text: 'Follow runs live and keep an auditable history of tools, results, and decisions.',
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#0c0a1d] p-10 text-white lg:flex xl:p-12">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-28 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--brand-1),transparent_65%)] opacity-40 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 size-[30rem] rounded-full bg-[radial-gradient(circle,var(--brand-3),transparent_65%)] opacity-30 blur-2xl"
        />

        <Link
          href="/"
          className="relative flex w-fit items-center gap-2.5 text-lg font-semibold tracking-tight"
        >
          <LogoMark />
          AI Agent Platform
        </Link>

        <div className="relative max-w-lg space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
            <Sparkles className="size-3.5 text-brand-3" />
            Supervised automation
          </span>

          <div>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight xl:text-4xl">
              Customer support and data extraction,{' '}
              <span className="text-gradient">run by AI agents you control</span>.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/65 xl:text-base">
              One workspace for the work your team already does: triage, route, extract, and
              resolve. With a person approving every sensitive step.
            </p>
          </div>

          <ul className="space-y-3.5">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-3">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/60">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-4 backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-medium text-amber-200">
              <ShieldAlert className="size-4" />
              Guardrail in action
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/65">
              The billing agent wants to call{' '}
              <span className="font-mono text-white/85">refund_api</span>. The run is paused until
              someone approves.
            </p>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3.5" />
            httpOnly sessions
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Server-enforced roles
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" />
            Full audit trail
          </span>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-background">
        <div className="flex items-center justify-between border-b p-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <LogoMark className="size-8 rounded-lg" />
            AI Agent Platform
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Home
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_22rem_at_50%_-10%,color-mix(in_oklab,var(--brand-1)_10%,transparent),transparent_70%)]"
          />
          <div className="relative w-full max-w-md">
            <Link
              href="/"
              className="mb-6 hidden w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
            >
              <ArrowLeft className="size-3.5" />
              Back to home
            </Link>

            {children}

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <Lock className="size-3" />
              Protected by role-based access and an auditable run history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
