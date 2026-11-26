import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadFile, fieldsToCsv } from '@/lib/export';

describe('fieldsToCsv', () => {
  it('writes a header and one quoted row per field', () => {
    const csv = fieldsToCsv([{ field: 'Vendor', value: 'Sharma Logistics', confidence: 0.97 }]);
    expect(csv.split('\r\n')).toEqual(['Field,Value,Confidence', '"Vendor","Sharma Logistics","0.97"']);
  });

  it('keeps values that contain commas in one cell', () => {
    const csv = fieldsToCsv([{ field: 'Subtotal', value: '₹42,500.00', confidence: 0.9 }]);
    expect(csv).toContain('"₹42,500.00"');
  });

  it('doubles quotes inside a value', () => {
    const csv = fieldsToCsv([{ field: 'Note', value: 'He said "paid"', confidence: 1 }]);
    expect(csv).toContain('"He said ""paid"""');
  });

  it('shows confidence with two decimals', () => {
    const csv = fieldsToCsv([{ field: 'Total', value: '10', confidence: 0.5 }]);
    expect(csv).toContain('"0.50"');
  });

  it('returns only the header for no fields', () => {
    expect(fieldsToCsv([])).toBe('Field,Value,Confidence');
  });
});

describe('downloadFile', () => {
  afterEach(() => vi.restoreAllMocks());

  it('clicks a temporary link with the right file name, then cleans up', () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const create = vi.fn(() => 'blob:test');
    const revoke = vi.fn();
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;

    downloadFile('invoice.csv', 'a,b', 'text/csv');

    const clicked = click.mock.contexts[0] as HTMLAnchorElement | undefined;
    expect(clicked?.download).toBe('invoice.csv');
    expect(create).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledWith('blob:test');
  });
});