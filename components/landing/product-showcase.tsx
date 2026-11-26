'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Download,
  FileText,
  Inbox,
  Play,
  ShieldAlert,
  Sparkles,
  Ticket,
  Workflow,
} from 'lucide-react';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tickets = [
  {
    id: 'TCK-4821',
    subject: 'Double charged for warehouse slot booking',
    customer: 'Meridian Logistics',
    status: 'open',
    priority: 'urgent',
    agent: 'Billing Agent',
  },
  {
    id: 'TCK-4820',
    subject: 'Need to reschedule inbound delivery',
    customer: 'Northline Foods',
    status: 'pending',
    priority: 'high',
    agent: 'Dispatch Agent',
  },
  {
    id: 'TCK-4819',
    subject: 'Requesting GST invoice for March',
    customer: 'Aster Retail',
    status: 'resolved',
    priority: 'medium',
    agent: 'Triage Agent',
  },
];

const fields = [
  { label: 'Invoice number', value: 'INV-20841', confidence: 0.98 },
  { label: 'Vendor', value: 'Meridian Logistics Pvt Ltd', confidence: 0.95 },
  { label: 'Invoice date', value: '12 Mar 2026', confidence: 0.91 },
  { label: 'Total amount', value: '₹1,24,500.00', confidence: 0.72 },
];

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
      <span className="size-2.5 rounded-full bg-red-400/70" />
      <span className="size-2.5 rounded-full bg-amber-400/70" />
      <span className="size-2.5 rounded-full bg-emerald-400/70" />
      <span className="ml-3 text-[11px] font-medium text-muted-foreground">{title}</span>
      <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        Live data
      </span>
    </div>
  );
}

function TicketsPanel() {
  return (
    <div>
      <WindowChrome title="Support / Tickets" />
      <div className="space-y-2 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Support inbox</p>
            <p className="text-xs text-muted-foreground">
              Every ticket triaged, prioritised and routed
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="rounded-md bg-brand-soft px-2 py-1 text-[11px] font-medium">
              Open 12
            </span>
            <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
              Urgent 3
            </span>
          </div>
        </div>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border bg-background/70 px-3 py-2.5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-1">
              <Inbox className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{ticket.subject}</p>
              <p className="text-[11px] text-muted-foreground">
                {ticket.id} · {ticket.customer}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <span className="hidden w-28 text-right text-[11px] text-muted-foreground sm:block">
              {ticket.agent}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowPanel() {
  const agents = [
    { icon: Sparkles, name: 'Triage', detail: 'Classify & prioritise' },
    { icon: BadgeCheck, name: 'Billing', detail: 'Check invoices, refunds' },
    { icon: ShieldAlert, name: 'Approval', detail: 'Human decision' },
    { icon: Workflow, name: 'Dispatch', detail: 'Assign & notify' },
  ];

  return (
    <div>
      <WindowChrome title="Workflows / Support triage" />
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Support triage & dispatch</p>
            <p className="text-xs text-muted-foreground">Active · version 4 · 3 tools connected</p>
          </div>
          <span className="bg-brand-gradient shadow-brand inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium text-white">
            <Play className="size-3" />
            Run workflow
          </span>
        </div>

        <div className="rounded-xl border bg-background/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {agents.map((agent, index) => (
              <div key={agent.name} className="flex items-center gap-2">
                <div className="flex min-w-28 items-center gap-2 rounded-lg border bg-card px-2.5 py-2 shadow-xs">
                  <span className="flex size-7 items-center justify-center rounded-md bg-brand-soft text-brand-1">
                    <agent.icon className="size-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-medium">{agent.name}</span>
                    <span className="block text-[10px] text-muted-foreground">{agent.detail}</span>
                  </span>
                </div>
                {index < agents.length - 1 && (
                  <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {['ticket_lookup', 'invoice_search', 'refund_api', 'assign_ticket'].map((tool) => (
              <span
                key={tool}
                className="rounded-full border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/40">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Guardrails built in.</span> Tools such as
            refunds and email sending always pause for a person.
          </p>
        </div>
      </div>
    </div>
  );
}

function ApprovalPanel() {
  return (
    <div>
      <WindowChrome title="Agent runs / RUN-104" />
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">Refund request · Meridian Logistics</p>
            <p className="text-xs text-muted-foreground">Started 1m 12s ago · 2 of 3 steps done</p>
          </div>
          <StatusBadge status="waiting_approval" />
        </div>

        {[
          { title: 'Triage agent', text: 'Matched ticket to fee dispute · high priority' },
          { title: 'Billing agent', text: 'Found invoice INV-20841 and prepared a ₹4,200 refund' },
        ].map((step) => (
          <div key={step.title} className="flex gap-3 rounded-lg border bg-background/70 p-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-xs font-medium">{step.title}</p>
              <p className="text-[11px] text-muted-foreground">{step.text}</p>
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">1.4s</span>
          </div>
        ))}

        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-200">
            <ShieldAlert className="size-3.5" />
            Waiting for your approval
          </p>
          <p className="mt-1 text-[11px] text-amber-700/90 dark:text-amber-300/80">
            Billing agent wants to call <span className="font-mono">refund_api</span> for invoice
            INV-20841. The run is paused until you decide.
          </p>
          <div className="mt-2.5 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-medium text-white">
              <CheckCircle2 className="size-3" />
              Approve
            </span>
            <span className="rounded-md border border-amber-300 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-amber-800 dark:border-amber-800 dark:bg-transparent dark:text-amber-200">
              Reject
            </span>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <CircleDashed className="size-3" />
          Next: Dispatch agent notifies the customer and assigns an owner.
        </p>
      </div>
    </div>
  );
}

function ExtractionPanel() {
  return (
    <div>
      <WindowChrome title="Data extraction / INV-20841.pdf" />
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand-1">
              <FileText className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">INV-20841.pdf</p>
              <p className="text-xs text-muted-foreground">Extracted in 6.2s · 9 fields</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium">
              <Download className="size-3" />
              CSV
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium">
              <Download className="size-3" />
              JSON
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-background/70">
          {fields.map((field, index) => (
            <div
              key={field.label}
              className={
                index === 0
                  ? 'flex items-center gap-3 px-3 py-2'
                  : 'flex items-center gap-3 border-t px-3 py-2'
              }
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-muted-foreground">{field.label}</p>
                <p className="truncate text-xs font-medium">{field.value}</p>
              </div>
              <div className="w-24">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={
                      field.confidence < 0.8
                        ? 'h-full rounded-full bg-amber-500'
                        : 'h-full rounded-full bg-emerald-500'
                    }
                    style={{ width: `${Math.round(field.confidence * 100)}%` }}
                  />
                </div>
              </div>
              <span
                className={
                  field.confidence < 0.8
                    ? 'w-14 text-right text-[11px] font-medium text-amber-600 dark:text-amber-400'
                    : 'w-14 text-right text-[11px] font-medium text-emerald-600 dark:text-emerald-400'
                }
              >
                {Math.round(field.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>

        <p className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
          <Sparkles className="size-3.5 shrink-0 text-amber-500" />
          Low-confidence fields are highlighted so a person can review before export.
        </p>
      </div>
    </div>
  );
}

const tabs = [
  { value: 'tickets', label: 'Tickets', icon: Ticket, panel: <TicketsPanel /> },
  { value: 'workflows', label: 'Workflows', icon: Workflow, panel: <WorkflowPanel /> },
  { value: 'approvals', label: 'Approvals', icon: ShieldAlert, panel: <ApprovalPanel /> },
  { value: 'extractions', label: 'Extraction', icon: FileText, panel: <ExtractionPanel /> },
];

export function ProductShowcase() {
  const [value, setValue] = useState('tickets');

  return (
    <Tabs
      value={value}
      onValueChange={(next) => setValue(String(next))}
      className="gap-0 overflow-hidden rounded-2xl border bg-card/80 shadow-xl backdrop-blur"
    >
      <div className="flex flex-col gap-3 border-b bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-background/80 p-1 sm:w-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 rounded-full px-3 py-1.5 data-active:bg-brand-soft data-active:text-brand-1"
            >
              <tab.icon className="size-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
          <ArrowRight className="size-3.5" />
          One workspace, four connected surfaces
        </span>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="animate-fade-in">
          {tab.panel}
        </TabsContent>
      ))}
    </Tabs>
  );
}
