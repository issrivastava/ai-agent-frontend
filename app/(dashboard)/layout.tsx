import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AuthProvider } from '@/providers/auth-provider';
import { MswProvider } from '@/providers/msw-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MswProvider>
      <AuthProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </MswProvider>
  );
}