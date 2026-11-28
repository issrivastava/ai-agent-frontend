import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  Inbox,
  KeyRound,
  Layers,
  Lock,
  MousePointerClick,
  Receipt,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Users,
  Warehouse,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/landing-header';
import { ProductPreview } from '@/components/landing/product-preview';
import { ProductShowcase } from '@/components/landing/product-showcase';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AI Agent Platform | Customer support and data extraction, run by AI agents',
  description:
    'Build multi-agent workflows that triage support tickets and extract data from documents, with a person approving every risky step.',
};

const heroProof = ['Human approval gates', 'Role-based access', 'Full audit history'];

const surfaces: { icon: LucideIcon; title: string; text: string; chip: string }[] = [
  {
    icon: Inbox,
    title: 'Support inbox',
    text: 'Every ticket arrives triaged, prioritised, and routed to the right agent. Filter, search, and reassign without leaving the page.',
    chip: 'Tickets',
  },
  {
    icon: Workflow,
    title: 'Agent workflows',
    text: 'Chain agents and tools into repeatable playbooks: triage, billing, dispatch, extraction. Version, pause, and activate them safely.',
    chip: 'Workflows',
  },
  {
    icon: ShieldAlert,
    title: 'Human approvals',
    text: 'Refunds, emails, and other sensitive actions pause the run. A person reviews the exact tool and payload before anything happens.',
    chip: 'Runs',
  },
  {
    icon: FileSearch,
    title: 'Document extraction',
    text: 'Upload invoices and warehouse documents. Agents pull structured fields with confidence scores you can review before export.',
    chip: 'Extraction',
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: 'Connect the work',
    text: 'Tickets, documents, and workflows live in one workspace. Your team starts from a familiar queue instead of another console.',
  },
  {
    icon: Workflow,
    title: 'Compose agents',
    text: 'Give each agent a role, a prompt, and only the tools it needs. Ordered steps make the automation easy to read and change.',
  },
  {
    icon: ShieldCheck,
    title: 'Approve the risky bits',
    text: 'When a step touches money or customers, the run pauses. Approve or reject with full context, and the decision is written to history.',
  },
  {
    icon: Activity,
    title: 'Watch and improve',
    text: 'Follow every run live, review failures, compare success rates, and tune the prompts and tools with evidence.',
  },
];

const useCases = [
  {
    icon: Warehouse,
    title: 'Warehouse support',
    text: 'Resolve slot booking disputes, reschedule inbound deliveries, and answer capacity questions with a triage agent in front.',
    chips: ['slot_search', 'assign_ticket', 'email_sender'],
  },
  {
    icon: Receipt,
    title: 'Billing & refunds',
    text: 'Find the invoice, verify the amount, and prepare a refund. The actual refund call waits for a person to approve it.',
    chips: ['invoice_search', 'refund_api', 'ticket_lookup'],
  },
  {
    icon: ScanLine,
    title: 'Document intake',
    text: 'Turn purchase orders, invoices, and delivery notes into clean structured data. Review low-confidence fields and export CSV or JSON.',
    chips: ['pdf_reader', 'ocr'],
  },
];

const roles = [
  {
    role: 'Admin',
    icon: KeyRound,
    text: 'Manages people, roles, and workflows. Full access to every surface and setting.',
    tone: 'from-violet-500/15 to-indigo-500/5',
  },
  {
    role: 'Agent',
    icon: BadgeCheck,
    text: 'Runs workflows, approves or rejects actions, reassigns tickets, and uploads documents.',
    tone: 'from-sky-500/15 to-cyan-500/5',
  },
  {
    role: 'Viewer',
    icon: BookOpen,
    text: 'Read-only visibility across tickets, workflows, runs, and extraction results.',
    tone: 'from-emerald-500/15 to-teal-500/5',
  },
];

const guardrails = [
  {
    icon: ShieldCheck,
    title: 'Approval before action',
    text: 'Any tool that can change customer data stops the run until a person approves or rejects it.',
  },
  {
    icon: Users,
    title: 'Server-enforced roles',
    text: 'Permissions are checked by the API, not only hidden in the interface. Viewers stay read-only.',
  },
  {
    icon: Lock,
    title: 'Secure sessions',
    text: 'Passwords are stored hashed and sessions use httpOnly cookies, so tokens never sit in local storage.',
  },
  {
    icon: Activity,
    title: 'Traceable decisions',
    text: 'Each run records which agent acted, which tool it used, how long it took, and who approved it.',
  },
];

const faqs = [
  {
    q: 'What exactly is this platform?',
    a: 'It is an operations workspace for AI agents. Your team connects support tickets, multi-step agent workflows, human approvals, and document extraction in one place. Instead of a chatbot, you get a supervised process with a queue, a run history, and an audit trail.',
  },
  {
    q: 'How do I get access?',
    a: 'Create an account from the sign-up page. New accounts are read-only until an administrator assigns a role. Admins can change roles from Settings.',
  },
  {
    q: 'Can the agents act without anyone checking?',
    a: 'Not for sensitive actions. Steps that use tools such as refunds or sending email pause until a person approves or rejects them, and the run history records the decision.',
  },
  {
    q: 'Who can change workflows?',
    a: 'Only admins create, edit, or delete workflows. Agents can run active workflows. Viewers can inspect results without changing anything.',
  },
  {
    q: 'Which files can I upload for extraction?',
    a: 'PDF, PNG, JPG, and CSV files up to 10 MB each. Extracted fields include confidence scores, and low-confidence values are flagged for review.',
  },
  {
    q: 'How is access protected?',
    a: 'Passwords are stored hashed, sessions use httpOnly cookies, and every permission is checked on the server, not only in the interface.',
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-1 uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="overflow-hidden">
        {/* Hero */}
        <section className="hero-glow relative">
          <div
            aria-hidden
            className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-24">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-1/25 bg-brand-soft px-3 py-1 text-xs font-medium text-brand-1">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-1 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-brand-1" />
                </span>
                AI agents with human oversight
              </p>

              <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Customer operations,{' '}
                <span className="text-gradient">run by agents you can trust</span>.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                AI Agent Platform is a workspace for teams that want automation without losing
                control. Triage support tickets, extract data from documents, and chain agents into
                workflows — with a person approving every risky step.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-brand-gradient shadow-brand h-11 px-6 text-white hover:brightness-105',
                  )}
                >
                  Create your account
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-6')}
                >
                  See how a run works
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {heroProof.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid max-w-lg grid-cols-3 divide-x rounded-xl border bg-card/70 p-3 shadow-xs backdrop-blur">
                {[
                  { value: '4', label: 'connected surfaces' },
                  { value: '3', label: 'role levels' },
                  { value: '100%', label: 'decisions audited' },
                ].map((stat) => (
                  <div key={stat.label} className="px-2 text-center sm:px-3">
                    <p className="text-lg font-semibold tracking-tight whitespace-nowrap sm:text-xl">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-balance text-muted-foreground sm:text-[11px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-up delay-200 lg:pl-4">
              <ProductPreview />
            </div>
          </div>
        </section>

        {/* Product explainer + showcase */}
        <section id="product" className="scroll-mt-20 border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <SectionHeading
              eyebrow="What is this?"
              title="One control room for AI agents that do real work"
              description="Most automation tools stop at chat. This is an operations system: a queue for incoming work, a builder for agent playbooks, a run viewer for live execution, and a review step wherever a mistake would be expensive."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {surfaces.map(({ icon: Icon, title, text, chip }) => (
                <div
                  key={title}
                  className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5"
                >
                  <span
                    aria-hidden
                    className="absolute -top-16 -right-16 size-32 rounded-full bg-brand-soft opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                  />
                  <span className="bg-brand-gradient shadow-brand flex size-10 items-center justify-center rounded-xl text-white">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    {chip}
                  </p>
                  <h3 className="mt-1 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <ProductShowcase />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20"
        >
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                align="left"
                eyebrow="How it works"
                title="From incoming work to a supervised outcome"
                description="The platform keeps the automation legible. You can see what each agent knows, which tool it may use, and where a person steps in."
              />
              <div className="mt-8 rounded-2xl border bg-card/70 p-5">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Zap className="size-4 text-brand-1" />
                  What a run records
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {[
                    'Which agent handled each step',
                    'The tool called and its result',
                    'Timing, status, and failures',
                    'Who approved or rejected a step',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ol className="relative space-y-4">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="card-hover relative flex gap-4 rounded-2xl border bg-card p-5"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-1 ring-1 ring-brand-1/15">
                      <step.icon className="size-5" />
                    </span>
                    {index < steps.length - 1 && (
                      <span aria-hidden className="my-2 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="min-w-0 pb-1">
                    <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="scroll-mt-20 border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <SectionHeading
              eyebrow="Use cases"
              title="Built for warehouse and logistics operations"
              description="Start with the work your team already does every day. Each workflow can use only the tools it needs."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="card-hover flex flex-col rounded-2xl border bg-card p-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-1">
                    <useCase.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{useCase.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {useCase.text}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t pt-4">
                    {useCase.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full bg-muted px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <Layers className="size-4" />
              Not seeing your process? Compose a workflow from any mix of agents and tools.
            </div>
          </div>
        </section>

        {/* Security & roles */}
        <section
          id="security"
          className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Control by design"
                title="Autonomy where it helps. Oversight where it matters."
                description="The point is not to remove your team. It is to give them leverage without giving up the final say."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {guardrails.map((item) => (
                  <div key={item.title} className="rounded-xl border bg-card p-4">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <item.icon className="size-4" />
                    </span>
                    <p className="mt-3 text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Roles at a glance</p>
                  <p className="text-xs text-muted-foreground">
                    Give each person only what they need
                  </p>
                </div>
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-1">
                  Admin configurable
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.role}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border bg-linear-to-br p-4',
                      role.tone,
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-foreground shadow-xs">
                      <role.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{role.role}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {role.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" />
                New sign-ups start read-only and need a role from an administrator.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-y bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions"
              description="Short answers about access, safety, and what the platform does."
            />
            <div className="mt-10 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border bg-card px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-brand-1/20 bg-card p-8 text-center shadow-xl sm:p-12">
            <div
              aria-hidden
              className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)] opacity-60"
            />
            <div
              aria-hidden
              className="bg-brand-gradient pointer-events-none absolute -top-32 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
            />
            <div className="relative">
              <span className="bg-brand-gradient shadow-brand mx-auto flex size-12 items-center justify-center rounded-2xl text-white">
                <Bot className="size-6" />
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to put your agents to work?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Create an account, get your role from an administrator, and start with a template.
                Your first supervised run is a few clicks away.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-brand-gradient shadow-brand h-11 px-6 text-white hover:brightness-105',
                  )}
                >
                  Create your account
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-6')}
                >
                  Sign in
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No credit card required · New accounts start read-only
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="bg-brand-gradient shadow-brand flex size-8 items-center justify-center rounded-lg text-white">
                  <Bot className="size-4" />
                </span>
                AI Agent Platform
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Supervised AI agents for customer support, billing operations, and document
                extraction.
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                All systems operational
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#product" className="transition-colors hover:text-foreground">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="transition-colors hover:text-foreground">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="transition-colors hover:text-foreground">
                    Use cases
                  </a>
                </li>
                <li>
                  <a href="#security" className="transition-colors hover:text-foreground">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium">Workspace</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="transition-colors hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/tickets" className="transition-colors hover:text-foreground">
                    Tickets
                  </Link>
                </li>
                <li>
                  <Link href="/workflows" className="transition-colors hover:text-foreground">
                    Workflows
                  </Link>
                </li>
                <li>
                  <Link href="/extractions" className="transition-colors hover:text-foreground">
                    Data extraction
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="transition-colors hover:text-foreground">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="transition-colors hover:text-foreground">
                    Create account
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="transition-colors hover:text-foreground">
                    Common questions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground">
            <span>© 2026 AI Agent Platform. Supervised automation.</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              For warehouse, logistics, and support teams
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
