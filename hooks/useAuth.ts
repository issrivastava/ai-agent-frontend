import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { ChangePasswordInput, LoginInput, RegisterInput } from '@/lib/validations/auth';
import type { User } from '@/types/user';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LoginInput) => (await api.post<{ user: User }>('/auth/login', data)).data,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['me'], user);
      router.push('/dashboard');
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
    onSettled: () => {
      queryClient.clear();
      router.replace('/login');
      router.refresh();
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => toast.success('Password updated. Use it the next time you sign in.'),
    onError: (e) => toast.error(getErrorMessage(e, 'Could not change your password')),
  });
}