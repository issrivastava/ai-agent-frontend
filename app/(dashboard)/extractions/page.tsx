import { Suspense } from 'react';
import { CheckCheck, FileSearch, ScanLine, UploadCloud } from 'lucide-react';
import { PageGuide } from '@/components/layout/page-guide';
import { PageHeader } from '@/components/layout/page-header';
import { ExtractionsPanel } from '@/components/extractions/extractions-panel';
import { TableContentSkeleton } from '@/components/shared/skeletons';

export default function ExtractionsPage() {
  return (
    <>
      <PageHeader
        icon={FileSearch}
        title="Data extraction"
        description="Turn invoices, receipts, and PDFs into structured, reviewable data."
      />
      <PageGuide
        steps={[
          {
            icon: UploadCloud,
            title: 'Upload a document',
            description: 'Send a PDF, image, or CSV; the file is queued for processing.',
          },
          {
            icon: ScanLine,
            title: 'Agents read and extract',
            description: 'OCR and PDF tools pull out suppliers, totals, dates, and line items.',
          },
          {
            icon: CheckCheck,
            title: 'Review with confidence',
            description: 'Open a job to check every field and its confidence score.',
          },
        ]}
      />
      <Suspense fallback={<TableContentSkeleton columns={5} filters={1} />}>
        <ExtractionsPanel />
      </Suspense>
    </>
  );
}
