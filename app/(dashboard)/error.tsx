'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/shared/error-state';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // later: send to Sentry or similar
  }, [error]);

  return <ErrorState message="An unexpected error occurred on this page." onRetry={reset} />;
}