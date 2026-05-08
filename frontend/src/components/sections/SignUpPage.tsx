import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-white flex items-center justify-center px-4 py-12">
      <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-20 h-[400px] w-[400px] rounded-full bg-indigo-300/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
              SP
            </div>
            <span className="text-lg font-semibold text-slate-900">SafePay</span>
          </Link>
          <p className="text-sm text-slate-500">Create your free account</p>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Get started</h1>
          <p className="mt-1 text-sm text-slate-500">Takes less than 2 minutes</p>

          <div className="mt-6 space-y-4">
            {/* Full name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                placeholder="Ali Hassan"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone number</label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <span className="flex items-center border-r border-slate-200 bg-white px-3 text-sm font-medium text-slate-500">+92</span>
                <input
                  type="tel"
                  placeholder="300 1234567"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* CNIC */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">CNIC</label>
              <input
                type="text"
                placeholder="35201-1234567-1"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-5 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/40 transition-all">
              Create account <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Perks */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">What you get</p>
            {["Zero transfer fees forever", "AI fraud protection on every transaction", "Instant transfers 24/7"].map((perk) => (
              <div key={perk} className="flex items-center gap-2 py-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} />
                </div>
                <span className="text-xs text-slate-600">{perk}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Shield className="h-3.5 w-3.5" /> Secured with bank-grade encryption
        </div>
      </div>
    </div>
  );
}
