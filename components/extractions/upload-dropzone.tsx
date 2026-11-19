'use client';

import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ['application/pdf', 'image/png', 'image/jpeg', 'text/csv'];

export function UploadDropzone({
  onFile,
  uploading,
}: {
  onFile: (file: File) => void;
  uploading?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handle(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Unsupported file type. Use PDF, PNG, JPG, or CSV.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('File is larger than 10 MB.');
      return;
    }
    onFile(file);
  }

  const open = () => !uploading && inputRef.current?.click();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload a document"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!uploading) handle(e.dataTransfer.files);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        dragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
        uploading && 'cursor-not-allowed opacity-60',
      )}
    >
      {uploading ? (
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      ) : (
        <UploadCloud className="size-8 text-muted-foreground" />
      )}
      <p className="text-sm font-medium">
        {uploading ? 'Uploading…' : 'Drag a document here, or click to browse'}
      </p>
      <p className="text-xs text-muted-foreground">PDF, PNG, JPG, or CSV, up to 10 MB</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.csv"
        className="hidden"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = ''; // lets you pick the same file again
        }}
      />
    </div>
  );
}