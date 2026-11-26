import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '@/lib/errors';

describe('getErrorMessage', () => {
  it("uses the server's message when there is one", () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, {}, {
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config: {},
      data: { message: 'An account with this email already exists' },
    } as never);

    expect(getErrorMessage(error)).toBe('An account with this email already exists');
  });

  it('says the server cannot be reached when there is no response', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK', undefined, {});
    expect(getErrorMessage(error)).toBe('Cannot reach the server');
  });

  it('falls back when the response has no message', () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, {}, {
      status: 500,
      statusText: 'Server Error',
      headers: {},
      config: {},
      data: {},
    } as never);

    expect(getErrorMessage(error)).toBe('Something went wrong');
    expect(getErrorMessage(error, 'Could not save')).toBe('Could not save');
  });

  it('uses the fallback for errors that are not from axios', () => {
    expect(getErrorMessage(new Error('boom'), 'Custom fallback')).toBe('Custom fallback');
  });
});