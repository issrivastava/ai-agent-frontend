import { Bot } from 'lucide-react';
import { SidebarNav } from './sidebar-nav';
import { SidebarUser } from './sidebar-user';

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-4 font-semibold">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </span>
        AI Agent Platform
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <SidebarUser />
    </aside>
  );
}