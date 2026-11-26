import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

/** Starts a run, optionally against a specific ticket, then opens the live viewer. */
export function useStartRun() {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ workflowId, ticketId }: { workflowId: string; ticketId?: string }) =>
      (
        await api.post<{ runId: string }>(
          `/workflows/${workflowId}/run`,
          ticketId ? { ticketId } : {},
        )
      ).data,
    onSuccess: ({ runId }) => {
      toast.success(`Run ${runId} started`);
      router.push(`/runs/${runId}`);
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Could not start run')),
  });
}