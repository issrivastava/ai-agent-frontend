import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Ticket, TicketFilters } from '@/types/ticket';

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: async () => (await api.get<Ticket[]>('/tickets', { params: filters })).data,
    placeholderData: keepPreviousData, // keep old rows visible while a new filter loads
  });
}

export function useTicket(id: string | null) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => (await api.get<Ticket>(`/tickets/${id}`)).data,
    enabled: !!id,
  });
}

export function useReassignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assignedAgent }: { id: string; assignedAgent: string }) =>
      (await api.patch<Ticket>(`/tickets/${id}`, { assignedAgent })).data,
    onSuccess: (ticket) => {
      toast.success(`${ticket.id} reassigned to ${ticket.assignedAgent}`);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] });
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Reassignment failed')),
  });
}