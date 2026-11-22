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

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
};

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/workflows', label: 'Workflows', icon: Workflow },
  { href: '/extractions', label: 'Data extraction', icon: FileSearch },
  { href: '/runs', label: 'Agent runs', icon: Activity },
  { href: '/settings', label: 'Settings', icon: Settings, permission: 'users:manage' },
];