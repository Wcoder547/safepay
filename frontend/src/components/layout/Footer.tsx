export function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Security", "How it works", "Wallet"] },
    { title: "Developers", links: ["API docs", "Swagger UI", "GitHub repo", "System design"] },
    { title: "Legal", links: ["Privacy policy", "Terms of service", "Cookie policy"] },
  ];
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-blue-600/30">SP</div>
            <span className="text-lg font-semibold text-white">SafePay</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            Pakistan's smartest digital wallet. Send money safely with AI-powered fraud protection.
          </p>
          <div className="mt-6 flex gap-2">
            {["in", "gh", "tw"].map((s) => (
              <a key={s} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white">{s}</a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="text-slate-300 transition hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-slate-500 md:flex-row">
          <p>© 2026 SafePay. Built with MERN + FastAPI.</p>
          <p className="flex items-center gap-1.5">Made with <span className="text-rose-500">♥</span> in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
