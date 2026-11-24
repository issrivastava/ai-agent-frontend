'use client';

import Link from 'next/link';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowDown,
  ArrowUp,
  FileScan,
  LifeBuoy,
  Plus,
  ReceiptText,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { workflowSchema, type WorkflowFormValues } from '@/lib/validations/workflow';
import { agentRoles, availableTools, workflowStatuses, workflowTypes } from '@/types/workflow';

const selectClass =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm capitalize shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30';

export const emptyWorkflow: WorkflowFormValues = {
  name: '',
  description: '',
  type: 'dispatch',
  status: 'draft',
  agents: [{ role: 'triage', prompt: '', tools: [] }],
};

const workflowTemplates: {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  values: WorkflowFormValues;
}[] = [
  {
    id: 'support-triage',
    label: 'Support triage',
    description: 'Find the customer, decide the owner, and loop in dispatch.',
    icon: LifeBuoy,
    values: {
      name: 'Support triage',
      description: 'Triage every new support ticket and route it to the right resolver.',
      type: 'dispatch',
      status: 'draft',
      agents: [
        {
          role: 'triage',
          prompt:
            'Read the incoming ticket, look up the customer and their orders, and summarize the request in one sentence.',
          tools: ['ticket_lookup'],
        },
        {
          role: 'dispatch',
          prompt:
            'Choose the best resolver for this request using the slot search, then assign the ticket and note why.',
          tools: ['slot_search', 'assign_ticket'],
        },
      ],
    },
  },
  {
    id: 'refund-review',
    label: 'Refund review',
    description: 'Inspect the payment, prepare the refund, and pause for approval.',
    icon: ReceiptText,
    values: {
      name: 'Refund review',
      description: 'Check a refund request against the payment history before anything is sent.',
      type: 'dispatch',
      status: 'draft',
      agents: [
        {
          role: 'billing',
          prompt:
            'Find the matching invoice and payment, confirm the refund is valid, and prepare the exact amount.',
          tools: ['invoice_search', 'refund_api'],
        },
        {
          role: 'triage',
          prompt:
            'Write a short, friendly update for the customer explaining the decision and next step.',
          tools: ['ticket_lookup', 'email_sender'],
        },
      ],
    },
  },
  {
    id: 'document-intake',
    label: 'Document intake',
    description: 'Read a PDF, extract key fields, and flag low-confidence values.',
    icon: FileScan,
    values: {
      name: 'Document intake',
      description: 'Extract supplier, totals, dates, and line items from uploaded documents.',
      type: 'extraction',
      status: 'draft',
      agents: [
        {
          role: 'extractor',
          prompt:
            'Read the uploaded document and extract the supplier, invoice number, date, totals, and every line item.',
          tools: ['pdf_reader', 'ocr'],
        },
        {
          role: 'triage',
          prompt:
            'Validate the extracted fields, flag anything below 90% confidence, and summarize exceptions for review.',
          tools: ['ticket_lookup'],
        },
      ],
    },
  },
];

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

export function WorkflowForm({
  defaultValues = emptyWorkflow,
  onSubmit,
  isSubmitting,
  submitLabel,
  showTemplates = false,
}: {
  defaultValues?: WorkflowFormValues;
  onSubmit: (values: WorkflowFormValues) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  showTemplates?: boolean;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues,
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'agents' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-6">
      {showTemplates && (
        <Card className="border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Start from a template</CardTitle>
            <p className="text-xs text-muted-foreground">
              Pre-filled agents, prompts, and tools you can edit before saving.
            </p>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-3">
            {workflowTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => reset(template.values)}
                  className="group flex flex-col gap-2 rounded-xl border bg-card p-3 text-left transition-colors hover:border-brand-1/40 hover:bg-brand-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand-1 transition-colors group-hover:bg-card">
                    <Icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{template.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                      {template.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register('description')} />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" className={selectClass} {...register('type')}>
                {workflowTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className={selectClass} {...register('status')}>
                {workflowStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Only active workflows can be run.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Agents</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ role: 'triage', prompt: '', tools: [] })}
          >
            <Plus className="size-4" />
            Add agent
          </Button>
        </div>
        <FieldError message={errors.agents?.root?.message ?? errors.agents?.message} />

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Step {index + 1}</CardTitle>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Move agent up"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Move agent down"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove agent"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`agents.${index}.role`}>Role</Label>
                <select
                  id={`agents.${index}.role`}
                  className={selectClass}
                  {...register(`agents.${index}.role`)}
                >
                  {agentRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`agents.${index}.prompt`}>Prompt</Label>
                <Textarea
                  id={`agents.${index}.prompt`}
                  rows={3}
                  placeholder="What should this agent do?"
                  {...register(`agents.${index}.prompt`)}
                />
                <FieldError message={errors.agents?.[index]?.prompt?.message} />
              </div>

              <div className="space-y-2">
                <Label>Tools</Label>
                <Controller
                  control={control}
                  name={`agents.${index}.tools`}
                  render={({ field: toolsField }) => (
                    <div className="flex flex-wrap gap-2">
                      {availableTools.map((tool) => {
                        const checked = toolsField.value.includes(tool);
                        return (
                          <label
                            key={tool}
                            className={cn(
                              'flex cursor-pointer items-center rounded-md border px-2.5 py-1 text-xs has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                              checked
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'text-muted-foreground hover:bg-muted',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() =>
                                toolsField.onChange(
                                  checked
                                    ? toolsField.value.filter((t) => t !== tool)
                                    : [...toolsField.value, tool],
                                )
                              }
                            />
                            {tool}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
        <Link href="/workflows" className={cn(buttonVariants({ variant: 'outline' }))}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
