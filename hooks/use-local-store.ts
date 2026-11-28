'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

function readValue<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  try {
    const raw = window.localStorage.getItem(key);
    cache.set(key, raw ? (JSON.parse(raw) as T) : fallback);
  } catch {
    cache.set(key, fallback);
  }
  return cache.get(key) as T;
}

function writeValue<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / quota — the in-memory value still works for this tab.
  }
  listeners.get(key)?.forEach((listener) => listener());
}

/**
 * useState backed by localStorage. SSR snapshot is `fallback`, so pass a
 * stable (module-level) fallback value.
 */
export function useLocalStore<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (listener: Listener) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
          cache.delete(key);
          listener();
        }
      };
      window.addEventListener('storage', onStorage);
      return () => {
        set?.delete(listener);
        window.removeEventListener('storage', onStorage);
      };
    },
    [key],
  );

  const snapshot = useCallback(() => readValue(key, fallback), [key, fallback]);
  const serverSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const setValue = (next: T | ((prev: T) => T)) => {
    const resolved =
      typeof next === 'function' ? (next as (prev: T) => T)(readValue(key, fallback)) : next;
    writeValue(key, resolved);
  };

  return [value, setValue];
}
