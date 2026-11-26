import {
  Activity,
  FileSearch,
  LayoutDashboard,
  Settings,
  Ticket,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { Permission } from '@/lib/permissions';

export type NavGroup = 'Workspace' | 'Operations' | 'Administration';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
  group: NavGroup;
  description: string;
};

export const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'Workspace',
    description: 'Live KPIs, approvals, and everything happening across your agents.',
  },
  {
    href: '/tickets',
    label: 'Tickets',
    icon: Ticket,
    group: 'Operations',
    description: 'The customer support queue: search, filter, and reassign tickets.',
  },
  {
    href: '/workflows',
    label: 'Workflows',
    icon: Workflow,
    group: 'Operations',
    description: 'Build and run ordered agent playbooks with guardrails.',
  },
  {
    href: '/extractions',
    label: 'Data extraction',
    icon: FileSearch,
    group: 'Operations',
    description: 'Upload documents and review extracted fields with confidence scores.',
  },
  {
    href: '/runs',
    label: 'Agent runs',
    icon: Activity,
    group: 'Operations',
    description: 'Every workflow execution, its steps, tools, and human decisions.',
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    group: 'Administration',
    permission: 'users:manage',
    description: 'Invite people and choose the role each person should have.',
  },
];

export const navGroups: NavGroup[] = ['Workspace', 'Operations', 'Administration'];
