export type Role = 'admin' | 'agent' | 'viewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
