import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell, Camera, Check, CreditCard,
  Edit2, Eye, EyeOff, KeyRound,
  LayoutDashboard, Lock, LogOut,
  Mail, Phone, Send, Settings,
  Shield, User, Wallet, X,
  BadgeCheck, AlertTriangle, Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";


const USER = {
  id:               "66a78868-018a-4376-91c0-04b9b193fae5",
  full_name:        "Waseem Akram",
  email:            "mw5667155@gmail.com",
  phone:            "03431077698",
  cnic:             "38405-5723074-1",
  role:             "user",
  is_verified:      true,
  is_email_verified:false,
  avatar_url:       null,
  created_at:       "2026-05-01T10:00:00Z",
  last_login:       "2026-05-10T11:30:00Z",
  wallet_balance:   45200,
};


function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dlp)"/>
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1"/>
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8"/>
      <circle cx="23" cy="9" r="5" fill="#10B981"/>
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="dlp" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function InfoRow({
  label, value, mono = false, copyable = false,
}: {
  label: string; value: string; mono?: boolean; copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <p className="text-[11px] font-medium text-slate-400 w-28 shrink-0">{label}</p>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <p className={`text-sm font-semibold text-slate-800 truncate ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </p>
        {copyable && (
          <button onClick={copy}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  );
}


function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm]     = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow]     = useState({ current: false, newPass: false, confirm: false });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      setError("All fields are required."); return;
    }
    if (form.newPass !== form.confirm) {
      setError("New passwords do not match."); return;
    }
    if (form.newPass.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Change Password</p>
            <p className="text-[11px] text-slate-400">Keep your account secure</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {success ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-700">Password changed!</p>
            </div>
          ) : (
            <>
              {[
                { key: "current", label: "Current Password",  showKey: "current" },
                { key: "newPass", label: "New Password",      showKey: "newPass" },
                { key: "confirm", label: "Confirm Password",  showKey: "confirm" },
              ].map(({ key, label, showKey }) => (
                <div key={key}>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">{label}</p>
                  <div className="relative">
                    <input
                      type={show[showKey as keyof typeof show] ? "text" : "password"}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(p => ({ ...p, [showKey]: !p[showKey as keyof typeof p] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {show[showKey as keyof typeof show]
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {error && (
                <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline"
                  onClick={onClose}
                  className="flex-1 h-10 rounded-xl border-slate-200 text-sm font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  Update
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function ChangePinModal({ onClose }: { onClose: () => void }) {
  const [form, setForm]   = useState({ current: "", newPin: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!form.current || !form.newPin || !form.confirm) {
      setError("All fields are required."); return;
    }
    if (!/^\d{4}$/.test(form.newPin)) {
      setError("PIN must be exactly 4 digits."); return;
    }
    if (form.newPin !== form.confirm) {
      setError("PINs do not match."); return;
    }
    const weak = ["1234","4321","0000","1111","2222","3333","4444"];
    if (weak.includes(form.newPin)) {
      setError("PIN is too weak. Choose a stronger one."); return;
    }
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Change Transaction PIN</p>
            <p className="text-[11px] text-slate-400">4-digit PIN for sending money</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {success ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-700">PIN updated!</p>
            </div>
          ) : (
            <>
              {[
                { key: "current", label: "Current PIN",  placeholder: "••••" },
                { key: "newPin",  label: "New PIN",      placeholder: "4 digits" },
                { key: "confirm", label: "Confirm PIN",  placeholder: "4 digits" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">{label}</p>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value.replace(/\D/g, "") }))}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 tracking-widest placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder={placeholder}
                  />
                </div>
              ))}
              {error && (
                <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {error}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={onClose}
                  className="flex-1 h-10 rounded-xl border-slate-200 text-sm font-semibold"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}
                  className="flex-1 h-10 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  Update PIN
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export function ProfilePage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPinModal,      setShowPinModal]      = useState(false);
  const [editName,          setEditName]          = useState(false);
  const [nameValue,         setNameValue]         = useState(USER.full_name);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = USER.full_name.split(" ").map(s => s[0]).join("");
  const joinDate  = new Date(USER.created_at).toLocaleDateString("en-PK", {
    year: "numeric", month: "long", day: "numeric"
  });
  const lastLogin = new Date(USER.last_login).toLocaleDateString("en-PK", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

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
            { label: "Dashboard",     to: "/dashboard",     icon: LayoutDashboard },
            { label: "Send Money",    to: "/send",          icon: Send            },
            { label: "Wallet",        to: "/wallet",        icon: Wallet          },
            { label: "History",       to: "/history",       icon: CreditCard      },
            { label: "Notifications", to: "/notification", icon: Bell            },
            { label: "Profile",       to: "/profile",       icon: User  , active: true },
            { label: "Settings",      to: "/settings",      icon: Settings        },
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
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{USER.full_name}</p>
              <p className="truncate text-[11px] text-blue-600 font-medium">View profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">My Profile</h1>
            <p className="text-[11px] text-slate-400">Manage your account information</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-2xl space-y-5">

            {/* ── avatar + name hero ── */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 text-white shadow-xl shadow-blue-900/30">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 right-20 h-16 w-16 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-5">

                {/* avatar */}
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 text-2xl font-black text-white shadow-lg">
                    {initials}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-white text-blue-600 shadow-md hover:bg-blue-50 transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                </div>

                {/* name + status */}
                <div className="flex-1 min-w-0">
                  {editName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        className="h-9 flex-1 rounded-xl bg-white/10 border border-white/20 px-3 text-sm font-bold text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                      <button
                        onClick={() => setEditName(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setNameValue(USER.full_name); setEditName(false); }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-black text-white">{nameValue}</p>
                      <button
                        onClick={() => setEditName(true)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-blue-200 hover:bg-white/20 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                      {USER.role}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-blue-200">Member since {joinDate}</p>
                </div>
              </div>
            </div>

            {/* ── account info ── */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-bold text-slate-800">Account Information</p>
                </div>
              </div>
              <div className="px-5 py-2">
                <InfoRow label="Full Name"  value={nameValue} />
                <InfoRow label="User ID"    value={USER.id}    mono copyable />
                <InfoRow label="Role"       value={USER.role}  />
                <InfoRow label="Joined"     value={joinDate}   />
                <InfoRow label="Last Login" value={lastLogin}  />
              </div>
            </div>

            {/* ── contact info ── */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Phone className="h-4 w-4 text-slate-500" />
                <p className="text-sm font-bold text-slate-800">Contact Details</p>
              </div>
              <div className="divide-y divide-slate-50 px-5">

                {/* phone */}
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                      <Phone className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-800">{USER.phone}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                </div>

                {/* email */}
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Email Address</p>
                      <p className="text-sm font-semibold text-slate-800">{USER.email}</p>
                    </div>
                  </div>
                  {USER.is_email_verified ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <button className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-blue-700 transition-colors">
                      Verify email
                    </button>
                  )}
                </div>

                {/* cnic */}
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                      <Shield className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">CNIC</p>
                      <p className="text-sm font-semibold font-mono text-slate-800">
                        {USER.cnic.replace(/(\d{5})-(\d{4})\d{3}-(\d{1})/, "$1-****$2-$3")}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                    Masked
                  </span>
                </div>
              </div>
            </div>

            {/* ── wallet snapshot ── */}
            <div className="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-600 font-medium">Wallet Balance</p>
                    <p className="text-xl font-black text-blue-900">
                      Rs. {USER.wallet_balance.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Link to="/wallet">
                  <Button className="h-9 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700">
                    View Wallet
                  </Button>
                </Link>
              </div>
            </div>

            {/* ── security ── */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Lock className="h-4 w-4 text-slate-500" />
                <p className="text-sm font-bold text-slate-800">Security</p>
              </div>
              <div className="divide-y divide-slate-50">

                {/* change password */}
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors">
                      <KeyRound className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-800">Change Password</p>
                      <p className="text-[11px] text-slate-400">Update your login password</p>
                    </div>
                  </div>
                  <Edit2 className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>

                {/* change pin */}
                <button
                  onClick={() => setShowPinModal(true)}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-100 transition-colors">
                      <Shield className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-800">Change Transaction PIN</p>
                      <p className="text-[11px] text-slate-400">4-digit PIN used to send money</p>
                    </div>
                  </div>
                  <Edit2 className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* ── danger zone ── */}
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-400 mb-3">Danger Zone</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-rose-800">Log Out</p>
                  <p className="text-[11px] text-rose-500">Sign out from this device</p>
                </div>
                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-rose-300 text-rose-600 text-xs font-bold hover:bg-rose-100 hover:border-rose-400"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
                </Button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── modals ── */}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showPinModal      && <ChangePinModal      onClose={() => setShowPinModal(false)}      />}
    </div>
  );
}