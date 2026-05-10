import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight,
  CreditCard, LayoutDashboard, Lock, LogOut,
  Search, Send, Settings, Shield, Wallet, X,
  Menu, AlertTriangle, Loader2, Eye, EyeOff, User,Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── types ── */
type Step = "recipient" | "amount" | "pin" | "processing" | "result";
type ResultType = "approved" | "blocked";

/* ── fake contacts ── */
const RECENTS = [
  { name: "Ahmed Khan",  phone: "03001234567", avatar: "from-blue-500 to-indigo-600"    },
  { name: "Sara Ali",    phone: "03219876543", avatar: "from-emerald-500 to-teal-600"   },
  { name: "Fatima H",   phone: "03121112233", avatar: "from-rose-500 to-pink-600"       },
  { name: "Usman T",    phone: "03456667788", avatar: "from-violet-500 to-purple-600"   },
  { name: "Bilal Shah", phone: "03335554444", avatar: "from-amber-500 to-orange-600"    },
];

/* ── sidebar nav (same as dashboard) ── */
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     to: "/dashboard"     },
  { icon: Send,            label: "Send Money",    to: "/sendMoney"     },
  { icon: Wallet,          label: "Wallet",        to: "/wallet"        },
  { icon: CreditCard,      label: "History",       to: "/history"       },
  { icon: Bell,            label: "Notifications", to: "/notification" },
  { icon: User,            label: "Profile",       to: "/profile"       },
  { icon: Settings,        label: "Settings",      to: "/settings"      },
];

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#sl)"/>
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
        <linearGradient id="sl" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ════════════════════════════════════════════
   STEP COMPONENTS
════════════════════════════════════════════ */

/* Step 1 — Recipient */
function StepRecipient({
  phone, setPhone, note, setNote, onNext,
}: {
  phone: string; setPhone: (v: string) => void;
  note: string;  setNote:  (v: string) => void;
  onNext: (contact?: typeof RECENTS[0]) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = RECENTS.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.phone.includes(search)
  );

  return (
    <div className="space-y-5">
      {/* phone input */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Recipient phone number</label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <span className="text-sm font-semibold text-slate-500">+92</span>
          <div className="h-4 w-px bg-slate-200" />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="3XX XXXXXXX"
            className="h-12 flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {phone && (
            <button onClick={() => setPhone("")} className="text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* note */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Note <span className="font-normal text-slate-400">(optional)</span></label>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Rent payment, groceries…"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
      </div>

      {/* recent contacts */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600">Recent contacts</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="h-7 w-32 rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>
        <ul className="space-y-1">
          {filtered.map(c => (
            <li key={c.phone}>
              <button
                onClick={() => { setPhone(c.phone.slice(1)); onNext(c); }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br ${c.avatar} text-[11px] font-bold text-white shadow-sm`}>
                  {c.name.split(" ").map(s => s[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-400">{c.phone}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 transition group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => onNext()}
        disabled={phone.length < 10}
        className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-sm font-semibold shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Continue <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  );
}

/* Step 2 — Amount */
function StepAmount({
  amount, setAmount, receiver, balance, onNext, onBack,
}: {
  amount: string; setAmount: (v: string) => void;
  receiver: string; balance: number;
  onNext: () => void; onBack: () => void;
}) {
  const num   = parseFloat(amount) || 0;
  const valid = num > 0 && num <= balance;

  const PRESETS = [500, 1000, 2000, 5000];

  return (
    <div className="space-y-5">
      {/* receiver chip */}
      <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
          {receiver.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-slate-500">Sending to</p>
          <p className="text-sm font-semibold text-slate-800">{receiver}</p>
        </div>
        <button onClick={onBack} className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700">Change</button>
      </div>

      {/* big amount input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Amount (PKR)</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-slate-400">Rs.</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="w-48 bg-transparent text-center text-4xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Available: <span className="font-semibold text-slate-700">Rs. {balance.toLocaleString()}</span>
        </p>
        {num > balance && (
          <p className="mt-1.5 flex items-center justify-center gap-1 text-xs font-semibold text-rose-500">
            <AlertTriangle className="h-3 w-3" /> Insufficient balance
          </p>
        )}
      </div>

      {/* presets */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            className={`rounded-xl border py-2 text-sm font-semibold transition-all ${
              amount === String(p)
                ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            {p >= 1000 ? `${p/1000}k` : p}
          </button>
        ))}
      </div>

      {/* fee notice */}
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5">
        <Check className="h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-[11px] font-medium text-emerald-700">Zero transfer fees · Amount received = amount sent</p>
      </div>

      <Button
        onClick={onNext}
        disabled={!valid}
        className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-sm font-semibold shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Review transfer <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </div>
  );
}

/* Step 3 — Review + PIN */
function StepPin({
  phone, receiverName, amount, note, pin, setPin,
  pinVisible, setPinVisible, onConfirm, onBack,
}: {
  phone: string; receiverName: string; amount: string; note: string;
  pin: string; setPin: (v: string) => void;
  pinVisible: boolean; setPinVisible: (v: boolean) => void;
  onConfirm: () => void; onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* review card */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-100">Transfer summary</p>
          <p className="mt-1 text-3xl font-black">Rs. {parseFloat(amount).toLocaleString()}</p>
        </div>
        <div className="divide-y divide-slate-50 px-5">
          {[
            { label: "To",      value: receiverName || phone },
            { label: "Phone",   value: "+92 " + phone        },
            { label: "Amount",  value: "Rs. " + parseFloat(amount).toLocaleString() },
            { label: "Fee",     value: "Rs. 0 (Free)"        },
            { label: "Note",    value: note || "—"           },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI fraud notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-[11px] leading-relaxed text-blue-700">
          AI fraud analysis runs instantly before this transfer. If risk is detected, the transaction will be blocked automatically.
        </p>
      </div>

      {/* PIN entry */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Enter your 4-digit transaction PIN</label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <Lock className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type={pinVisible ? "text" : "password"}
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
            className="h-12 flex-1 bg-transparent text-center text-xl font-bold tracking-[0.5em] text-slate-800 placeholder:text-slate-300 placeholder:tracking-normal focus:outline-none"
          />
          <button onClick={() => setPinVisible(!pinVisible)} className="text-slate-400 hover:text-slate-600">
            {pinVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 flex-1 rounded-xl border-slate-200 text-sm font-semibold text-slate-700"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={pin.length < 4}
          className="h-12 flex-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-sm font-semibold shadow-lg shadow-blue-600/25 transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm & Send <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* Step 4 — Processing */
function StepProcessing() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-t-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      <p className="text-base font-bold text-slate-900">Running AI fraud check…</p>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">Analyzing transaction patterns and risk signals in real time.</p>
      <div className="mt-6 space-y-2 w-64">
        {["Verifying recipient", "Checking transaction patterns", "Running ML fraud model"].map((s, i) => (
          <div key={s} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2">
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-blue-500" style={{ animationDelay: `${i * 0.2}s` }} />
            <p className="text-xs text-slate-600">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Step 5 — Result */
function StepResult({
  type, amount, receiverName, riskScore, reasons, onDone,
}: {
  type: ResultType; amount: string; receiverName: string;
  riskScore: number; reasons: string[]; onDone: () => void;
}) {
  const approved = type === "approved";
  return (
    <div className="flex flex-col items-center text-center">
      {/* icon */}
      <div className={`relative mb-5 flex h-20 w-20 items-center justify-center rounded-full shadow-lg ${
        approved ? "bg-linear-to-br from-emerald-400 to-teal-500 shadow-emerald-400/30"
                 : "bg-linear-to-br from-rose-400 to-rose-600 shadow-rose-400/30"
      }`}>
        {approved
          ? <Check className="h-9 w-9 text-white" strokeWidth={3} />
          : <X     className="h-9 w-9 text-white" strokeWidth={3} />
        }
        <div className={`absolute inset-0 animate-ping rounded-full opacity-20 ${approved ? "bg-emerald-400" : "bg-rose-400"}`} />
      </div>

      <p className="text-xl font-black text-slate-900">
        {approved ? "Transfer Successful!" : "Transaction Blocked!"}
      </p>
      <p className="mt-1.5 text-sm text-slate-500">
        {approved
          ? `Rs. ${parseFloat(amount).toLocaleString()} sent to ${receiverName}`
          : `Rs. ${parseFloat(amount).toLocaleString()} transfer was blocked by AI`
        }
      </p>

      {/* detail card */}
      <div className={`mt-5 w-full rounded-2xl border p-4 text-left ${
        approved ? "border-emerald-100 bg-emerald-50" : "border-rose-100 bg-rose-50"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-600">Risk score</p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            riskScore < 30 ? "bg-emerald-100 text-emerald-700"
            : riskScore < 70 ? "bg-amber-100 text-amber-700"
            : "bg-rose-100 text-rose-700"
          }`}>{riskScore}%</span>
        </div>
        {/* risk bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              riskScore < 30 ? "bg-emerald-500" : riskScore < 70 ? "bg-amber-500" : "bg-rose-500"
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        {!approved && reasons.length > 0 && (
          <ul className="mt-3 space-y-1">
            {reasons.map(r => (
              <li key={r} className="flex items-start gap-1.5 text-[11px] text-rose-700">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex w-full gap-3">
        <Link to="/history" className="flex-1">
          <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 text-sm font-semibold text-slate-700">
            View history
          </Button>
        </Link>
        <Button
          onClick={onDone}
          className="flex-1 h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-sm font-semibold shadow-md shadow-blue-600/25"
        >
          Send again
        </Button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export function SendMoney() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* form state */
  const [step,          setStep]          = useState<Step>("recipient");
  const [phone,         setPhone]         = useState("");
  const [receiverName,  setReceiverName]  = useState("");
  const [note,          setNote]          = useState("");
  const [amount,        setAmount]        = useState("");
  const [pin,           setPin]           = useState("");
  const [pinVisible,    setPinVisible]    = useState(false);
  const [resultType,    setResultType]    = useState<ResultType>("approved");
  const [riskScore,     setRiskScore]     = useState(0);
  const BALANCE = 45200;

  const STEP_ORDER: Step[] = ["recipient", "amount", "pin", "processing", "result"];
  const stepIndex = STEP_ORDER.indexOf(step);

  function handleRecipientNext(contact?: typeof RECENTS[0]) {
    if (contact) setReceiverName(contact.name);
    setStep("amount");
  }

  function handleConfirm() {
    setStep("processing");
    const amt = parseFloat(amount);
    const hour = new Date().getHours();
    /* simulate ML call */
    setTimeout(() => {
      const score = amt > 50000 && hour < 6 ? 91
                  : amt > 20000             ? 45
                  : 8;
      setRiskScore(score);
      setResultType(score >= 70 ? "blocked" : "approved");
      setStep("result");
    }, 2800);
  }

  function reset() {
    setStep("recipient"); setPhone(""); setReceiverName("");
    setNote(""); setAmount(""); setPin(""); setRiskScore(0);
  }

  const STEP_LABELS = ["Recipient", "Amount", "Confirm"];
  const displayIndex = Math.min(stepIndex, 2); // clamp for progress bar

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-white border-r border-slate-100 shadow-sm transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}>
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <LogoMark size={34} />
          <div className="leading-none">
            <p className="text-[16px] font-bold text-slate-900">Safe<span className="text-blue-600">Pay</span></p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Pakistan</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 md:hidden"><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map(({ icon: Icon, label, to }) => {
            const active = label === "Send Money";
            return (
              <Link key={label} to={to} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${active ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">WA</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Waseem Akram</p>
              <p className="truncate text-[11px] text-slate-500">+92 343 1077698</p>
            </div>
            <button className="text-slate-400 hover:text-rose-500 transition-colors"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden">
              <Menu className="h-4 w-4" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">AI protection active</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">WA</div>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto max-w-md">

            {/* page title */}
            {step !== "processing" && step !== "result" && (
              <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Send Money</h1>
                <p className="text-sm text-slate-500">Fast, secure, AI-protected transfers.</p>
              </div>
            )}

            {/* progress bar */}
            {step !== "processing" && step !== "result" && (
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {STEP_LABELS.map((label, i) => (
                    <div key={label} className="flex items-center gap-2 flex-1">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        i < displayIndex  ? "bg-blue-600 text-white"
                        : i === displayIndex ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-100 text-slate-400"
                      }`}>
                        {i < displayIndex ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                      </div>
                      <span className={`text-xs font-semibold ${i === displayIndex ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
                      {i < STEP_LABELS.length - 1 && (
                        <div className={`flex-1 h-px transition-all ${i < displayIndex ? "bg-blue-600" : "bg-slate-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* card */}
            <div className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${step === "processing" || step === "result" ? "rounded-2xl" : ""}`}>
              {step === "recipient" && (
                <StepRecipient phone={phone} setPhone={setPhone} note={note} setNote={setNote} onNext={handleRecipientNext} />
              )}
              {step === "amount" && (
                <StepAmount amount={amount} setAmount={setAmount} receiver={receiverName || "+92 " + phone} balance={BALANCE} onNext={() => setStep("pin")} onBack={() => setStep("recipient")} />
              )}
              {step === "pin" && (
                <StepPin phone={phone} receiverName={receiverName} amount={amount} note={note} pin={pin} setPin={setPin} pinVisible={pinVisible} setPinVisible={setPinVisible} onConfirm={handleConfirm} onBack={() => setStep("amount")} />
              )}
              {step === "processing" && <StepProcessing />}
              {step === "result" && (
                <StepResult type={resultType} amount={amount} receiverName={receiverName || "+92 " + phone} riskScore={riskScore} reasons={resultType === "blocked" ? ["Large amount at unusual hour", "First-time receiver flagged"] : []} onDone={reset} />
              )}
            </div>

            {/* balance pill */}
            {(step === "recipient" || step === "amount") && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Wallet className="h-3.5 w-3.5 text-slate-400" />
                Available balance:
                <span className="font-bold text-slate-800">Rs. {BALANCE.toLocaleString()}</span>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}