import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AuthProvider } from '@/providers/auth-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="relative flex-1 overflow-y-auto">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-linear-to-b from-brand-soft to-transparent opacity-50"
            />
            <div className="relative p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
