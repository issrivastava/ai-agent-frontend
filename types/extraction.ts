export type ExtractionStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type ExtractedField = {
  field: string;
  value: string;
  confidence: number; // 0 to 1
};

export type ExtractionJob = {
  id: string;
  fileName: string;
  fileSize: number; // bytes
  status: ExtractionStatus;
  createdAt: string;
  finishedAt?: string;
  error?: string;
  fields: ExtractedField[];
};