import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft, ArrowUpRight,   ChevronLeft, ChevronRight, Download, LayoutDashboard, Search, Shield,
  Send, Wallet, CreditCard, Settings,
  CheckCircle2, XCircle, Clock, Eye,
  SlidersHorizontal, X, TrendingUp, TrendingDown,
  Bell,
  User,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── fake data ── */
const TRANSACTIONS = [
  { id: "TXN-A1B2C3D4", name: "Sara Ali",      phone: "0321 9876543", type: "CREDIT",  amount: 15000, status: "APPROVED", risk_score: 5,  time: "Today, 1:12 PM",     note: "Salary",        avatar: "from-emerald-500 to-teal-600"   },
  { id: "TXN-B2C3D4E5", name: "Ahmed Khan",    phone: "0300 1234567", type: "DEBIT",   amount: 2000,  status: "APPROVED", risk_score: 12, time: "Today, 2:45 PM",     note: "Rent",          avatar: "from-blue-500 to-indigo-600"    },
  { id: "TXN-C3D4E5F6", name: "Bilal Shah",    phone: "0333 5554444", type: "DEBIT",   amount: 1200,  status: "BLOCKED",  risk_score: 87, time: "Today, 11:30 AM",    note: "Unknown",       avatar: "from-amber-500 to-orange-600"   },
  { id: "TXN-D4E5F6G7", name: "Fatima Hassan", phone: "0312 1112233", type: "CREDIT",  amount: 10000, status: "APPROVED", risk_score: 8,  time: "Yesterday, 10:05 AM",note: "Freelance",     avatar: "from-rose-500 to-pink-600"      },
  { id: "TXN-E5F6G7H8", name: "Usman Tariq",   phone: "0345 6667788", type: "DEBIT",   amount: 750,   status: "APPROVED", risk_score: 3,  time: "Yesterday, 9:20 AM", note: "Lunch",         avatar: "from-violet-500 to-purple-600"  },
  { id: "TXN-F6G7H8I9", name: "Hina Malik",    phone: "0311 9998887", type: "CREDIT",  amount: 500,   status: "APPROVED", risk_score: 2,  time: "Mon, 4:30 PM",       note: "Returned",      avatar: "from-cyan-500 to-blue-600"      },
  { id: "TXN-G7H8I9J0", name: "Zara Sheikh",   phone: "0322 3334445", type: "DEBIT",   amount: 5000,  status: "APPROVED", risk_score: 22, time: "Mon, 2:00 PM",       note: "Shopping",      avatar: "from-fuchsia-500 to-rose-600"   },
  { id: "TXN-H8I9J0K1", name: "Ali Raza",      phone: "0301 7778889", type: "DEBIT",   amount: 3500,  status: "BLOCKED",  risk_score: 94, time: "Sun, 3:15 AM",       note: "Suspicious",    avatar: "from-slate-500 to-gray-600"     },
  { id: "TXN-I9J0K1L2", name: "Ayesha Khan",   phone: "0315 6665554", type: "CREDIT",  amount: 8000,  status: "APPROVED", risk_score: 6,  time: "Sun, 11:00 AM",      note: "Commission",    avatar: "from-lime-500 to-green-600"     },
  { id: "TXN-J0K1L2M3", name: "Hamza Butt",    phone: "0344 2223334", type: "DEBIT",   amount: 450,   status: "APPROVED", risk_score: 4,  time: "Sat, 7:30 PM",       note: "Tea",           avatar: "from-yellow-500 to-amber-600"   },
];

const STATUS_FILTERS = ["All", "Approved", "Blocked"];
const TYPE_FILTERS   = ["All", "Sent", "Received"];

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dlh)"/>
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1"/>
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8"/>
      <circle cx="23" cy="9" r="5" fill="#10B981"/>
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="dlh" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Risk badge ── */
function RiskBadge({ score }: { score: number }) {
  if (score <= 30) return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
      {score}% Safe
    </span>
  );
  if (score <= 69) return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
      {score}% Medium
    </span>
  );
  return (
    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold text-rose-700">
      {score}% High Risk
    </span>
  );
}

/* ── Detail drawer ── */
function TxnDrawer({ txn, onClose }: { txn: typeof TRANSACTIONS[0] | null; onClose: () => void }) {
  if (!txn) return null;
  const isCredit  = txn.type === "CREDIT";
  const isBlocked = txn.status === "BLOCKED";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* drawer */}
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-bold text-slate-900">Transaction Detail</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">

          {/* status hero */}
          <div className={`mb-5 rounded-2xl p-5 text-center
            ${isBlocked
              ? "bg-rose-50 border border-rose-100"
              : "bg-emerald-50 border border-emerald-100"}`}
          >
            {isBlocked
              ? <XCircle className="mx-auto h-10 w-10 text-rose-500 mb-2" />
              : <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
            }
            <p className={`text-2xl font-black ${isBlocked ? "text-rose-600" : isCredit ? "text-emerald-700" : "text-slate-800"}`}>
              {isCredit ? "+" : "-"}Rs. {txn.amount.toLocaleString()}
            </p>
            <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase
              ${isBlocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
            >
              {txn.status}
            </span>
          </div>

          {/* detail rows */}
          {[
            { label: "Transaction ID", value: txn.id,      mono: true  },
            { label: "Type",           value: txn.type,    mono: false },
            { label: "Note",           value: txn.note,    mono: false },
            { label: "Time",           value: txn.time,    mono: false },
            { label: txn.type === "CREDIT" ? "From" : "To", value: txn.name, mono: false },
            { label: "Phone",          value: txn.phone,   mono: true  },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50">
              <p className="text-[11px] font-medium text-slate-400">{label}</p>
              <p className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
            </div>
          ))}

          {/* risk score */}
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <p className="text-[11px] font-medium text-slate-400">AI Risk Score</p>
            <RiskBadge score={txn.risk_score} />
          </div>

          {/* risk bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] text-slate-400">Risk Level</p>
              <p className="text-[11px] font-bold text-slate-700">{txn.risk_score}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  txn.risk_score <= 30 ? "bg-emerald-500"
                  : txn.risk_score <= 69 ? "bg-amber-500"
                  : "bg-rose-500"
                }`}
                style={{ width: `${txn.risk_score}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-emerald-600 font-medium">Safe</span>
              <span className="text-[9px] text-amber-600 font-medium">Medium</span>
              <span className="text-[9px] text-rose-600 font-medium">High Risk</span>
            </div>
          </div>

          {isBlocked && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-rose-600" />
                <p className="text-xs font-bold text-rose-800">Blocked by AI Fraud Detection</p>
              </div>
              <p className="text-[11px] text-rose-600 leading-relaxed">
                This transaction was automatically blocked because our AI detected suspicious activity patterns.
                No money was deducted from your wallet.
              </p>
            </div>
          )}
        </div>

        {/* drawer footer */}
        <div className="border-t border-slate-100 p-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-xl border-slate-200 text-sm font-semibold"
            onClick={onClose}
          >
            Close
          </Button>
          {!isBlocked && (
            <Button className="flex-1 h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-600/20">
              <Download className="mr-1.5 h-4 w-4" /> Receipt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HISTORY PAGE
══════════════════════════════════════════ */
export function HistoryPage() {
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [typeFilter,    setTypeFilter]    = useState("All");
  const [selectedTxn,   setSelectedTxn]   = useState<typeof TRANSACTIONS[0] | null>(null);
  const [page,          setPage]          = useState(1);
  const [showFilters,   setShowFilters]   = useState(false);
  const PER_PAGE = 7;

  // Filter
  const filtered = TRANSACTIONS.filter(txn => {
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Approved" && txn.status === "APPROVED") ||
      (statusFilter === "Blocked"  && txn.status === "BLOCKED");
    const matchType =
      typeFilter === "All" ||
      (typeFilter === "Sent"     && txn.type === "DEBIT")  ||
      (typeFilter === "Received" && txn.type === "CREDIT");
    const matchSearch =
      txn.name.toLowerCase().includes(search.toLowerCase())  ||
      txn.note.toLowerCase().includes(search.toLowerCase())  ||
      txn.id.toLowerCase().includes(search.toLowerCase())    ||
      txn.phone.includes(search);
    return matchStatus && matchType && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Summary stats
  const totalSent     = TRANSACTIONS.filter(t => t.type === "DEBIT"   && t.status === "APPROVED").reduce((s, t) => s + t.amount, 0);
  const totalReceived = TRANSACTIONS.filter(t => t.type === "CREDIT"  && t.status === "APPROVED").reduce((s, t) => s + t.amount, 0);
  const totalBlocked  = TRANSACTIONS.filter(t => t.status === "BLOCKED").length;

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
          {[
            { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
            { label: "Send Money", to: "/sendMoney", icon: Send },
            { label: "Wallet", to: "/wallet", icon: Wallet,  },
            { label: "History", to: "/history", icon: CreditCard, active: true },
            { label: "Notifications", to: "/notification", icon: Bell },
            { label: "Profile", to: "/profile", icon: User },
            { label: "Settings", to: "/settings", icon: Settings },
          ].map(({ label, to, icon: Icon, active }) => (
            <Link key={label} to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                ${active
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">WA</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Waseem Akram</p>
              <p className="truncate text-[11px] text-slate-500">+92 343 1077698</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">Transaction History</h1>
            <p className="text-[11px] text-slate-400">{filtered.length} transactions found</p>
          </div>
          <button className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">

          {/* ── summary stats ── */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
            {[
              { label: "Total Transactions", value: TRANSACTIONS.length,              color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100",    icon: CreditCard   },
              { label: "Total Sent",         value: `Rs. ${totalSent.toLocaleString()}`,      color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-100",    icon: TrendingDown },
              { label: "Total Received",     value: `Rs. ${totalReceived.toLocaleString()}`,  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: TrendingUp   },
              { label: "Blocked",            value: `${totalBlocked} txns`,           color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100",   icon: Shield       },
            ].map(({ label, value, color, bg, border, icon: Icon }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-4`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-[11px] font-medium text-slate-500">{label}</p>
                <p className={`text-base font-black ${color} mt-0.5`}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── table card ── */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">

            {/* search + filters */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex gap-2">
                {/* search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, note, ID or phone…"
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* filter toggle */}
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-all
                    ${showFilters
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {(statusFilter !== "All" || typeFilter !== "All") && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-blue-600">
                      {[statusFilter !== "All", typeFilter !== "All"].filter(Boolean).length}
                    </span>
                  )}
                </button>
              </div>

              {/* expanded filters */}
              {showFilters && (
                <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Status</p>
                    <div className="flex gap-1.5">
                      {STATUS_FILTERS.map(f => (
                        <button
                          key={f}
                          onClick={() => { setStatusFilter(f); setPage(1); }}
                          className={`h-7 rounded-lg px-3 text-[11px] font-semibold transition-all
                            ${statusFilter === f
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Direction</p>
                    <div className="flex gap-1.5">
                      {TYPE_FILTERS.map(f => (
                        <button
                          key={f}
                          onClick={() => { setTypeFilter(f); setPage(1); }}
                          className={`h-7 rounded-lg px-3 text-[11px] font-semibold transition-all
                            ${typeFilter === f
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(statusFilter !== "All" || typeFilter !== "All") && (
                    <button
                      onClick={() => { setStatusFilter("All"); setTypeFilter("All"); setPage(1); }}
                      className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700 transition-colors self-end"
                    >
                      <X className="h-3 w-3" /> Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-2.5">
              {["Contact", "Amount", "Type", "Risk Score", "Time", ""].map(h => (
                <p key={h} className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{h}</p>
              ))}
            </div>

            {/* rows */}
            <ul className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <CreditCard className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No transactions found</p>
                  <p className="text-[11px] mt-1">Try adjusting your filters</p>
                </li>
              ) : paginated.map(txn => {
                const isCredit  = txn.type === "CREDIT";
                const isBlocked = txn.status === "BLOCKED";

                return (
                  <li
                    key={txn.id}
                    className="group grid grid-cols-1 gap-2 px-5 py-3.5 transition-colors hover:bg-slate-50 cursor-pointer md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
                    onClick={() => setSelectedTxn(txn)}
                  >
                    {/* contact */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${txn.avatar} text-[10px] font-bold text-white shadow-sm`}>
                        {txn.name.split(" ").map(s => s[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-800 truncate">{txn.name}</p>
                          {isBlocked && (
                            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[8px] font-bold uppercase text-rose-600">Blocked</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">{txn.id}</p>
                      </div>
                    </div>

                    {/* amount */}
                    <div>
                      <p className={`text-sm font-bold
                        ${isBlocked  ? "text-rose-500 line-through"
                          : isCredit ? "text-emerald-600"
                          : "text-slate-800"}`}
                      >
                        {isCredit ? "+" : "-"}Rs. {txn.amount.toLocaleString()}
                      </p>
                      {txn.note && (
                        <p className="text-[10px] text-slate-400 truncate">{txn.note}</p>
                      )}
                    </div>

                    {/* type */}
                    <div className="flex items-center gap-1.5">
                      {isCredit
                        ? <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-500" />
                        : <ArrowUpRight  className={`h-3.5 w-3.5 ${isBlocked ? "text-rose-400" : "text-slate-400"}`} />
                      }
                      <span className="text-[11px] font-semibold text-slate-600">
                        {isCredit ? "Received" : isBlocked ? "Blocked" : "Sent"}
                      </span>
                    </div>

                    {/* risk */}
                    <div>
                      <RiskBadge score={txn.risk_score} />
                    </div>

                    {/* time */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3 shrink-0" />
                      {txn.time}
                    </div>

                    {/* action */}
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:border-blue-300 hover:text-blue-600"
                      onClick={e => { e.stopPropagation(); setSelectedTxn(txn); }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-[11px] text-slate-400">
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all
                      ${page === p
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── detail drawer ── */}
      {selectedTxn && (
        <TxnDrawer txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}
    </div>
  );
}