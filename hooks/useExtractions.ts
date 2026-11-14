import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { ExtractionJob } from '@/types/extraction';

const isActive = (j: ExtractionJob) => j.status === 'queued' || j.status === 'processing';

export function useExtractions() {
  return useQuery({
    queryKey: ['extractions'],
    queryFn: async () => (await api.get<ExtractionJob[]>('/extractions')).data,
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false;
      return query.state.data?.some(isActive) ? 2000 : false;
    },
  });
}

export function useExtraction(id: string) {
  return useQuery({
    queryKey: ['extraction', id],
    queryFn: async () => (await api.get<ExtractionJob>(`/extractions/${id}`)).data,
    retry: false,
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false;
      const job = query.state.data;
      return job && isActive(job) ? 1500 : false;
    },
  });
}

export function useUploadExtraction() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      // Must override the instance's JSON content type, or axios would turn the form into JSON.
      return (
        await api.post<ExtractionJob>('/extractions', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ).data;
    },
    onSuccess: (job) => {
      toast.success(`${job.fileName} uploaded`);
      queryClient.invalidateQueries({ queryKey: ['extractions'] });
      router.push(`/extractions/${job.id}`);
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Upload failed')),
  });
}