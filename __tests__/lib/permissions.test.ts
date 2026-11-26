import { describe, expect, it } from 'vitest';
import { hasPermission, type Permission } from '@/lib/permissions';

const all: Permission[] = [
  'workflows:manage',
  'workflows:run',
  'runs:decide',
  'tickets:reassign',
  'extractions:upload',
  'users:manage',
];

describe('hasPermission', () => {
  it('gives admins everything', () => {
    for (const p of all) expect(hasPermission('admin', p)).toBe(true);
  });

  it('lets agents work but not manage', () => {
    expect(hasPermission('agent', 'workflows:run')).toBe(true);
    expect(hasPermission('agent', 'runs:decide')).toBe(true);
    expect(hasPermission('agent', 'tickets:reassign')).toBe(true);
    expect(hasPermission('agent', 'extractions:upload')).toBe(true);
    expect(hasPermission('agent', 'workflows:manage')).toBe(false);
    expect(hasPermission('agent', 'users:manage')).toBe(false);
  });

  it('gives viewers nothing', () => {
    for (const p of all) expect(hasPermission('viewer', p)).toBe(false);
  });

  it('denies everything when there is no role', () => {
    for (const p of all) expect(hasPermission(undefined, p)).toBe(false);
  });
});