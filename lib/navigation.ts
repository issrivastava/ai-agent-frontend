import {
  Activity,
  FileSearch,
  LayoutDashboard,
  Settings,
  Ticket,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/workflows', label: 'Workflows', icon: Workflow },
  { href: '/extractions', label: 'Data extraction', icon: FileSearch },
  { href: '/runs', label: 'Agent runs', icon: Activity },
  { href: '/settings', label: 'Settings', icon: Settings },
];
