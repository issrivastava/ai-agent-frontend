import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { SidebarNav } from './sidebar-nav';
import { SidebarUser } from './sidebar-user';

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <Link href="/dashboard" aria-label="AI Agent Platform dashboard">
          <Logo markClassName="size-8 rounded-lg" />
        </Link>
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-card/70 px-2.5 py-2">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium">Operations workspace</p>
            <p className="truncate text-[10px] text-muted-foreground">Supervised automation</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <SidebarNav />
      </div>

      <SidebarUser />
    </aside>
  );
}
