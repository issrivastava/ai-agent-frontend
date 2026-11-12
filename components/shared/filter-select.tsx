import { cn } from '@/lib/utils';

export function FilterSelect({ label, value, onChange, options, className }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  className?: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn('h-9 rounded-md border ... capitalize ...', className)}
    >
      <option value="all">All {label.toLowerCase()}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}