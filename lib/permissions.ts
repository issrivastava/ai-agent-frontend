import type { Role } from '@/types/user';

export type Permission =
  | 'workflows:manage' // create, edit, delete
  | 'workflows:run'
  | 'runs:decide' // approve or reject agent actions
  | 'tickets:reassign'
  | 'extractions:upload'
  | 'users:manage'; // settings page

const matrix: Record<Role, readonly Permission[]> = {
  admin: [
    'workflows:manage',
    'workflows:run',
    'runs:decide',
    'tickets:reassign',
    'extractions:upload',
    'users:manage',
  ],
  agent: ['workflows:run', 'runs:decide', 'tickets:reassign', 'extractions:upload'],
  viewer: [],
};

export function hasPermission(role: Role | undefined, permission: Permission) {
  return !!role && matrix[role].includes(permission);
}