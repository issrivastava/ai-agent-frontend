import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SuggestionChips, type Suggestion } from '@/components/shared/suggestion-chips';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.ComponentProps<'a'> & { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('SuggestionChips', () => {
  it('renders a button per suggestion and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const suggestions: Suggestion[] = [{ label: 'Take a tour', onClick }];

    render(<SuggestionChips suggestions={suggestions} />);
    await user.click(screen.getByRole('button', { name: /take a tour/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders link suggestions with their href', () => {
    const suggestions: Suggestion[] = [{ label: 'New workflow', href: '/workflows/new' }];
    render(<SuggestionChips suggestions={suggestions} />);
    expect(screen.getByRole('link', { name: /new workflow/i })).toHaveAttribute(
      'href',
      '/workflows/new',
    );
  });

  it('shows the optional group label', () => {
    render(
      <SuggestionChips
        label="Suggested"
        suggestions={[{ label: 'Open guide', onClick: vi.fn() }]}
      />,
    );
    expect(screen.getByText('Suggested')).toBeInTheDocument();
  });

  it('renders nothing when there are no suggestions', () => {
    const { container } = render(<SuggestionChips suggestions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
