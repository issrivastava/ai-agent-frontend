'use client';

import Link from 'next/link';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { workflowSchema, type WorkflowFormValues } from '@/lib/validations/workflow';
import { agentRoles, availableTools, workflowStatuses, workflowTypes } from '@/types/workflow';

const selectClass =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm capitalize shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export const emptyWorkflow: WorkflowFormValues = {
  name: '',
  description: '',
  type: 'dispatch',
  status: 'draft',
  agents: [{ role: 'triage', prompt: '', tools: [] }],
};

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

export function WorkflowForm({
  defaultValues = emptyWorkflow,
  onSubmit,
  isSubmitting,
  submitLabel,
}: {
  defaultValues?: WorkflowFormValues;
  onSubmit: (values: WorkflowFormValues) => void;
  isSubmitting?: boolean;
  submitLabel: string;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowSchema),
    defaultValues,
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'agents' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-6">
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