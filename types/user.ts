export const roles = ['admin', 'agent', 'viewer'] as const;
export type Role = (typeof roles)[number];

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};