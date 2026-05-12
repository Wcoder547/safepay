import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell, BellOff, Check, CheckCheck,
  CreditCard, Filter,
  LayoutDashboard, Send, Settings,
  Wallet, X, AlertTriangle,
  CheckCircle2, XCircle, Info, Trash2,
  ArrowUpRight, Clock,
  User, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import api from "@/api/axios";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type NotifType = "SUCCESS" | "WARNING" | "FRAUD_ALERT" | "INFO";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  is_read: boolean;
  created_at: string;
  transaction_id: string | null;
}

interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const FILTER_TABS = ["All", "Unread", "Success", "Alerts", "Info"] as const;
type FilterTab = typeof FILTER_TABS[number];

const NAV = [
  { label: "Dashboard",     to: "/dashboard",    icon: LayoutDashboard },
  { label: "Send Money",    to: "/sendMoney",    icon: Send            },
  { label: "Wallet",        to: "/wallet",       icon: Wallet          },
  { label: "History",       to: "/history",      icon: CreditCard      },
  { label: "Notifications", to: "/notification", icon: Bell            },
  { label: "Profile",       to: "/profile",      icon: User            },
  { label: "Settings",      to: "/settings",     icon: Settings        },
];

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function formatTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso; // fallback: return raw string if not a valid ISO
  const diffMs  = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)   return "Just now";
  if (diffMin < 60)  return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr  < 24)  return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7)   return `${diffDay} days ago`;
  return date.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

function getCurrentUser(): { name: string; phone: string; initials: string } {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      const name = u?.full_name ?? u?.name ?? "User";
      return {
        name,
        phone: u?.phone ?? "",
        initials: name.split(" ").map((s: string) => s[0]).join("").toUpperCase().slice(0, 2),
      };
    }
    const token = localStorage.getItem("accessToken") ?? localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const name = payload?.full_name ?? payload?.name ?? "User";
      return { name, phone: payload?.phone ?? "", initials: name.slice(0, 2).toUpperCase() };
    }
  } catch { /* ignore */ }
  return { name: "User", phone: "", initials: "U" };
}

/* ─────────────────────────────────────────────────────────────
   LOGO
───────────────────────────────────────────────────────────── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dln)" />
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2" />
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8" />
      <circle cx="23" cy="9" r="5" fill="#10B981" />
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="dln" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" /><stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
function NotifIcon({ type }: { type: NotifType }) {
  const configs = {
    SUCCESS:     { icon: CheckCircle2,  bg: "bg-emerald-100", color: "text-emerald-600" },
    FRAUD_ALERT: { icon: XCircle,       bg: "bg-rose-100",    color: "text-rose-600"    },
    WARNING:     { icon: AlertTriangle, bg: "bg-amber-100",   color: "text-amber-600"   },
    INFO:        { icon: Info,          bg: "bg-blue-100",    color: "text-blue-600"    },
  };
  const { icon: Icon, bg, color } = configs[type];
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
  );
}

function typeBorderColor(type: NotifType) {
  return {
    SUCCESS:     "border-l-emerald-400",
    FRAUD_ALERT: "border-l-rose-400",
    WARNING:     "border-l-amber-400",
    INFO:        "border-l-blue-400",
  }[type];
}

/* ══════════════════════════════════════════
   NOTIFICATIONS PAGE
══════════════════════════════════════════ */
export function NotificationsPage() {
  const currentUser = getCurrentUser();

  /* ── data state ── */
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  /* ── ui state ── */
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [selected,     setSelected]     = useState<string[]>([]);
  const [selectMode,   setSelectMode]   = useState(false);

  /* ─────────────────────────────────────
     FETCH NOTIFICATIONS
  ───────────────────────────────────── */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get("/notifications");
      // expected: res.data.data = { notifications: [...], unread_count: number }
      const data: NotificationsResponse = res.data?.data ?? res.data ?? {};
      setNotifs(data.notifications ?? []);
      setUnreadCount(data.unread_count ?? 0);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* ─────────────────────────────────────
     ACTIONS (optimistic + API)
  ───────────────────────────────────── */

  /** Mark a single notification as read */
  const markRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.post(`/notifications/${id}/read`);
    } catch {
      // Rollback on failure
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: false } : n));
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  /** Mark all notifications as read */
  const markAllRead = useCallback(async () => {
    // Optimistic update
    const prevNotifs = notifs;
    const prevUnread = unreadCount;
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await api.post("/notifications/read-all");
    } catch {
      // Rollback on failure
      setNotifs(prevNotifs);
      setUnreadCount(prevUnread);
    }
  }, [notifs, unreadCount]);

  /** Delete a single notification */
  const deleteOne = useCallback(async (id: string) => {
    const removed = notifs.find(n => n.id === id);
    // Optimistic update
    setNotifs(prev => prev.filter(n => n.id !== id));
    if (removed && !removed.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      // Rollback on failure
      if (removed) {
        setNotifs(prev => [...prev, removed].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
        if (!removed.is_read) setUnreadCount(prev => prev + 1);
      }
    }
  }, [notifs]);

  /** Delete all selected notifications */
  const deleteSelected = useCallback(async () => {
    const removedItems = notifs.filter(n => selected.includes(n.id));
    const removedUnread = removedItems.filter(n => !n.is_read).length;
    // Optimistic update
    setNotifs(prev => prev.filter(n => !selected.includes(n.id)));
    setUnreadCount(prev => Math.max(0, prev - removedUnread));
    setSelected([]);
    setSelectMode(false);
    try {
      // Adjust endpoint to match your backend — common options:
      // Option A: DELETE /notifications  with body { ids }
      await api.delete("/notifications", { data: { ids: selected } });
      // Option B: fire individual deletes in parallel
      // await Promise.all(selected.map(id => api.delete(`/notifications/${id}`)));
    } catch {
      // Rollback on failure — re-fetch is simpler than re-inserting in order
      fetchNotifications();
    }
  }, [notifs, selected, fetchNotifications]);

  /* ── toggle select ── */
  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  /* ─────────────────────────────────────
     FILTER (client-side on current page)
  ───────────────────────────────────── */
  const filtered = notifs.filter(n => {
    if (activeFilter === "Unread")  return !n.is_read;
    if (activeFilter === "Success") return n.type === "SUCCESS";
    if (activeFilter === "Alerts")  return n.type === "FRAUD_ALERT" || n.type === "WARNING";
    if (activeFilter === "Info")    return n.type === "INFO";
    return true;
  });

  const tabCount = (tab: FilterTab): number => {
    if (tab === "All")     return notifs.length;
    if (tab === "Unread")  return notifs.filter(n => !n.is_read).length;
    if (tab === "Success") return notifs.filter(n => n.type === "SUCCESS").length;
    if (tab === "Alerts")  return notifs.filter(n => n.type === "FRAUD_ALERT" || n.type === "WARNING").length;
    if (tab === "Info")    return notifs.filter(n => n.type === "INFO").length;
    return 0;
  };

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* ── sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-100 shadow-sm">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <LogoMark size={34} />
          <div className="leading-none">
            <p className="text-[16px] font-bold text-slate-900">Safe<span className="text-blue-600">Pay</span></p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Pakistan</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ label, to, icon: Icon }) => {
            const active = label === "Notifications";
            return (
              <Link key={label} to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              {currentUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
              <p className="truncate text-[11px] text-slate-500">{currentUser.phone}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">Notifications</h1>
            <p className="text-[11px] text-slate-400">
              {loading ? "Loading…" : unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh button */}
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {selectMode ? (
              <>
                {selected.length > 0 && (
                  <button
                    onClick={deleteSelected}
                    className="flex h-9 items-center gap-2 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete ({selected.length})
                  </button>
                )}
                <button
                  onClick={() => { setSelectMode(false); setSelected([]); }}
                  className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setSelectMode(true)}
                  className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Filter className="h-3.5 w-3.5" /> Select
                </button>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">

          {/* ── loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
              <p className="text-sm font-medium text-slate-500">Loading notifications…</p>
            </div>
          )}

          {/* ── error ── */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <AlertCircle className="h-8 w-8 text-rose-400" />
              <p className="text-sm font-medium text-slate-600">{error}</p>
              <button
                onClick={fetchNotifications}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}

          {/* ── content ── */}
          {!loading && !error && (
            <>
              {/* unread banner */}
              {unreadCount > 0 && (
                <div className="mb-5 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-blue-800">
                      You have <span className="font-black">{unreadCount}</span> unread notification{unreadCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" /> Mark all read
                  </button>
                </div>
              )}

              {/* filter tabs */}
              <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
                {FILTER_TABS.map(tab => {
                  const count    = tabCount(tab);
                  const isActive = activeFilter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[11px] font-semibold transition-all
                        ${isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                      {tab}
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold
                        ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* notification list */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 text-slate-400 shadow-sm">
                  <BellOff className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No notifications</p>
                  <p className="text-[11px] mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (selectMode) { toggleSelect(notif.id); return; }
                        if (!notif.is_read) markRead(notif.id);
                      }}
                      className={`group relative flex items-start gap-4 rounded-2xl border-l-4 bg-white px-5 py-4 shadow-sm transition-all cursor-pointer
                        ${typeBorderColor(notif.type)}
                        ${!notif.is_read ? "border border-slate-200 shadow-md" : "border border-slate-100"}
                        ${selectMode ? "hover:bg-slate-50" : "hover:shadow-md"}
                        ${selected.includes(notif.id) ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                      `}
                    >
                      {/* select checkbox */}
                      {selectMode && (
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all
                          ${selected.includes(notif.id)
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected.includes(notif.id) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      )}

                      {/* icon */}
                      <NotifIcon type={notif.type} />

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!notif.is_read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                            {notif.title}
                          </p>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(notif.created_at)}
                            </span>
                            {!notif.is_read && (
                              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                            )}
                          </div>
                        </div>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">
                          {notif.message}
                        </p>
                        {notif.transaction_id && (
                          <Link
                            to="/history"
                            onClick={e => e.stopPropagation()}
                            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                          >
                            View transaction <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>

                      {/* hover actions */}
                      {!selectMode && (
                        <div className="absolute right-3 top-3 hidden items-center gap-1 group-hover:flex">
                          {!notif.is_read && (
                            <button
                              onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                              title="Mark as read"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); deleteOne(notif.id); }}
                            title="Delete"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:text-rose-600 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}