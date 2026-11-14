'use client';

import { useRouter } from 'next/navigation';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { useExtractions, useUploadExtraction } from '@/hooks/useExtractions';
import type { ExtractionJob } from '@/types/extraction';
import { UploadDropzone } from './upload-dropzone';

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const columns: ColumnDef<ExtractionJob>[] = [
  { accessorKey: 'id', header: 'Job' },
  {
    accessorKey: 'fileName',
    header: ({ column }) => <SortableHeader column={column} title="File" />,
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    cell: ({ row }) => formatBytes(row.original.fileSize),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'fields',
    header: 'Fields',
    cell: ({ row }) => (row.original.fields.length > 0 ? row.original.fields.length : '—'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader column={column} title="Uploaded" />,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString('en-IN'),
  },
];

export function ExtractionsPanel() {
  const router = useRouter();
  const upload = useUploadExtraction();
  const { data, isLoading, isError, refetch } = useExtractions();

  return (
    <div className="space-y-6">
      <UploadDropzone onFile={(file) => upload.mutate(file)} uploading={upload.isPending} />
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        searchPlaceholder="Search jobs…"
        emptyTitle="No extraction jobs yet"
        emptyDescription="Upload a document to start."
        onRowClick={(job) => router.push(`/extractions/${job.id}`)}
      />
    </div>
  );
}