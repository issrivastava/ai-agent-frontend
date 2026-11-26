import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from '@/lib/validations/auth';

const messages = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((i) => i.message) ?? [];

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'x' });
    expect(result.success).toBe(false);
    expect(messages(result)).toContain('Enter a valid email address');
  });

  it('requires a password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(messages(result)).toContain('Password is required');
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'Asha Rao',
    email: 'asha@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  };

  it('accepts valid details', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a short name', () => {
    expect(messages(registerSchema.safeParse({ ...valid, name: 'A' }))).toContain(
      'Name must be at least 2 characters',
    );
  });

  it('enforces the password rules', () => {
    const short = registerSchema.safeParse({ ...valid, password: 'Pa1', confirmPassword: 'Pa1' });
    const noUpper = registerSchema.safeParse({ ...valid, password: 'password1', confirmPassword: 'password1' });
    const noNumber = registerSchema.safeParse({ ...valid, password: 'Password', confirmPassword: 'Password' });

    expect(messages(short)).toContain('At least 8 characters');
    expect(messages(noUpper)).toContain('Include an uppercase letter');
    expect(messages(noNumber)).toContain('Include a number');
  });

  it('requires both passwords to match', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'Different1' });
    expect(result.success).toBe(false);
    expect(messages(result)).toContain('Passwords do not match');
  });
});