import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => (await api.get('/health')).data,
  });
}
