import { describe, expect, it } from 'vitest';
import { fireConfetti } from '@/components/shared/confetti';

describe('fireConfetti', () => {
  it('is a safe no-op outside the browser', () => {
    expect(() => fireConfetti()).not.toThrow();
  });

  it('accepts an optional origin without throwing', () => {
    expect(() => fireConfetti({ x: 100, y: 200 })).not.toThrow();
  });
});
