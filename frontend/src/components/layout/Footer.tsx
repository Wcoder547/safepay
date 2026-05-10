import { ArrowRight,Mail } from "lucide-react";

/* ── Social icon SVGs ── */
function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function GitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
function Twitter() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Features",       badge: null    },
      { label: "How it works",   badge: null    },
      { label: "Wallet",         badge: null    },
      { label: "Fraud Detection",badge: "AI"    },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Docs",      badge: null     },
      { label: "Swagger UI",    badge: "Live"   },
      { label: "GitHub Repo",   badge: null     },
      { label: "System Design", badge: null     },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",   badge: null  },
      { label: "Terms of Service", badge: null  },
      { label: "Cookie Policy",    badge: null  },
    ],
  },
];


const SOCIALS = [
  { icon: LinkedIn, label: "LinkedIn" },
  { icon: GitHub,   label: "GitHub"   },
  { icon: Twitter,  label: "Twitter"  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">

      {/* background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* ── Newsletter CTA band ── */}
      <div className="relative border-b border-slate-800/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-semibold text-white">Stay in the loop</p>
            <p className="mt-0.5 text-sm text-slate-400">Product updates, fraud alerts & feature releases.</p>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 p-1.5 backdrop-blur">
            <Mail className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
            />
            <button className="group flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:shadow-blue-600/40 hover:scale-[1.03]">
              Subscribe <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.8fr_1fr_1fr_1fr]">

        {/* brand col */}
        <div>
          {/* logo */}
          <div className="flex items-center gap-2.5">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#fl1)"/>
              <rect x="5" y="10" width="22" height="15" rx="3" fill="white" fillOpacity="0.2"/>
              <rect x="5" y="10" width="22" height="15" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1"/>
              <rect x="8" y="14" width="5" height="4" rx="1" fill="white" fillOpacity="0.8"/>
              <path d="M18 14.5 Q20 16 18 17.5" stroke="white" strokeOpacity="0.65" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
              <path d="M20 13.5 Q23 16 20 18.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
              <circle cx="9"  cy="21" r="1.2" fill="white" fillOpacity="0.7"/>
              <circle cx="13" cy="21" r="1.2" fill="white" fillOpacity="0.45"/>
              <circle cx="23" cy="9" r="5" fill="#10B981"/>
              <path d="M20.5 9l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="fl1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563EB"/><stop offset="1" stopColor="#4F46E5"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="leading-none">
              <p className="text-[17px] font-bold text-white">Safe<span className="text-blue-400">Pay</span></p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Pakistan</p>
            </div>
          </div>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            Pakistan's smartest digital wallet. Send money instantly with AI-powered fraud protection built in.
          </p>

         

          {/* social icons */}
          <div className="mt-7 flex gap-2">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-150 hover:border-blue-500/60 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-600/25"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* link cols */}
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {col.title}
            </p>
            <ul className="mt-5 space-y-3">
              {col.links.map(({ label, badge }) => (
                <li key={label}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="h-px w-3 bg-slate-700 transition-all duration-150 group-hover:w-4 group-hover:bg-blue-500" />
                    {label}
                    {badge && (
                      <span className="rounded-full bg-blue-600/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-400 ring-1 ring-blue-600/30">
                        {badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t border-slate-800/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-600 sm:flex-row">
          <p>© 2026 SafePay. All rights reserved. Built with MERN + FastAPI + ML.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <span className="inline-block animate-pulse text-rose-500">♥</span>
            by waseem malik
          </p>
        </div>
      </div>

    </footer>
  );
}