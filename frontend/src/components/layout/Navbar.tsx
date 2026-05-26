import { useState } from "react";
import { ArrowRight, Send, Wallet, BarChart3, Shield,
         ChevronDown, Menu, X, Zap, HeadphonesIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  {
    label: "Features",
    to: null,
    dropdown: [
      { icon: Send,      label: "Send Money",          desc: "Instant wallet-to-wallet transfers", badge: null },
      { icon: Shield,    label: "Fraud Detection",     desc: "AI-powered real-time protection",    badge: "AI" },
      { icon: Wallet,    label: "Digital Wallet",      desc: "Manage your PKR balance easily",     badge: null },
      { icon: BarChart3, label: "Transaction History", desc: "Full audit trail & receipts",        badge: null },
    ],
  },
  { label: "About",   to: "/about",   dropdown: null },
  { label: "Contact", to: "/contact", dropdown: null },
];

/* ── SafePay SVG Logo Mark ── */
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="url(#lg1)"/>
      <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.25"/>
      <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.4" strokeWidth="1"/>
      <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.85"/>
      <path d="M18 14.5 Q20 16 18 17.5" stroke="white" strokeOpacity="0.7" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      <path d="M20 13.5 Q23 16 20 18.5" stroke="white" strokeOpacity="0.5" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
      <circle cx="9"  cy="21" r="1.2" fill="white" fillOpacity="0.8"/>
      <circle cx="13" cy="21" r="1.2" fill="white" fillOpacity="0.5"/>
      <circle cx="23" cy="9" r="5" fill="#10B981"/>
      <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB"/>
          <stop offset="1" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Navbar() {
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Top announcement bar ── */}
      <div className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-medium text-white">
        <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" />
        <span>SafePay is now live — send money instantly with AI fraud protection</span>
        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide">NEW</span>
      </div>

      {/* ── Main nav bar ── */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            <div className="transition-transform duration-200 group-hover:scale-105">
              <LogoMark />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-bold tracking-tight text-slate-900">
                Safe<span className="text-blue-600">Pay</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">Pakistan</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* Plain link (About, Contact) */}
                {!item.dropdown && item.to ? (
                  <Link
                    to={item.to}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                ) : (
                  /* Dropdown trigger (Features) */
                  <button className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900">
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                    )}
                  </button>
                )}

                {/* Dropdown panel */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                    <div className="mb-1 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">What we offer</p>
                    </div>
                    {item.dropdown.map(({ icon: Icon, label, desc, badge }) => (
                      <Link
                        key={label}
                        to="/sign-in"
                        className="group/item flex items-start gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-150 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:shadow-md group-hover/item:shadow-blue-600/30">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800 group-hover/item:text-blue-700 transition-colors">{label}</p>
                            {badge && (
                              <span className="rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">{badge}</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs leading-snug text-slate-500">{desc}</p>
                        </div>
                        <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300 opacity-0 transition-all duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-blue-500 group-hover/item:opacity-100" />
                      </Link>
                    ))}
                    <div className="mt-1 border-t border-slate-100 px-3 pt-2 pb-1">
                      <Link to="/sign-up" className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        <Zap className="h-3 w-3" /> Get started free
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="hidden rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md sm:inline"
            >
              Sign in
            </Link>

            <Link to="/sign-up">
              <Button className="group relative h-9 overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/35 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/25">
                <span className="relative z-10 flex items-center gap-1.5">
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </Button>
            </Link>

            <button className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 lg:flex">
              <HeadphonesIcon className="h-4 w-4" />
            </button>

            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="border-b border-slate-100 bg-white px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV_LINKS.map((item) => (
              <div key={item.label}>
                {/* Plain mobile link */}
                {!item.dropdown && item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                      {item.label}
                      {item.dropdown && <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
                    </button>
                    {item.dropdown && (
                      <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-slate-100 pl-3">
                        {item.dropdown.map(({ icon: Icon, label, badge }) => (
                          <Link
                            key={label}
                            to="/sign-in"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                          >
                            <Icon className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            {label}
                            {badge && <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">{badge}</span>}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
            </div>
            <Link to="/sign-in" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Sign in
            </Link>
            <Link to="/sign-up" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20">
                Get started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}