import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Bot,
  ChevronDown,
  FileSearch,
  ShieldCheck,
  Ticket,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/landing-header';
import { ProductPreview } from '@/components/landing/product-preview';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AI Agent Platform | Customer support and data extraction, run by AI agents',
  description:
    'Build multi-agent workflows that triage support tickets and extract data from documents, with a person approving every risky step.',
};

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Ticket,
    title: 'Ticket dispatch',
    text: 'Triage, prioritise, and route incoming tickets to the right agent, with filters and a full history.',
  },
  {
    icon: Workflow,
    title: 'Multi-agent workflows',
    text: 'Chain triage, billing, dispatch, and extraction agents, each with its own prompt and tools.',
  },
  {
    icon: ShieldCheck,
    title: 'Human approval',
    text: 'Risky actions such as refunds pause for a person to approve or reject before anything happens.',
  },
  {
    icon: Activity,
    title: 'Live run viewer',
    text: 'Watch every step as it runs: which agent acted, which tool it used, and how long it took.',
  },
  {
    icon: FileSearch,
    title: 'Data extraction',
    text: 'Upload invoices and documents, review extracted fields with confidence scores, and export CSV or JSON.',
  },
  {
    icon: Users,
    title: 'Roles and permissions',
    text: 'Admins, agents, and viewers see and do only what their role allows, enforced on the server.',
  },
];

const steps = [
  {
    title: 'Create your account',
    text: 'Sign up with your work email. New accounts start as viewers until your administrator assigns a role.',
  },
  {
    title: 'Set up your team',
    text: 'An admin opens Settings and gives each person the role they need: admin, agent, or viewer.',
  },
  {
    title: 'Build your first workflow',
    text: 'Pick the agents, write what each should do, and choose the tools it may use. Save it as a draft, then activate it.',
  },
  {
    title: 'Run it and stay in control',
    text: 'Start a run, watch it live, and approve or reject any risky step. Results and history stay in your dashboard.',
  },
];

const roles = [
  {
    role: 'Admin',
    text: 'Manages users, creates and edits workflows, and has every agent permission.',
  },
  {
    role: 'Agent',
    text: 'Runs workflows, approves or rejects actions, reassigns tickets, and uploads documents.',
  },
  {
    role: 'Viewer',
    text: 'Read-only access to tickets, workflows, runs, and extraction results.',
  },
];

const faqs = [
  {
    q: 'How do I get access?',
    a: 'Create an account from the sign-up page. New accounts are read-only until an administrator assigns a role.',
  },
  {
    q: 'Can the agents act without anyone checking?',
    a: 'Not for sensitive actions. Steps that use tools such as refunds or sending email pause until a person approves or rejects them, and the run history records the decision.',
  },
  {
    q: 'Who can change workflows?',
    a: 'Only admins create, edit, or delete workflows. Agents can run them.',
  },
  {
    q: 'Which files can I upload for extraction?',
    a: 'PDF, PNG, JPG, and CSV files up to 10 MB each.',
  },
  {
    q: 'How is access protected?',
    a: 'Passwords are stored hashed, sessions use httpOnly cookies, and every permission is checked on the server, not only in the interface.',
  },
];

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <p className="inline-block rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              AI agents with human oversight
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Customer support and data extraction, run by AI agents you control.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Build multi-agent workflows that triage tickets and pull data from documents, with a
              person approving every risky step.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className={cn(buttonVariants(), 'h-11 px-6')}>
                Create your account
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#onboarding"
                className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-6')}
              >
                See how it works
              </a>
            </div>
          </div>
          <ProductPreview />
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 border-y bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Everything in one place</h2>
              <p className="mt-3 text-muted-foreground">
                From the first ticket to the final approval, your team works from a single dashboard.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border bg-card p-6">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Onboarding steps */}
        <section id="onboarding" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Get started in four steps</h2>
            <p className="mt-3 text-muted-foreground">
              Most teams go from sign-up to a first workflow run in a single session.
            </p>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-xl border bg-card p-6">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Roles */}
        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">Built for your whole team</h2>
              <p className="mt-3 text-muted-foreground">
                Give each person the access they need and nothing more.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {roles.map((r) => (
                <div key={r.role} className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold">{r.role}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight">Common questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border bg-card px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to set up your first workflow?
            </h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              Create an account, get your role from your administrator, and start your first run.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: 'secondary' }), 'h-11 px-6')}
              >
                Create your account
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center px-4 text-sm font-medium underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Bot className="size-4" />
            AI Agent Platform
          </span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}