import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login')
    ) {
      // Full reload on purpose: clears cached user data after session expiry.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`${window.location.origin}/login`);
    }
    return Promise.reject(error);
  },
);
