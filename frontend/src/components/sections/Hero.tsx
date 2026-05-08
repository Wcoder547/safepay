import { ArrowRight, Check, ChevronRight, Fingerprint, Shield, Sparkles, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-blue-50/40 to-white" />
        <div className="absolute -left-32 top-20 h-125 w-125 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute -right-32 top-40 h-125 w-125 rounded-full bg-indigo-300/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-32">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/60 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            AI-powered fraud protection
            <ChevronRight className="h-3 w-3" />
          </span>
          <h1 className="mt-7 text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em] text-slate-900">
            Send money{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">safely.</span>
              <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="url(#g)" strokeWidth="3" strokeLinecap="round"/>
                <defs><linearGradient id="g"><stop offset="0%" stopColor="#2563eb"/><stop offset="100%" stopColor="#4f46e5"/></linearGradient></defs>
              </svg>
            </span>
            <br />Blocked before it hurts.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">SafePay uses real-time AI to detect fraud before every transaction. Instant transfers. Zero fees. Full peace of mind.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" className="h-12 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-7 text-base shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all">
              Create free account <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="ghost" className="h-12 rounded-full px-6 text-base text-slate-700 hover:bg-slate-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">▶</span>
              See how it works
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2.5">
              {[["AK","from-blue-500 to-blue-600"],["SM","from-emerald-500 to-emerald-600"],["BR","from-amber-500 to-orange-600"],["FH","from-rose-500 to-pink-600"]].map(([t,c]) => (
                <div key={t} className={`flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br ${c} text-[11px] font-semibold text-white ring-2 ring-white shadow-sm`}>{t}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_,i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                <span className="ml-1.5 text-xs font-semibold text-slate-700">4.9</span>
              </div>
              <p className="text-sm text-slate-600">Trusted by <span className="font-semibold text-slate-900">50,000+</span> users</p>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute -left-4 top-8 z-20 hidden rounded-2xl border border-emerald-200 bg-white/90 px-3.5 py-2.5 shadow-xl backdrop-blur md:flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-4 w-4" strokeWidth={3} /></div>
            <div><p className="text-[11px] font-medium text-slate-500">Transfer complete</p><p className="text-xs font-semibold text-slate-900">Rs. 5,500 sent</p></div>
          </div>
          <div className="absolute -right-2 bottom-12 z-20 hidden rounded-2xl border border-rose-200 bg-white/90 px-3.5 py-2.5 shadow-xl backdrop-blur md:flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600"><Shield className="h-4 w-4" /></div>
            <div><p className="text-[11px] font-medium text-slate-500">Fraud blocked</p><p className="text-xs font-semibold text-slate-900">Risk score 87</p></div>
          </div>
          <div className="absolute inset-0 z-0 mx-auto h-full w-[90%] rounded-4xl bg-linear-to-br from-blue-400/30 via-indigo-400/20 to-transparent blur-2xl" />
          <div className="relative w-full max-w-md rounded-[1.75rem] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_-20px_rgba(37,99,235,0.25)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-md">AH</div>
                <div><p className="text-sm font-semibold text-slate-900">Ali Hassan</p><p className="text-xs text-slate-500">+92 300 1234567</p></div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200"><Fingerprint className="h-3 w-3" /> Verified</span>
            </div>
            <div className="mt-6 rounded-2xl bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 p-5 text-white shadow-inner">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-blue-200">Wallet balance</p>
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">Rs. 45,200</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-300"><TrendingUp className="h-3 w-3" /> +12.5% this month</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"><p className="text-[11px] text-slate-500">Sent today</p><p className="mt-0.5 text-sm font-bold text-slate-900">Rs. 5,000</p></div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"><p className="text-[11px] text-slate-500">Received</p><p className="mt-0.5 text-sm font-bold text-emerald-600">+ Rs. 12,000</p></div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">Recent activity</p>
                <a href="#" className="text-[11px] font-medium text-blue-600">View all</a>
              </div>
              <ul className="space-y-2.5">
                {[["Ahmed Khan","2:45 PM","-Rs. 2,000","text-rose-600","from-blue-100 to-blue-200 text-blue-700"],["Sara Ali","1:12 PM","+Rs. 5,500","text-emerald-600","from-emerald-100 to-emerald-200 text-emerald-700"],["Bilal Shah","11:30 AM","-Rs. 1,200","text-rose-600","from-amber-100 to-orange-200 text-amber-700"]].map(([n,time,a,c,av]) => (
                  <li key={n} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br ${av} text-[11px] font-semibold`}>{n.split(" ").map((s:string) => s[0]).join("")}</div>
                      <div><p className="text-sm font-medium text-slate-800">{n}</p><p className="text-[11px] text-slate-500">{time}</p></div>
                    </div>
                    <span className={`text-sm font-semibold ${c}`}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="mt-5 w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-5 shadow-md shadow-blue-600/25">
              Send money <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
