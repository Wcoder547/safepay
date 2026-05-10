import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft, ArrowUpRight, Bell, ChevronRight,
  CreditCard, LayoutDashboard, Lock, LogOut,
  Plus, Send, Settings, Shield, TrendingUp,
  User, Wallet, X, Menu, Search, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── fake data ── */
const USER = { name: "Waseem Akram", phone: "+92 343 1077698", role: "user", verified: true };

const TRANSACTIONS = [
  { id: 1, name: "Ahmed Khan",  phone: "0300 1234567", type: "DEBIT",  amount: 2000,  status: "APPROVED", time: "2:45 PM", avatar: "from-blue-500 to-indigo-600"    },
  { id: 2, name: "Sara Ali",    phone: "0321 9876543", type: "CREDIT", amount: 5500,  status: "APPROVED", time: "1:12 PM", avatar: "from-emerald-500 to-teal-600"   },
  { id: 3, name: "Bilal Shah",  phone: "0333 5554444", type: "DEBIT",  amount: 1200,  status: "BLOCKED",  time: "11:30 AM",avatar: "from-amber-500 to-orange-600"  },
  { id: 4, name: "Fatima H",    phone: "0312 1112233", type: "CREDIT", amount: 10000, status: "APPROVED", time: "10:05 AM",avatar: "from-rose-500 to-pink-600"      },
  { id: 5, name: "Usman Tariq", phone: "0345 6667788", type: "DEBIT",  amount: 750,   status: "APPROVED", time: "9:20 AM", avatar: "from-violet-500 to-purple-600"  },
];

const QUICK_CONTACTS = [
  { name: "Ahmed",  avatar: "from-blue-500 to-indigo-600"   },
  { name: "Sara",   avatar: "from-emerald-500 to-teal-600"  },
  { name: "Bilal",  avatar: "from-amber-500 to-orange-600"  },
  { name: "Fatima", avatar: "from-rose-500 to-pink-600"     },
];

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     to: "/dashboard"     },
  { icon: Send,            label: "Send Money",    to: "/sendMoney"     },
  { icon: Wallet,          label: "Wallet",        to: "/wallet"        },
  { icon: CreditCard,      label: "History",       to: "/history"       },
  { icon: Bell,            label: "Notifications", to: "/notifications" },
  { icon: User,            label: "Profile",       to: "/profile"       },
  { icon: Settings,        label: "Settings",      to: "/settings"      },
];
/* ── Logo ── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dl)"/>
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1"/>
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8"/>
      <path d="M18 14.5 Q20 16 18 17.5" stroke="white" strokeOpacity="0.65" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      <path d="M20 13.5 Q23 16 20 18.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      <circle cx="9"  cy="21" r="1.2" fill="white" fillOpacity="0.7"/>
      <circle cx="13" cy="21" r="1.2" fill="white" fillOpacity="0.45"/>
      <circle cx="23" cy="9"  r="5"   fill="#10B981"/>
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="dl" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* ════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════ */}
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white border-r border-slate-100 shadow-sm
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        {/* logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <LogoMark size={34} />
          <div className="leading-none">
            <p className="text-[16px] font-bold text-slate-900">Safe<span className="text-blue-600">Pay</span></p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Pakistan</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 md:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ icon: Icon, label, to }) => {
            const active = label === "Dashboard";
            return (
              <Link
                key={label}
                to={to}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                {label}
                
              </Link>
              
            );
          })}
        </nav>

        {/* user card */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              WA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{USER.name}</p>
              <p className="truncate text-[11px] text-slate-500">{USER.phone}</p>
            </div>
            <button className="text-slate-400 hover:text-rose-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN
      ════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden">
              <Menu className="h-4 w-4" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search transactions…"
                className="h-9 w-56 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* live dot */}
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">All systems live</span>
            </div>
            {/* notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">3</span>
            </button>
            {/* avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              WA
            </div>
          </div>
        </header>

        {/* scrollable content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">

          {/* greeting */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">Good morning, Waseem 👋</h1>
            <p className="text-sm text-slate-500">Here's what's happening with your wallet today.</p>
          </div>

          {/* ── top row ── */}
          <div className="grid gap-4 lg:grid-cols-3">

            {/* wallet balance card */}
            <div className="relative col-span-1 overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl shadow-blue-900/30 lg:col-span-2">
              {/* decorative circles */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 right-16 h-24 w-24 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-200">Total Balance</p>
                    <div className="mt-2 flex items-center gap-3">
                      <p className="text-4xl font-black tracking-tight">
                        {balanceVisible ? "Rs. 45,200" : "Rs. ••••••"}
                      </p>
                      <button
                        onClick={() => setBalanceVisible(v => !v)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-blue-200 transition hover:bg-white/20"
                      >
                        {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                      <TrendingUp className="h-3 w-3" />
                      +12.5% this month
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                    <Wallet className="h-6 w-6 text-blue-200" />
                  </div>
                </div>

                {/* mini stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "Sent",     value: "Rs. 8,950", color: "text-rose-300"    },
                    { label: "Received", value: "Rs. 15,500",color: "text-emerald-300" },
                    { label: "Blocked",  value: "1 txn",     color: "text-amber-300"   },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur">
                      <p className="text-[10px] text-blue-200">{label}</p>
                      <p className={`mt-0.5 text-sm font-bold ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* action buttons */}
                <div className="mt-5 flex gap-2">
                  <Link to="/sendMoney">
                    <Button className="h-9 rounded-xl bg-white text-blue-700 text-xs font-bold shadow hover:bg-blue-50 transition-colors">
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Send
                    </Button>
                  </Link>
                  <Button variant="outline" className="h-9 rounded-xl border-white/20 bg-white/10 text-white text-xs font-bold backdrop-blur hover:bg-white/20">
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Top Up
                  </Button>
                </div>
              </div>
            </div>

            {/* quick send */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">Quick Send</p>
                <Link to="/sendMoney" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">+ New</Link>
              </div>
              <div className="flex gap-3">
                {QUICK_CONTACTS.map(({ name, avatar }) => (
                  <button key={name} className="flex flex-col items-center gap-1.5 group">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br ${avatar} text-xs font-bold text-white shadow-sm ring-2 ring-white transition group-hover:ring-blue-300`}>
                      {name[0]}
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-800 transition">{name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Send to number</p>
                <div className="flex gap-2">
                  <input
                    placeholder="03XX XXXXXXX"
                    className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Button className="h-9 w-9 shrink-0 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 p-0 shadow-md shadow-blue-600/20">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* fraud shield note */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5">
                <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-[11px] leading-snug text-emerald-700 font-medium">AI fraud check runs on every transfer</p>
              </div>
            </div>
          </div>

          {/* ── bottom row ── */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">

            {/* recent transactions */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">Recent Transactions</p>
                <Link to="/history" className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <ul className="space-y-1">
                {TRANSACTIONS.map((txn) => (
                  <li key={txn.id} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                    {/* avatar */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${txn.avatar} text-[11px] font-bold text-white shadow-sm`}>
                      {txn.name.split(" ").map(s => s[0]).join("")}
                    </div>

                    {/* info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{txn.name}</p>
                        {txn.status === "BLOCKED" && (
                          <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-600">Blocked</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{txn.phone} · {txn.time}</p>
                    </div>

                    {/* amount */}
                    <div className="text-right">
                      <p className={`text-sm font-bold ${txn.type === "CREDIT" ? "text-emerald-600" : txn.status === "BLOCKED" ? "text-rose-500 line-through" : "text-slate-800"}`}>
                        {txn.type === "CREDIT" ? "+" : "-"}Rs. {txn.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        {txn.type === "CREDIT"
                          ? <ArrowDownLeft className="h-3 w-3 text-emerald-500" />
                          : <ArrowUpRight className={`h-3 w-3 ${txn.status === "BLOCKED" ? "text-rose-400" : "text-slate-400"}`} />
                        }
                        <span className="text-[10px] text-slate-400">{txn.type === "CREDIT" ? "Received" : txn.status === "BLOCKED" ? "Blocked" : "Sent"}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* right col */}
            <div className="flex flex-col gap-4">

              {/* fraud alert card */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100">
                    <Shield className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-rose-800">Fraud Alert</p>
                    <p className="text-[11px] text-rose-500">1 transaction blocked today</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Bilal Shah</p>
                      <p className="text-[11px] text-slate-400">Rs. 1,200 · 11:30 AM</p>
                    </div>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">Risk 87%</span>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-500">Unusual amount at odd hours detected by AI.</p>
                </div>
                <Link to="/fraud" className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                  Review report <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* security score */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-800 mb-3">Account Security</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#sg)" strokeWidth="3"
                        strokeDasharray="85 100" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563eb"/><stop offset="100%" stopColor="#4f46e5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-blue-600">85</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700">Good standing</p>
                    <p className="mt-1 text-[11px] text-slate-500">Enable 2FA to reach 100</p>
                    <button className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      <Lock className="h-3 w-3" /> Enable 2FA
                    </button>
                  </div>
                </div>

                {[
                  { label: "Phone verified",  done: true  },
                  { label: "PIN set",         done: true  },
                  { label: "2FA enabled",     done: false },
                ].map(({ label, done }) => (
                  <div key={label} className="mt-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${done ? "bg-emerald-100" : "bg-slate-100"}`}>
                      {done
                        ? <svg className="h-2.5 w-2.5 text-emerald-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
                        : <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      }
                    </div>
                    <p className={`text-[11px] ${done ? "text-slate-600" : "text-slate-400"}`}>{label}</p>
                  </div>
                ))}
              </div>

              {/* profile quick actions */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-800 mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: User,       label: "Profile",  color: "bg-blue-50 text-blue-600"    },
                    { icon: CreditCard, label: "Wallet",   color: "bg-indigo-50 text-indigo-600" },
                    { icon: Bell,       label: "Alerts",   color: "bg-amber-50 text-amber-600"   },
                    { icon: Settings,   label: "Settings", color: "bg-slate-100 text-slate-600"  },
                  ].map(({ icon: Icon, label, color }) => (
                    <button key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-100 py-3 text-[11px] font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/50">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}