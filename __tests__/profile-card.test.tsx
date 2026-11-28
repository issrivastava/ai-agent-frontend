import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileCard } from '@/components/settings/profile-card';

vi.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin' },
    can: () => true,
  }),
}));

describe('ProfileCard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows identity and starts at 3 of 7 fields (43%)', () => {
    render(<ProfileCard />);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '43');
  });

  it('saves edited details and updates completion', async () => {
    const user = userEvent.setup();
    render(<ProfileCard />);

    await user.click(screen.getByRole('button', { name: /edit details/i }));
    await user.type(screen.getByLabelText('Phone'), '+91 98765 43210');
    await user.click(screen.getByRole('button', { name: /save details/i }));

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '57');
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
  });

  it('persists saved details to localStorage', async () => {
    const user = userEvent.setup();
    render(<ProfileCard />);

    await user.click(screen.getByRole('button', { name: /edit details/i }));
    await user.type(screen.getByLabelText('Company'), 'Acme Logistics');
    await user.click(screen.getByRole('button', { name: /save details/i }));

    const stored = JSON.parse(
      window.localStorage.getItem('agent-platform:profile-details') ?? '{}',
    );
    expect(stored.company).toBe('Acme Logistics');
  });
});
