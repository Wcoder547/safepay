import { Shield, Zap, Users, Globe, Award, ArrowRight, ArrowLeft, TrendingUp, Lock } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "2M+",   label: "Active Users"         },
  { value: "₨50B+", label: "Transactions Processed" },
  { value: "99.9%", label: "Uptime Guaranteed"     },
  { value: "<0.01%",label: "Fraud Rate"            },
];

const TEAM = [
  {
    name:  "Ahmed Raza",
    role:  "Chief Executive Officer",
    desc:  "15+ years in fintech. Previously at HBL Digital and Easypaisa.",
    initials: "AR",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name:  "Sana Mirza",
    role:  "Chief Technology Officer",
    desc:  "Built payment infrastructure at scale. Ex-Google, ex-Stripe.",
    initials: "SM",
    color: "from-violet-500 to-purple-600",
  },
  {
    name:  "Bilal Khan",
    role:  "Head of Risk & Compliance",
    desc:  "SBP-certified compliance expert. 10+ years in banking regulation.",
    initials: "BK",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name:  "Ayesha Noor",
    role:  "Head of Product",
    desc:  "Designed consumer fintech products used by millions across South Asia.",
    initials: "AN",
    color: "from-rose-500 to-pink-600",
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Security First",
    desc: "Every rupee you move is protected by bank-grade encryption and real-time AI fraud detection.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Zap,
    title: "Instant Everything",
    desc: "No waiting. No delays. Money moves the moment you send it, 24/7, even on holidays.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Users,
    title: "Built for Pakistan",
    desc: "Designed from the ground up for Pakistani users — Urdu support, local bank integrations, SBP compliant.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Globe,
    title: "Transparent & Fair",
    desc: "No hidden fees. No fine print. What you see is exactly what you pay — nothing more.",
    color: "bg-violet-100 text-violet-600",
  },
];

const MILESTONES = [
  { year: "2022", event: "SafePay founded in Karachi with a mission to modernize Pakistan's payments." },
  { year: "2023", event: "Secured SBP EMI license. Launched beta with 50,000 users." },
  { year: "2024", event: "Crossed 1 million active wallets. Launched AI fraud detection engine." },
  { year: "2025", event: "Expanded to 100+ bank integrations. ₨50B+ in annual transaction volume." },
  { year: "2026", event: "Live nationwide — Pakistan's most trusted digital wallet." },
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
        {/* bg glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>
        {/* Back button */}
        <button
          onClick={() => navigate({ to: "/" })}
          className="absolute left-6 top-6 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
            <Award className="h-3.5 w-3.5" /> About SafePay
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Pakistan's Smartest
            <br />
            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Digital Wallet
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            We started SafePay because sending money in Pakistan was too slow, too risky,
            and too complicated. We're fixing that — one transaction at a time.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-slate-100 bg-slate-50 px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-slate-900">{value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">Our Mission</p>
              <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                Financial freedom for every Pakistani
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-500">
                Millions of Pakistanis are underserved by traditional banking. SafePay bridges
                that gap — giving anyone with a smartphone access to instant, secure, and
                affordable financial services.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                We're licensed and regulated under State Bank of Pakistan guidelines, and we
                take that responsibility seriously. Your money is always safe with us.
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <Lock className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  Licensed & regulated under SBP guidelines
                </p>
              </div>
            </div>
            {/* Decorative card */}
            <div className="relative">
              <div className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-600/25">
                <TrendingUp className="mb-4 h-10 w-10 text-white/80" />
                <p className="text-2xl font-black text-white">₨50 Billion+</p>
                <p className="mt-1 text-sm font-medium text-blue-200">Processed in 2025 alone</p>
                <div className="mt-6 space-y-3">
                  {["Zero fraud losses for users", "24/7 transaction monitoring", "Instant dispute resolution"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <p className="text-sm font-medium text-blue-100">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl border border-blue-100 bg-white p-5 shadow-xl">
                <p className="text-xs font-semibold text-slate-500">Fraud Rate</p>
                <p className="mt-1 text-2xl font-black text-slate-900">&lt;0.01%</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">↓ Industry best</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">What we stand for</p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Our Core Values</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base font-bold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">Our Journey</p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 h-full w-px bg-slate-100" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="flex items-start gap-6">
                  <div className="flex w-16 shrink-0 items-center justify-center">
                    <span className="rounded-xl bg-blue-600 px-2.5 py-1.5 text-xs font-black text-white shadow-md shadow-blue-600/25">
                      {year}
                    </span>
                  </div>
                  <div className="relative flex-1 pb-2 pl-6">
                    <div className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full border-2 border-blue-600 bg-white" />
                    <p className="text-sm leading-relaxed text-slate-600">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">The People</p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Leadership Team</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {TEAM.map(({ name, role, desc, initials, color }) => (
              <div key={name} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${color} text-sm font-black text-white shadow-md`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{name}</p>
                  <p className="text-[11px] font-semibold text-blue-600">{role}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            Ready to experience SafePay?
          </h2>
          <p className="mt-4 text-base text-slate-500">
            Join over 2 million Pakistanis who trust SafePay for their daily transactions.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/sign-up">
              <Button className="h-12 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all">
                Create Free Account <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="h-12 rounded-2xl border-slate-200 px-8 text-sm font-semibold text-slate-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}