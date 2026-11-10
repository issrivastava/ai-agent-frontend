import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      (error.request && !error.response ? 'Cannot reach the server' : fallback)
    );
  }
  return fallback;
}
