import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell, BellOff, Check, CheckCheck,
  Filter, Trash2, X, AlertTriangle,
  CheckCircle2, XCircle, Info, ArrowUpRight,
  Clock, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import api from "@/api/axios";
import { AppLayout } from "@/components/AppLayout";

/* ── Types ── */
type NotifType = "SUCCESS" | "WARNING" | "FRAUD_ALERT" | "INFO";
type FilterTab = "All" | "Unread" | "Success" | "Alerts" | "Info";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  is_read: boolean;
  created_at: string;
  transaction_id: string | null;
}

/* ── Constants ── */
const FILTER_TABS: FilterTab[] = ["All", "Unread", "Success", "Alerts", "Info"];

/* ── Helpers ── */
function formatTime(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
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

/* ── Notif Icon ── */
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

function typeBorderColor(type: NotifType): string {
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
  /* ── Data state ── */
  const [notifs,      setNotifs]      = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  /* ── UI state ── */
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [selected,     setSelected]     = useState<string[]>([]);
  const [selectMode,   setSelectMode]   = useState(false);

  /* ── Fetch ── */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get("/notifications");
      const data = res.data?.data ?? {};
      setNotifs(data.notifications ?? []);
      setUnreadCount(data.unread_count ?? 0);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  /* ── Mark one read ── */
  const markRead = useCallback(async (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.post(`/notifications/${id}/read`);
    } catch {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: false } : n));
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  /* ── Mark all read ── */
  const markAllRead = useCallback(async () => {
    const prevNotifs = notifs;
    const prevUnread = unreadCount;
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await api.post("/notifications/read-all");
    } catch {
      setNotifs(prevNotifs);
      setUnreadCount(prevUnread);
    }
  }, [notifs, unreadCount]);

  /* ── Delete one ── */
  const deleteOne = useCallback(async (id: string) => {
    const removed = notifs.find(n => n.id === id);
    setNotifs(prev => prev.filter(n => n.id !== id));
    if (removed && !removed.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      // Silently ignore — backend delete endpoint may not exist yet
    }
  }, [notifs]);

  /* ── Delete selected ── */
  const deleteSelected = useCallback(async () => {
    const removedItems  = notifs.filter(n => selected.includes(n.id));
    const removedUnread = removedItems.filter(n => !n.is_read).length;
    setNotifs(prev => prev.filter(n => !selected.includes(n.id)));
    setUnreadCount(prev => Math.max(0, prev - removedUnread));
    setSelected([]);
    setSelectMode(false);
    try {
      await Promise.all(selected.map(id => api.delete(`/notifications/${id}`)));
    } catch {
      // Silently ignore — local state already updated
    }
  }, [notifs, selected]);

  /* ── Toggle select ── */
  const toggleSelect = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  /* ── Filter ── */
  const filtered = notifs.filter(n => {
    if (activeFilter === "Unread")  return !n.is_read;
    if (activeFilter === "Success") return n.type === "SUCCESS";
    if (activeFilter === "Alerts")  return n.type === "FRAUD_ALERT" || n.type === "WARNING";
    if (activeFilter === "Info")    return n.type === "INFO";
    return true;
  });

  const tabCount = (tab: FilterTab): number => {
    if (tab === "Unread")  return notifs.filter(n => !n.is_read).length;
    if (tab === "Success") return notifs.filter(n => n.type === "SUCCESS").length;
    if (tab === "Alerts")  return notifs.filter(n => n.type === "FRAUD_ALERT" || n.type === "WARNING").length;
    if (tab === "Info")    return notifs.filter(n => n.type === "INFO").length;
    return notifs.length;
  };

  /* ── Header right actions ── */
  const headerRight = (
    <div className="flex items-center gap-2">
      {/* Refresh */}
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
  );

  /* ── Render ── */
  return (
    <AppLayout
      title="Notifications"
      subtitle={
        loading
          ? "Loading…"
          : unreadCount > 0
            ? `${unreadCount} unread`
            : "All caught up!"
      }
      headerRight={headerRight}
    >
      <div className="p-5 md:p-7">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading notifications…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="h-8 w-8 text-rose-400" />
            <p className="text-sm font-medium text-slate-600">{error}</p>
            <button
              onClick={fetchNotifications}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Unread banner */}
            {unreadCount > 0 && (
              <div className="mb-5 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-blue-800">
                    You have <span className="font-black">{unreadCount}</span>{" "}
                    unread notification{unreadCount > 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              </div>
            )}

            {/* Filter tabs */}
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

            {/* Notification list */}
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
                    {/* Select checkbox */}
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

                    {/* Icon */}
                    <NotifIcon type={notif.type} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug
                          ${!notif.is_read
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"}`}
                        >
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

                    {/* Hover actions */}
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
      </div>
    </AppLayout>
  );
}