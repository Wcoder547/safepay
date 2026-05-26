import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell, CreditCard, LayoutDashboard,
  LogOut, Send, Settings, User, Wallet, X,
} from "lucide-react";
import useAuthStore from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";


const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     to: "/dashboard"      },
  { icon: Send,            label: "Send Money",    to: "/sendMoney"      },
  { icon: Wallet,          label: "Wallet",        to: "/wallet"         },
  { icon: CreditCard,      label: "History",       to: "/history"        },
  { icon: Bell,            label: "Notification", to: "/notification"  },
  { icon: User,            label: "Profile",       to: "/profile"        },
  { icon: Settings,        label: "Settings",      to: "/settings"       },
];


export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2" />
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8" />
      <path d="M18 14.5 Q20 16 18 17.5" stroke="white" strokeOpacity="0.65" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M20 13.5 Q23 16 20 18.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="9"  cy="21" r="1.2" fill="white" fillOpacity="0.7" />
      <circle cx="13" cy="21" r="1.2" fill="white" fillOpacity="0.45" />
      <circle cx="23" cy="9"  r="5"   fill="#10B981" />
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" /><stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}


interface SidebarProps {
  open:    boolean;
  onClose: () => void;
}


export function Sidebar({ open, onClose }: SidebarProps) {
  const user     = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  // Unread notification count for badge
  const { data: notifData } = useNotifications();
  const unreadCount = notifData?.unread_count ?? 0;

  // Active route detection
  const location = useLocation();
  const pathname = location.pathname;

  // User initials for avatar
  const initials = user?.full_name
    ?.split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 flex w-64 flex-col
        bg-white border-r border-slate-100 shadow-sm
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <LogoMark size={34} />
          <div className="leading-none">
            <p className="text-[16px] font-bold text-slate-900">
              Safe<span className="text-blue-600">Pay</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Pakistan
            </p>
          </div>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ icon: Icon, label, to }) => {
            const active = pathname === to || pathname.startsWith(to + "/");

            return (
              <Link
                key={label}
                to={to}
                onClick={onClose} // close on mobile when nav item clicked
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5
                  text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <Icon className={`
                  h-4 w-4 shrink-0
                  ${active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-600"
                  }
                `} />

                {label}

                {/* Notification badge */}
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>

            {/* User info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.full_name ?? "Loading…"}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {user?.phone ?? ""}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              title="Log out"
              className="text-slate-400 hover:text-rose-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}