import type { ExtractedField } from '@/types/extraction';

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export function fieldsToCsv(fields: ExtractedField[]) {
  const rows = fields.map((f) => [f.field, f.value, f.confidence.toFixed(2)].map(csvCell).join(','));
  return ['Field,Value,Confidence', ...rows].join('\r\n');
}