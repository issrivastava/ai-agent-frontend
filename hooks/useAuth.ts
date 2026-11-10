import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { LoginInput, RegisterInput } from '@/lib/validations/auth';
import type { User } from '@/types/user';

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: LoginInput) =>
      (await api.post<{ user: User }>('/auth/login', data)).data,
    onSuccess: () => {
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
