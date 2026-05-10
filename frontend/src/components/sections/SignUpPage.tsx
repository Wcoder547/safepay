import { useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, User, Mail, Hash, Shield, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/useAuth";

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [cnic, setCnic]                 = useState("");
  const [form, setForm]                 = useState({
    full_name: "",
    email:     "",
    phone:     "",
    password:  "",
    pin:       "",
  });

  const { mutate: register, isPending, isError, error } = useRegister();

  // ── CNIC auto-formatter ──────────────────────
  const formatCNIC = useCallback((value: string) => {
    const n = value.replace(/\D/g, "");
    let f = "";
    if (n.length > 0)  f = n.slice(0, 5);
    if (n.length > 5)  f += "-" + n.slice(5, 12);
    if (n.length > 12) f += "-" + n.slice(12, 13);
    return f;
  }, []);

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCnic(formatCNIC(raw));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // ── Extract API error message ────────────────
  const getErrorMessage = () => {
  if (!error) return null;
  const err = error as any;
  console.log("Full error:", err?.response?.data); // ← add this
  const apiError = err?.response?.data?.error;
  if (apiError?.fields) {
    const firstField = Object.values(apiError.fields)[0];
    return firstField as string;
  }
  return apiError?.message || "Something went wrong.";
};

  // ── Submit ───────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register({
      full_name: form.full_name,
      email:     form.email,
      phone:     `0${form.phone}`,   // +92 prefix stripped → add 0 back
      cnic,
      password:  form.password,
      pin:       form.pin,
    });
  };

 const isFormValid =
  form.full_name.trim() &&
  form.email.trim() &&
  form.phone.trim() &&
  cnic.replace(/\D/g, "").length === 13 &&
  form.password.trim() &&
  form.pin.length === 4;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Back Button */}
      <Link
        to="/"
        className="group absolute left-6 top-6 p-3 bg-white/80 backdrop-blur-sm border border-white/50 hover:border-slate-200/70 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-x-1 transition-all duration-300 z-50"
      >
        <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
      </Link>

      <div className="relative z-10 w-full max-w-sm">
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Get Started
            </h1>
            <p className="text-slate-500 text-sm">Create your account in seconds</p>
          </div>

          {/* API Error Banner */}
          {isError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <p className="text-sm font-medium text-rose-700">{getErrorMessage()}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
              <div className="group relative">
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Waseem Akram"
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400"
                  required
                />
                <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400"
                  required
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
              <div className="flex overflow-hidden rounded-2xl border-2 border-slate-200/60 bg-white/70 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
                <span className="flex items-center border-r border-slate-200 bg-white/50 px-4 text-sm font-semibold text-slate-600">
                  +92
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  placeholder="3431077698"
                  className="flex-1 bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* CNIC */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">CNIC</label>
              <div className="group relative">
                <input
                  type="text"
                  value={cnic}
                  onChange={handleCnicChange}
                  placeholder="38405-5723074-1"
                  maxLength={15}
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400 font-mono tracking-wider"
                  required
                />
                <Hash className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                {cnic.length === 15 && (
                  <span className="absolute right-14 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-emerald-500">
                    ✓ Valid
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars with special character"
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="h-5 w-5" />
                    : <Eye    className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                4-Digit Transaction PIN
              </label>
              <div className="group relative">
                <input
                  type="password"
                  name="pin"
                  value={form.pin}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  inputMode="numeric"
                  placeholder="••••"
                  maxLength={4}
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400 text-center tracking-[0.5em] font-mono"
                  required
                />
                <Shield className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 px-1">
                Used to confirm every money transfer
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className="group relative w-full h-13 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl text-xs text-slate-500 shadow-lg">
            🔒 Protected with enterprise-grade security
          </div>
        </div>
      </div>
    </div>
  );
}