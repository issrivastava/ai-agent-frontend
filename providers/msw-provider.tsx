'use client';

import { useEffect, useState } from 'react';

const enabled = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

// Module-level, so it survives Strict Mode's double effect run and re-renders.
let startPromise: Promise<unknown> | null = null;

function startMocking() {
  if (!startPromise) {
    startPromise = import('@/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }),
    );
  }
  return startPromise;
}

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    startMocking()
      .catch((err) => console.error('[MSW] failed to start:', err))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}