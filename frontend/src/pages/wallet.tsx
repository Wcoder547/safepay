import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Clock,
  CheckCircle2,
  Bell,
  User,
  Settings,
  LayoutDashboard,
//   Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── fake data ── */
const WALLET = {
  balance: 45200,
  currency: "PKR",
  total_sent: 8950,
  total_received: 15500,
  total_blocked: 1200,
  last_updated: "Just now",
};

const LOGS = [
  {
    id: 1,
    type: "CREDIT",
    amount: 15000,
    balance_after: 45200,
    from: "Sara Ali",
    note: "Salary",
    time: "Today, 1:12 PM",
    txn_id: "TXN-A1B2C3D4",
  },
  {
    id: 2,
    type: "DEBIT",
    amount: 2000,
    balance_after: 30200,
    from: "Ahmed Khan",
    note: "Rent",
    time: "Today, 2:45 PM",
    txn_id: "TXN-B2C3D4E5",
  },
  {
    id: 3,
    type: "TOPUP",
    amount: 10000,
    balance_after: 32200,
    from: "Top Up",
    note: "Wallet top up",
    time: "Yesterday, 9:00 AM",
    txn_id: "TXN-C3D4E5F6",
  },
  {
    id: 4,
    type: "DEBIT",
    amount: 750,
    balance_after: 22200,
    from: "Usman Tariq",
    note: "Lunch",
    time: "Yesterday, 1:20 PM",
    txn_id: "TXN-D4E5F6G7",
  },
  {
    id: 5,
    type: "CREDIT",
    amount: 500,
    balance_after: 22950,
    from: "Fatima H",
    note: "Returned",
    time: "Mon, 10:05 AM",
    txn_id: "TXN-E5F6G7H8",
  },
  {
    id: 6,
    type: "DEBIT",
    amount: 1200,
    balance_after: 21750,
    from: "Bilal Shah",
    note: "Groceries",
    time: "Mon, 11:30 AM",
    txn_id: "TXN-F6G7H8I9",
  },
  {
    id: 7,
    type: "TOPUP",
    amount: 20000,
    balance_after: 41750,
    from: "Top Up",
    note: "Wallet top up",
    time: "Sun, 3:00 PM",
    txn_id: "TXN-G7H8I9J0",
  },
];

const STATS = [
  {
    label: "Total Sent",
    value: "Rs. 8,950",
    icon: TrendingDown,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    label: "Total Received",
    value: "Rs. 15,500",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Transactions",
    value: "24",
    icon: CreditCard,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Blocked",
    value: "1",
    icon: Shield,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

const FILTERS = ["All", "Credit", "Debit", "Top Up"];

/* ── helpers ── */
function LogIcon({ type }: { type: string }) {
  if (type === "CREDIT")
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
      </div>
    );
  if (type === "TOPUP")
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
        <Plus className="h-4 w-4 text-blue-600" />
      </div>
    );
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
      <ArrowUpRight className="h-4 w-4 text-slate-500" />
    </div>
  );
}

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dl2)" />
      <rect
        x="5"
        y="10"
        width="22"
        height="15"
        rx="3"
        fill="white"
        fillOpacity="0.2"
      />
      <rect
        x="5"
        y="10"
        width="22"
        height="15"
        rx="3"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <rect
        x="8"
        y="14"
        width="5"
        height="4"
        rx="1"
        fill="white"
        fillOpacity="0.8"
      />
      <circle cx="23" cy="9" r="5" fill="#10B981" />
      <path
        d="M20.5 9l2 2 3-3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="dl2"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const filtered = LOGS.filter((log) => {
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Credit" && log.type === "CREDIT") ||
      (activeFilter === "Debit" && log.type === "DEBIT") ||
      (activeFilter === "Top Up" && log.type === "TOPUP");
    const matchSearch =
      log.from.toLowerCase().includes(search.toLowerCase()) ||
      log.note.toLowerCase().includes(search.toLowerCase()) ||
      log.txn_id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* ── sidebar (same as Dashboard) ── */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-100 shadow-sm">
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
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
            { label: "Send Money", to: "/sendMoney", icon: Send },
            { label: "Wallet", to: "/wallet", icon: Wallet, active: true },
            { label: "History", to: "/history", icon: CreditCard },
            { label: "Notifications", to: "/notification", icon: Bell },
            { label: "Profile", to: "/profile", icon: User },
            { label: "Settings", to: "/settings", icon: Settings },
          ].map(({ label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                ${
                  active
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Wallet className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              WA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Waseem Akram
              </p>
              <p className="truncate text-[11px] text-slate-500">
                +92 343 1077698
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">My Wallet</h1>
            <p className="text-[11px] text-slate-400">
              Audit trail & balance overview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button
              onClick={() => setShowTopUp(true)}
              className="flex h-9 items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" /> Top Up
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          {/* ── balance hero ── */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl shadow-blue-900/30 mb-5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 right-16 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-200">
                    Wallet Balance
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-4xl font-black tracking-tight">
                      {balanceVisible
                        ? `Rs. ${WALLET.balance.toLocaleString()}`
                        : "Rs. ••••••"}
                    </p>
                    <button
                      onClick={() => setBalanceVisible((v) => !v)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-blue-200 transition hover:bg-white/20"
                    >
                      {balanceVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-blue-200">
                      Updated {WALLET.last_updated}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-200 hover:bg-white/20 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* mini stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Sent",
                    value: `Rs. ${WALLET.total_sent.toLocaleString()}`,
                    color: "text-rose-300",
                  },
                  {
                    label: "Received",
                    value: `Rs. ${WALLET.total_received.toLocaleString()}`,
                    color: "text-emerald-300",
                  },
                  {
                    label: "Blocked",
                    value: `Rs. ${WALLET.total_blocked.toLocaleString()}`,
                    color: "text-amber-300",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur"
                  >
                    <p className="text-[10px] text-blue-200">{label}</p>
                    <p className={`mt-0.5 text-sm font-bold ${color}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* actions */}
              <div className="mt-5 flex gap-2">
                <Link to="/send">
                  <Button className="h-9 rounded-xl bg-white text-blue-700 text-xs font-bold shadow hover:bg-blue-50">
                    <Send className="mr-1.5 h-3.5 w-3.5" /> Send Money
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowTopUp(true)}
                  variant="outline"
                  className="h-9 rounded-xl border-white/20 bg-white/10 text-white text-xs font-bold hover:bg-white/20"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Top Up
                </Button>
              </div>
            </div>
          </div>

          {/* ── stats row ── */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
            {STATS.map(({ label, value, icon: Icon, color, bg, border }) => (
              <div
                key={label}
                className={`rounded-2xl border ${border} ${bg} p-4`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm mb-2`}
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                  {label}
                </p>
                <p className={`text-base font-black ${color} mt-0.5`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── wallet logs ── */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Wallet Audit Log
                </p>
                <p className="text-[11px] text-slate-400">
                  {filtered.length} entries
                </p>
              </div>
              <Link
                to="/history"
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                Full history <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* search + filter */}
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, note or ID…"
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`h-7 rounded-lg px-3 text-[11px] font-semibold transition-all
                      ${
                        activeFilter === f
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* log list */}
            <ul className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Wallet className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No entries found</p>
                </li>
              ) : (
                filtered.map((log) => (
                  <li
                    key={log.id}
                    className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <LogIcon type={log.type} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {log.from}
                        </p>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase
                        ${
                          log.type === "CREDIT"
                            ? "bg-emerald-100 text-emerald-700"
                            : log.type === "TOPUP"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                        >
                          {log.type === "TOPUP" ? "Top Up" : log.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-400">{log.note}</p>
                        <span className="text-slate-300">·</span>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {log.txn_id}
                        </p>
                      </div>
                    </div>

                    {/* center — balance trail */}
                    <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {log.time}
                    </div>

                    {/* right — amount + balance after */}
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold
                      ${
                        log.type === "CREDIT" || log.type === "TOPUP"
                          ? "text-emerald-600"
                          : "text-slate-800"
                      }`}
                      >
                        {log.type === "CREDIT" || log.type === "TOPUP"
                          ? "+"
                          : "-"}
                        Rs. {log.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Balance: Rs. {log.balance_after.toLocaleString()}
                      </p>
                    </div>

                    {/* status icon */}
                    {log.type === "CREDIT" || log.type === "TOPUP" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-300" />
                    )}
                  </li>
                ))
              )}
            </ul>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-[11px] text-slate-400">
                Showing {filtered.length} of {LOGS.length} entries
              </p>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-500" />
                <p className="text-[11px] font-medium text-emerald-600">
                  Append-only audit trail
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ════════════════════════════════════════
          TOP UP MODAL
      ════════════════════════════════════════ */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            {/* modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Top Up Wallet
                </p>
                <p className="text-[11px] text-slate-400">
                  Add funds to your SafePay wallet
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTopUp(false);
                  setTopUpAmount("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* modal body */}
            <div className="p-5">
              {/* current balance */}
              <div className="mb-4 rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-[11px] text-slate-400 mb-1">
                  Current Balance
                </p>
                <p className="text-2xl font-black text-slate-900">Rs. 45,200</p>
              </div>

              {/* quick amounts */}
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Quick Amount
              </p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1000, 2000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(String(amt))}
                    className={`rounded-xl border py-2 text-xs font-bold transition-all
                      ${
                        topUpAmount === String(amt)
                          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
                      }`}
                  >
                    {amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>

              {/* custom amount */}
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Or enter amount
              </p>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  Rs.
                </span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0"
                  min="100"
                  max="100000"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* limit note */}
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                <Shield className="h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-[11px] text-blue-700 font-medium">
                  Max top-up: Rs. 100,000 per transaction
                </p>
              </div>

              {/* new balance preview */}
              {topUpAmount && Number(topUpAmount) > 0 && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                  <p className="text-[11px] text-emerald-600 mb-0.5">
                    New Balance After Top Up
                  </p>
                  <p className="text-xl font-black text-emerald-700">
                    Rs. {(45200 + Number(topUpAmount)).toLocaleString()}
                  </p>
                </div>
              )}

              {/* actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTopUp(false);
                    setTopUpAmount("");
                  }}
                  className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 text-sm font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!topUpAmount || Number(topUpAmount) < 100}
                  className="flex-1 h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-600/20 disabled:opacity-40"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Rs.{" "}
                  {topUpAmount ? Number(topUpAmount).toLocaleString() : "0"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
