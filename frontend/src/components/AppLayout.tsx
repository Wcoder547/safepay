import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu } from "lucide-react";
import { Sidebar} from "@/components/Sidebar";
import { useNotifications } from "@/hooks/useNotifications";
import useAuthStore from "@/store/auth.store";

interface AppLayoutProps {
  children:    React.ReactNode;
  title?:      string;
  subtitle?:   string;
  headerRight?: React.ReactNode; 
}

export function AppLayout({
  children,
  title,
  subtitle,
  headerRight,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { data: notifData } = useNotifications();
  const unreadCount = notifData?.unread_count ?? 0;

  const initials = user?.full_name
    ?.split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* Shared sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">

          {/* Left — hamburger + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {title && (
              <div>
                <h1 className="text-base font-bold text-slate-900">{title}</h1>
                {subtitle && (
                  <p className="text-[11px] text-slate-400">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Right — custom content OR default bell + avatar */}
          <div className="flex items-center gap-2">
            {headerRight ?? (
              <>
                {/* Notifications bell */}
                <Link
                  to="/notification"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                  {initials}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}