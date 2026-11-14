import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Run } from '@/types/run';

export function useRun(id: string) {
  return useQuery({
    queryKey: ['run', id],
    queryFn: async () => (await api.get<Run>(`/runs/${id}`)).data,
    retry: false,
    // Poll while the run is active; stop when it finishes or the request fails.
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false;
      const status = query.state.data?.status;
      return status === 'completed' || status === 'failed' ? false : 1500;
    },
  });
}

export function useRunDecision(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (decision: 'approved' | 'rejected') =>
      (await api.post<Run>(`/runs/${id}/decision`, { decision })).data,
    onSuccess: (run, decision) => {
      queryClient.setQueryData(['run', id], run);
      toast.success(decision === 'approved' ? 'Step approved' : 'Step rejected');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Could not submit decision')),
  });
}
export function useRuns() {
  return useQuery({
    queryKey: ['runs'],
    queryFn: async () => (await api.get<Run[]>('/runs')).data,
    // Keep the list fresh while any run is still in progress.
    refetchInterval: (query) => {
      if (query.state.status === 'error') return false;
      const active = query.state.data?.some(
        (r) => r.status === 'running' || r.status === 'waiting_approval',
      );
      return active ? 3000 : false;
    },
  });
}