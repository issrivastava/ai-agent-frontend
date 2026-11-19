import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { LoginInput, RegisterInput } from '@/lib/validations/auth';
import type { User } from '@/types/user';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginInput) => (await api.post<{ user: User }>('/auth/login', data)).data,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['me'], user); // the dashboard needs no extra /me request
      router.push('/');
      router.refresh();
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Login failed')),
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ name, email, password }: RegisterInput) =>
      (await api.post<{ user: User }>('/auth/register', { name, email, password })).data,
    onSuccess: () => {
      toast.success('Account created. Please sign in.');
      router.push('/login');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Registration failed')),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    // Runs on success or failure, so the user always ends up signed out locally.
    onSettled: () => {
      queryClient.clear(); // drop cached tickets, runs, and the current user
      router.replace('/login');
      router.refresh();
    },
  });
}