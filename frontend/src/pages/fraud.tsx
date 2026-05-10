import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle, ArrowUpRight, CheckCircle2,
  ChevronLeft, ChevronRight, Clock, CreditCard,
  Eye, LayoutDashboard, Search,
  Send, Settings, Shield, SlidersHorizontal,
    Wallet, X, XCircle,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── fake data ── */
const FRAUD_REPORTS = [
  {
    id: "FRD-001", txn_id: "TXN-C3D4E5F6",
    user: "Bilal Shah",     phone: "0333 5554444",
    amount: 1200,           risk_score: 87,
    status: "PENDING",
    signals: ["Transaction at unusual hour", "First-time receiver"],
    ml_version: "v1.0.0",  time: "Today, 11:30 AM",
    avatar: "from-amber-500 to-orange-600",
    reviewed_by: null,      admin_note: null,
  },
  {
    id: "FRD-002", txn_id: "TXN-H8I9J0K1",
    user: "Ali Raza",       phone: "0301 7778889",
    amount: 3500,           risk_score: 94,
    status: "CONFIRMED_FRAUD",
    signals: ["Large amount at unusual hour", "New sender", "First-time receiver", "Multiple signals"],
    ml_version: "v1.0.0",  time: "Sun, 3:15 AM",
    avatar: "from-slate-500 to-gray-600",
    reviewed_by: "Admin",   admin_note: "Confirmed fraud — account under investigation.",
  },
  {
    id: "FRD-003", txn_id: "TXN-K1L2M3N4",
    user: "Zara Sheikh",    phone: "0322 3334445",
    amount: 8500,           risk_score: 72,
    status: "FALSE_ALARM",
    signals: ["High value transaction", "Unusual hour"],
    ml_version: "v1.0.0",  time: "Sat, 2:00 AM",
    avatar: "from-fuchsia-500 to-rose-600",
    reviewed_by: "Admin",   admin_note: "User confirmed it was a legitimate payment.",
  },
  {
    id: "FRD-004", txn_id: "TXN-L2M3N4O5",
    user: "Kamran Butt",    phone: "0344 1112223",
    amount: 25000,          risk_score: 96,
    status: "PENDING",
    signals: ["Unusually large amount", "Transaction at unusual hour", "High transaction velocity", "Multiple signals"],
    ml_version: "v1.0.0",  time: "Sat, 4:22 AM",
    avatar: "from-red-500 to-rose-600",
    reviewed_by: null,      admin_note: null,
  },
  {
    id: "FRD-005", txn_id: "TXN-M3N4O5P6",
    user: "Saad Iqbal",     phone: "0311 5556667",
    amount: 5000,           risk_score: 78,
    status: "CONFIRMED_FRAUD",
    signals: ["First-time receiver", "Unusual hour"],
    ml_version: "v1.0.0",  time: "Fri, 1:05 AM",
    avatar: "from-blue-500 to-indigo-600",
    reviewed_by: "Admin",   admin_note: "Phishing attempt confirmed.",
  },
];

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "False Alarm"];

/* ── helpers ── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dlf)"/>
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1"/>
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8"/>
      <circle cx="23" cy="9" r="5" fill="#10B981"/>
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="dlf" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "PENDING") return (
    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
      <Clock className="h-3 w-3" /> Pending Review
    </span>
  );
  if (status === "CONFIRMED_FRAUD") return (
    <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-700">
      <XCircle className="h-3 w-3" /> Confirmed Fraud
    </span>
  );
  return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> False Alarm
    </span>
  );
}

function RiskBar({ score }: { score: number }) {
  const color = score <= 30 ? "bg-emerald-500"
    : score <= 69 ? "bg-amber-500"
    : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[11px] font-bold
        ${score <= 30 ? "text-emerald-600" : score <= 69 ? "text-amber-600" : "text-rose-600"}`}
      >
        {score}%
      </span>
    </div>
  );
}

/* ── Detail + Action Drawer ── */
function FraudDrawer({
  report,
  onClose,
  onAction,
}: {
  report: typeof FRAUD_REPORTS[0] | null;
  onClose: () => void;
  onAction: (id: string, action: "override" | "confirm", note: string) => void;
}) {
  const [note, setNote] = useState("");
  if (!report) return null;

  const isPending = report.status === "PENDING";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Fraud Report</p>
            <p className="text-[11px] font-mono text-slate-400">{report.id}</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">

          {/* user + amount hero */}
          <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${report.avatar} text-sm font-bold text-white shadow-sm`}>
                {report.user.split(" ").map(s => s[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{report.user}</p>
                <p className="text-[11px] font-mono text-slate-500">{report.phone}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-rose-400 mb-0.5">Blocked Amount</p>
                <p className="text-2xl font-black text-rose-700">
                  Rs. {report.amount.toLocaleString()}
                </p>
              </div>
              <StatusBadge status={report.status} />
            </div>
          </div>

          {/* risk score */}
          <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-700">AI Risk Score</p>
              <span className={`text-lg font-black
                ${report.risk_score >= 70 ? "text-rose-600"
                  : report.risk_score >= 30 ? "text-amber-600"
                  : "text-emerald-600"}`}
              >
                {report.risk_score}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  report.risk_score >= 70 ? "bg-linear-to-r from-rose-500 to-red-600"
                  : report.risk_score >= 30 ? "bg-amber-500"
                  : "bg-emerald-500"
                }`}
                style={{ width: `${report.risk_score}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-emerald-600 font-semibold">0 — Safe</span>
              <span className="text-[9px] text-rose-600 font-semibold">100 — Critical</span>
            </div>
          </div>

          {/* fraud signals */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Fraud Signals Detected
            </p>
            <div className="space-y-1.5">
              {report.signals.map((signal, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2">
                  <AlertTriangle className="h-3 w-3 shrink-0 text-rose-500" />
                  <p className="text-[11px] font-medium text-rose-700">{signal}</p>
                </div>
              ))}
            </div>
          </div>

          {/* details */}
          {[
            { label: "Transaction ID", value: report.txn_id,    mono: true  },
            { label: "Time",           value: report.time,      mono: false },
            { label: "ML Model",       value: report.ml_version,mono: true  },
            { label: "Reviewed By",    value: report.reviewed_by || "—", mono: false },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-50">
              <p className="text-[11px] font-medium text-slate-400">{label}</p>
              <p className={`text-sm font-semibold text-slate-800 ${mono ? "font-mono text-xs" : ""}`}>
                {value}
              </p>
            </div>
          ))}

          {/* admin note if exists */}
          {report.admin_note && (
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Admin Note</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">{report.admin_note}</p>
            </div>
          )}

          {/* admin actions — only for pending */}
          {isPending && (
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Admin Note</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a review note (optional)…"
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          )}
        </div>

        {/* footer actions */}
        <div className="border-t border-slate-100 p-4">
          {isPending ? (
            <div className="space-y-2">
              <Button
                onClick={() => { onAction(report.id, "confirm", note); onClose(); }}
                className="w-full h-10 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                <XCircle className="mr-1.5 h-4 w-4" /> Confirm Fraud
              </Button>
              <Button
                onClick={() => { onAction(report.id, "override", note); onClose(); }}
                variant="outline"
                className="w-full h-10 rounded-xl border-emerald-300 text-emerald-700 text-sm font-bold hover:bg-emerald-50"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Mark False Alarm
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-9 rounded-xl border-slate-200 text-slate-500 text-sm"
              >
                Close
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-10 rounded-xl border-slate-200 text-slate-600 text-sm font-semibold"
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   FRAUD LOG PAGE
══════════════════════════════════════════ */
export function FraudLogPage() {
  const [reports,       setReports]       = useState(FRAUD_REPORTS);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [selectedReport,setSelectedReport]= useState<typeof FRAUD_REPORTS[0] | null>(null);
  const [page,          setPage]          = useState(1);
  const [showFilters,   setShowFilters]   = useState(false);
  const PER_PAGE = 5;

  // Handle admin action
  const handleAction = (
    id: string,
    action: "override" | "confirm",
    note: string
  ) => {
    setReports(prev => prev.map(r =>
      r.id === id ? {
        ...r,
        status: action === "confirm" ? "CONFIRMED_FRAUD" : "FALSE_ALARM",
        reviewed_by: "Admin",
        admin_note: note || (action === "confirm"
          ? "Confirmed as fraudulent transaction."
          : "Cleared as false alarm."),
      } : r
    ));
  };

  // Stats
  const pending   = reports.filter(r => r.status === "PENDING").length;
  const confirmed = reports.filter(r => r.status === "CONFIRMED_FRAUD").length;
  const cleared   = reports.filter(r => r.status === "FALSE_ALARM").length;
  const avgRisk   = Math.round(reports.reduce((s, r) => s + r.risk_score, 0) / reports.length);

  // Filter
  const filtered = reports.filter(r => {
    const matchStatus =
      statusFilter === "All"          ||
      (statusFilter === "Pending"     && r.status === "PENDING")         ||
      (statusFilter === "Confirmed"   && r.status === "CONFIRMED_FRAUD") ||
      (statusFilter === "False Alarm" && r.status === "FALSE_ALARM");
    const matchSearch =
      r.user.toLowerCase().includes(search.toLowerCase())    ||
      r.id.toLowerCase().includes(search.toLowerCase())      ||
      r.txn_id.toLowerCase().includes(search.toLowerCase())  ||
      r.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            { label: "Dashboard",  to: "/dashboard", icon: LayoutDashboard, active: false },
            { label: "Send Money", to: "/send",       icon: Send,            active: false },
            { label: "Wallet",     to: "/wallet",     icon: Wallet,          active: false },
            { label: "History",    to: "/history",    icon: CreditCard,      active: false },
            { label: "Fraud Log",  to: "/fraud",      icon: Shield,          active: true  },
            { label: "Settings",   to: "/settings",   icon: Settings,        active: false },
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
              {label === "Fraud Log" && pending > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {pending}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">WA</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Waseem Akram</p>
              <p className="truncate text-[11px] text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">Fraud Detection Log</h1>
            <p className="text-[11px] text-slate-400">AI-powered fraud reports & admin review</p>
          </div>
          {pending > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              <p className="text-xs font-bold text-rose-700">{pending} pending review</p>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">

          {/* ── stats ── */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-5">
            {[
              { label: "Pending Review", value: pending,   icon: Clock,        color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100"   },
              { label: "Confirmed Fraud",value: confirmed,  icon: XCircle,      color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-100"    },
              { label: "False Alarms",   value: cleared,    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
              { label: "Avg Risk Score", value: `${avgRisk}%`, icon: Activity,  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100"    },
            ].map(({ label, value, icon: Icon, color, bg, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-4`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-[11px] font-medium text-slate-500">{label}</p>
                <p className={`text-xl font-black ${color} mt-0.5`}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── pending alert banner ── */}
          {pending > 0 && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800">
                  {pending} transaction{pending > 1 ? "s" : ""} waiting for review
                </p>
                <p className="text-[11px] text-amber-600">
                  Review and take action on flagged transactions below.
                </p>
              </div>
              <button
                onClick={() => setStatusFilter("Pending")}
                className="flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors"
              >
                Review now <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* ── table card ── */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">

            {/* search + filter */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, report ID or transaction ID…"
                    className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  {search && (
                    <button onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-all
                    ${showFilters
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
                </button>
              </div>

              {showFilters && (
                <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  <p className="w-full text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Status</p>
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
              )}
            </div>

            {/* table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-2.5">
              {["User", "Amount", "Risk Score", "Signals", "Status", ""].map(h => (
                <p key={h} className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{h}</p>
              ))}
            </div>

            {/* rows */}
            <ul className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <li className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Shield className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No fraud reports found</p>
                </li>
              ) : paginated.map(report => (
                <li
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="group grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-slate-50 cursor-pointer md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
                >
                  {/* user */}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${report.avatar} text-[10px] font-bold text-white shadow-sm`}>
                      {report.user.split(" ").map(s => s[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{report.user}</p>
                      <p className="text-[10px] font-mono text-slate-400">{report.id}</p>
                    </div>
                  </div>

                  {/* amount */}
                  <div>
                    <p className="text-sm font-bold text-rose-600 line-through">
                      Rs. {report.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">{report.time}</p>
                  </div>

                  {/* risk */}
                  <RiskBar score={report.risk_score} />

                  {/* signals */}
                  <div className="flex flex-wrap gap-1">
                    {report.signals.slice(0, 2).map((s, i) => (
                      <span key={i} className="rounded-md bg-rose-50 border border-rose-100 px-1.5 py-0.5 text-[9px] font-medium text-rose-600 truncate max-w-25">
                        {s}
                      </span>
                    ))}
                    {report.signals.length > 2 && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                        +{report.signals.length - 2}
                      </span>
                    )}
                  </div>

                  {/* status */}
                  <StatusBadge status={report.status} />

                  {/* action */}
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedReport(report); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:border-blue-300 hover:text-blue-600"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            {/* pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-[11px] text-slate-400">
                {filtered.length} report{filtered.length !== 1 ? "s" : ""}
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
                  <button key={p} onClick={() => setPage(p)}
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
                  disabled={page === totalPages || totalPages === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── drawer ── */}
      {selectedReport && (
        <FraudDrawer
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}