import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from '@/app/(auth)/login/page';

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));
vi.mock('@/hooks/useAuth', () => ({ useLogin: () => ({ mutate, isPending: false }) }));

describe('login page', () => {
  beforeEach(() => mutate.mockClear());

  it('shows validation messages and does not submit an empty form', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('submits the typed email and password', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Work email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'Secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'Secret123' }),
    );
  });

  it('links to the register page', () => {
    render(<LoginPage />);
    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('does not show demo credentials', () => {
    render(<LoginPage />);
    expect(screen.queryByText(/demo accounts/i)).not.toBeInTheDocument();
  });
});
