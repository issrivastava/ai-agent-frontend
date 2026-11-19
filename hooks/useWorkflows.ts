import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Workflow, WorkflowInput } from '@/types/workflow';

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => (await api.get<Workflow[]>('/workflows')).data,
  });
}

export function useWorkflow(id: string | null) {
  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => (await api.get<Workflow>(`/workflows/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: WorkflowInput) => (await api.post<Workflow>('/workflows', data)).data,
    onSuccess: (wf) => {
      toast.success(`Workflow "${wf.name}" created`);
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      router.push('/workflows');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Could not create workflow')),
  });
}

export function useUpdateWorkflow(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: WorkflowInput) => (await api.patch<Workflow>(`/workflows/${id}`, data)).data,
    onSuccess: (wf) => {
      toast.success(`Workflow "${wf.name}" saved`);
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', id] });
      router.push('/workflows');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Could not save workflow')),
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/workflows/${id}`);
      return id;
    },
    onSuccess: (id) => {
      toast.success(`${id} deleted`);
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Could not delete workflow')),
  });
}

export function useRunWorkflow() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (id: string) => (await api.post<{ runId: string }>(`/workflows/${id}/run`)).data,
    onSuccess: ({ runId }) => {
      toast.success(`Run ${runId} started`);
      router.push(`/runs/${runId}`);
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Could not start run')),
  });
}