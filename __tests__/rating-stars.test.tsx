import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RatingStars } from '@/components/shared/rating-stars';

describe('RatingStars', () => {
  it('renders read-only ratings with an accessible label', () => {
    render(<RatingStars value={3} />);
    expect(screen.getByRole('img', { name: 'Rating: 3 out of 5' })).toBeInTheDocument();
  });

  it('reports the clicked star value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={0} onChange={onChange} label="Run rating" />);

    await user.click(screen.getByRole('button', { name: 'Rate 4 out of 5' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('exposes one labelled button per star when interactive', () => {
    render(<RatingStars value={2} onChange={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'Rate 5 out of 5' })).toBeInTheDocument();
  });

  it('shows no buttons when read-only', () => {
    render(<RatingStars value={5} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
