import { Bot } from 'lucide-react';
import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-4 font-semibold">
        <Bot className="size-5" />
        AI Agent Platform
      </div>
      <SidebarNav />
    </aside>
  );
}
