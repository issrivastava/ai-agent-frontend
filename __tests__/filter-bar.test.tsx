import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar, type FilterChip } from '@/components/shared/filter-bar';

describe('FilterBar', () => {
  it('renders nothing without chips or children', () => {
    const { container } = render(<FilterBar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders children and a chip per active filter', () => {
    const chips: FilterChip[] = [
      { id: 'status', label: 'Status: open', onRemove: vi.fn() },
      { id: 'agent', label: 'Agent: Billing Agent', onRemove: vi.fn() },
    ];
    render(
      <FilterBar chips={chips} onClearAll={vi.fn()}>
        <span>Statuses</span>
      </FilterBar>,
    );
    expect(screen.getByText('Statuses')).toBeInTheDocument();
    expect(screen.getByText('Status: open')).toBeInTheDocument();
    expect(screen.getByText('Agent: Billing Agent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
  });

  it('removes a single chip and clears all', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    render(
      <FilterBar chips={[{ id: 'q', label: '“ledger”', onRemove }]} onClearAll={onClearAll}>
        <span>Statuses</span>
      </FilterBar>,
    );

    await user.click(screen.getByRole('button', { name: /Status:|ledger|Remove this filter/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
