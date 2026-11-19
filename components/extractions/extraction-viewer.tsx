'use client';

import Link from 'next/link';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { DataTable, SortableHeader } from '@/components/shared/data-table';
import { ErrorState } from '@/components/shared/error-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useExtraction } from '@/hooks/useExtractions';
import { downloadFile, fieldsToCsv } from '@/lib/export';
import { cn } from '@/lib/utils';
import type { ExtractedField } from '@/types/extraction';
import { formatBytes } from './extractions-panel';

const LOW_CONFIDENCE = 0.8;

const columns: ColumnDef<ExtractedField>[] = [
  {
    accessorKey: 'field',
    header: ({ column }) => <SortableHeader column={column} title="Field" />,
    cell: ({ row }) => <span className="font-medium">{row.original.field}</span>,
  },
  { accessorKey: 'value', header: 'Value' },
  {
    accessorKey: 'confidence',
    header: ({ column }) => <SortableHeader column={column} title="Confidence" />,
    cell: ({ row }) => {
      const c = row.original.confidence;
      return (
        <span className={cn(c < LOW_CONFIDENCE && 'font-medium text-amber-600 dark:text-amber-400')}>
          {Math.round(c * 100)}%{c < LOW_CONFIDENCE && ' · review'}
        </span>
      );
    },
  },
];

export function ExtractionViewer({ id }: { id: string }) {
  const { data: job, isLoading, isError, refetch } = useExtraction(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <ErrorState
        title="Job not found"
        message="It may have been cleared by a page refresh, since mock jobs live in memory."
        onRetry={() => refetch()}
      />
    );
  }

  const baseName = job.fileName.replace(/\.[^.]+$/, '');
  const processing = job.status === 'queued' || job.status === 'processing';

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/extractions" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-3')}>
        <ArrowLeft className="size-4" />
        All jobs
      </Link>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{job.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {job.id} · {formatBytes(job.fileSize)} · uploaded{' '}
              {new Date(job.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </CardContent>
      </Card>

      {processing && (
        <div className="flex items-center gap-2 rounded-md border p-4 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {job.status === 'queued' ? 'Waiting in the queue…' : 'Agents are extracting data…'}
        </div>
      )}

      {job.status === 'failed' && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Extraction failed</p>
          <p className="text-muted-foreground">{job.error}</p>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Extracted fields</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadFile(`${baseName}.csv`, fieldsToCsv(job.fields), 'text/csv;charset=utf-8')
                }
              >
                <Download className="size-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadFile(
                    `${baseName}.json`,
                    JSON.stringify(job.fields, null, 2),
                    'application/json',
                  )
                }
              >
                <Download className="size-4" />
                JSON
              </Button>
            </div>
          </div>
          <DataTable columns={columns} data={job.fields} searchPlaceholder="Search fields…" />
        </div>
      )}
    </div>
  );
}