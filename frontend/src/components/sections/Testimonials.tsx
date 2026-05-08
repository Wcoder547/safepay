import { Star } from "lucide-react";

export function Testimonials() {
  const items = [
    { q: "SafePay blocked a fraudulent Rs. 50,000 transfer I almost sent at 3AM. It saved my entire month's salary.", n: "Ahmed Khan", l: "Lahore, Pakistan", i: "AK", c: "from-blue-500 to-indigo-600" },
    { q: "The instant transfers are unreal. I pay my team of 8 people in under a minute now. Zero fees every time.", n: "Sara Mahmood", l: "Karachi, Pakistan", i: "SM", c: "from-emerald-500 to-teal-600" },
    { q: "Finally a payment app that actually explains why a transaction was blocked. Transparent, honest, and trustworthy.", n: "Bilal Raza", l: "Islamabad, Pakistan", i: "BR", c: "from-amber-500 to-orange-600" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <Star className="h-3 w-3 fill-current" /> What users say
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Trusted across Pakistan</h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <div key={t.n} className={`group relative rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 ${i === 1 ? "md:-translate-y-4 ring-1 ring-blue-100 shadow-xl" : ""}`}>
              <div className="absolute -top-3 left-7 flex h-7 items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 text-white shadow-md">
                {[...Array(5)].map((_,k) => <Star key={k} className="h-3 w-3 fill-current" />)}
              </div>
              <p className="mt-4 text-base leading-relaxed text-slate-700">"{t.q}"</p>
              <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow ${t.c}`}>{t.i}</div>
                <div><p className="text-sm font-semibold text-slate-900">{t.n}</p><p className="text-xs text-slate-500">{t.l}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
