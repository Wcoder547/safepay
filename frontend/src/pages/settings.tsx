import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,CreditCard,
  Globe, LayoutDashboard, Lock,
  Moon, Send, Settings, Shield,
  Smartphone, Sun, Wallet, X,
  AlertTriangle,
  Eye, EyeOff, Monitor, Trash2,
  LogOut, Languages,User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── helpers ── */
function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#dls)"/>
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1"/>
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8"/>
      <circle cx="23" cy="9" r="5" fill="#10B981"/>
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="dls" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Toggle Switch ── */
function Toggle({
  enabled, onChange, disabled = false,
}: {
  enabled: boolean; onChange: () => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none
        ${enabled ? "bg-blue-600" : "bg-slate-200"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200
        ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

/* ── Setting Row ── */
function SettingRow({
  icon: Icon, iconBg, iconColor, label, description, children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 px-5">
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          {description && (
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ── Section Card ── */
function Section({
  title, icon: Icon, children,
}: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <Icon className="h-4 w-4 text-slate-500" />
        <p className="text-sm font-bold text-slate-800">{title}</p>
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  );
}

/* ── Delete Account Modal ── */
function DeleteModal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const confirmed = input === "DELETE";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-rose-700">Delete Account</p>
            <p className="text-[11px] text-slate-400">This action is irreversible</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-800 mb-1">Warning — This cannot be undone</p>
                <ul className="text-[11px] text-rose-600 space-y-1">
                  <li>• Your wallet balance will be forfeited</li>
                  <li>• All transaction history will be deleted</li>
                  <li>• Your account cannot be recovered</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">
            Type <span className="font-bold font-mono text-rose-600">DELETE</span> to confirm
          </p>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type DELETE here"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 mb-4"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}
              className="flex-1 h-10 rounded-xl border-slate-200 text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button
              disabled={!confirmed}
              className="flex-1 h-10 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-40 shadow-md shadow-rose-600/20"
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Active Sessions ── */
const SESSIONS = [
  { id: "S1", device: "Chrome · Windows 11",  ip: "110.93.12.45",  location: "Lahore, PK",  time: "Active now",    current: true  },
  { id: "S2", device: "Safari · iPhone 15",    ip: "110.93.12.46",  location: "Lahore, PK",  time: "2 hrs ago",     current: false },
  { id: "S3", device: "Firefox · Ubuntu 24",   ip: "203.81.44.12",  location: "Karachi, PK", time: "Yesterday",     current: false },
];

/* ══════════════════════════════════════════
   SETTINGS PAGE
══════════════════════════════════════════ */
export function SettingsPage() {
  // notification prefs
  const [notifs, setNotifs] = useState({
    transactions:  true,
    fraud_alerts:  true,
    login_alerts:  true,
    promotions:    false,
    low_balance:   true,
  });

  // privacy
  const [privacy, setPrivacy] = useState({
    hide_balance:       false,
    hide_transactions:  false,
    two_factor:         true,
  });

  // appearance
  const [theme, setTheme]     = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState("English");

  // security
  const [sessions, setSessions] = useState(SESSIONS);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggle = (
    group: "notifs" | "privacy",
    key: string
  ) => {
    if (group === "notifs")
      setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof p] }));
    else
      setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof p] }));
  };

  const revokeSession = (id: string) =>
    setSessions(prev => prev.filter(s => s.id !== id));

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
  { label: "Profile",       to: "/profile",       icon: User            },
  { label: "Settings",      to: "/settings",      icon: Settings,  active: true },
          ].map(({ label, to, icon: Icon, active }: any) => (
            <Link key={label} to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                ${active
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />{label}
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
        <header className="flex h-16 shrink-0 items-center border-b border-slate-100 bg-white px-5 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">Settings</h1>
            <p className="text-[11px] text-slate-400">Manage your preferences & security</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mx-auto max-w-2xl space-y-5">

            {/* ── Notification Preferences ── */}
            <Section title="Notification Preferences" icon={Bell}>
              {[
                { key: "transactions", label: "Transaction Alerts",    description: "Get notified for every send/receive",       icon: CreditCard, ibg: "bg-blue-100",    ic: "text-blue-600"    },
                { key: "fraud_alerts", label: "Fraud Alerts",          description: "Instant alert when a transaction is blocked",icon: Shield,     ibg: "bg-rose-100",    ic: "text-rose-600"    },
                { key: "login_alerts", label: "Login Alerts",          description: "Notify on new device login",                 icon: Lock,       ibg: "bg-amber-100",   ic: "text-amber-600"   },
                { key: "low_balance",  label: "Low Balance Warning",   description: "Alert when balance drops below Rs. 1,000",   icon: Wallet,     ibg: "bg-emerald-100", ic: "text-emerald-600" },
                { key: "promotions",   label: "Promotions & Updates",  description: "News, offers and app updates",               icon: Bell,       ibg: "bg-slate-100",   ic: "text-slate-500"   },
              ].map(({ key, label, description, icon, ibg, ic }) => (
                <SettingRow key={key} icon={icon} iconBg={ibg} iconColor={ic} label={label} description={description}>
                  <Toggle
                    enabled={notifs[key as keyof typeof notifs]}
                    onChange={() => toggle("notifs", key)}
                  />
                </SettingRow>
              ))}
            </Section>

            {/* ── Privacy ── */}
            <Section title="Privacy" icon={Eye}>
              <SettingRow
                icon={EyeOff} iconBg="bg-slate-100" iconColor="text-slate-600"
                label="Hide Balance" description="Mask wallet balance on dashboard by default"
              >
                <Toggle enabled={privacy.hide_balance} onChange={() => toggle("privacy", "hide_balance")} />
              </SettingRow>
              <SettingRow
                icon={Lock} iconBg="bg-indigo-100" iconColor="text-indigo-600"
                label="Private Transaction History" description="Hide transaction details from screenshots"
              >
                <Toggle enabled={privacy.hide_transactions} onChange={() => toggle("privacy", "hide_transactions")} />
              </SettingRow>
              <SettingRow
                icon={Shield} iconBg="bg-emerald-100" iconColor="text-emerald-600"
                label="Two-Factor Authentication" description="Extra security layer on every login"
              >
                <Toggle enabled={privacy.two_factor} onChange={() => toggle("privacy", "two_factor")} />
              </SettingRow>
            </Section>

            {/* ── Appearance ── */}
            <Section title="Appearance" icon={Sun}>
              {/* theme */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                    <Sun className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Theme</p>
                    <p className="text-[11px] text-slate-400">Choose your display theme</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light",  label: "Light",  icon: Sun     },
                    { value: "dark",   label: "Dark",   icon: Moon    },
                    { value: "system", label: "System", icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as typeof theme)}
                      className={`flex flex-col items-center gap-2 rounded-xl border py-3 text-xs font-semibold transition-all
                        ${theme === value
                          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* language */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                      <Languages className="h-4 w-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Language</p>
                      <p className="text-[11px] text-slate-400">App display language</p>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>English</option>
                    <option>Urdu</option>
                  </select>
                </div>
              </div>
            </Section>

            {/* ── Active Sessions ── */}
            <Section title="Active Sessions" icon={Smartphone}>
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                      ${session.current ? "bg-emerald-100" : "bg-slate-100"}`}
                    >
                      <Smartphone className={`h-4 w-4 ${session.current ? "text-emerald-600" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{session.device}</p>
                        {session.current && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {session.location} · {session.ip} · {session.time}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      className="flex h-8 items-center gap-1.5 rounded-xl border border-rose-200 px-2.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <X className="h-3 w-3" /> Revoke
                    </button>
                  )}
                </div>
              ))}
              {sessions.length === 1 && (
                <div className="px-5 pb-4">
                  <p className="text-[11px] text-slate-400 text-center py-2">
                    No other active sessions
                  </p>
                </div>
              )}
              <div className="px-5 pb-4">
                <button
                  onClick={() => setSessions(prev => prev.filter(s => s.current))}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Revoke All Other Sessions
                </button>
              </div>
            </Section>

            {/* ── About ── */}
            <Section title="About" icon={Globe}>
              {[
                { label: "App Version",       value: "v1.0.0"            },
                { label: "Privacy Policy",     value: "View →"            },
                { label: "Terms of Service",   value: "View →"            },
                { label: "Support",            value: "support@safepay.pk"},
              ].map(({ label, value }) => (
                <button key={label}
                  className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <p className="text-sm font-semibold text-blue-600">{value}</p>
                </button>
              ))}
            </Section>

            {/* ── Danger Zone ── */}
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-400 mb-4">
                Danger Zone
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-rose-800">Log Out</p>
                    <p className="text-[11px] text-rose-500">Sign out from this device</p>
                  </div>
                  <Button variant="outline"
                    className="h-9 rounded-xl border-rose-300 text-rose-600 text-xs font-bold hover:bg-rose-100"
                  >
                    <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Out
                  </Button>
                </div>
                <div className="border-t border-rose-200 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-rose-800">Delete Account</p>
                    <p className="text-[11px] text-rose-500">Permanently delete all data</p>
                  </div>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    className="h-9 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── modal ── */}
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
}