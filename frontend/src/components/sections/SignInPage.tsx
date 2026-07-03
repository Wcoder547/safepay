import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, Eye, EyeOff, Mail,
  ArrowLeft, AlertTriangle, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useAuth";

export function SignInPage() {
  const [form, setForm]             = useState({ email: "", password: "" });
  const [showPassword, setShowPass] = useState(false);

  const {
    mutate:    login,
    isPending,
    isError,
    error,
  } = useLogin();

  // ── Extract API error ──────────────────────────
  const getErrorMessage = () => {
    if (!error) return null;
    const err = error as any;
    const apiError = err?.response?.data?.error;

    // Field-level validation errors
    if (apiError?.fields) {
      return Object.values(apiError.fields)[0] as string;
    }

   
    const codeMessages: Record<string, string> = {
      INVALID_CREDENTIALS: "Incorrect email or password. Please try again.",
      ACCOUNT_FROZEN:      "Your account has been frozen. Contact support.",
      VALIDATION_ERROR:    "Please fill in all required fields.",
    };

    const code = apiError?.code;
    if (code && codeMessages[code]) return codeMessages[code];

    return (
      apiError?.message ||
      err?.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;
    login({ email: form.email.trim(), password: form.password });
  };

  const isFormValid = form.email.trim() && form.password.trim();

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

          {/* ── Header ── */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">Sign in to your SafePay account</p>
          </div>

          {/* ── Error Banner ── */}
          {isError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <p className="text-sm font-medium text-rose-700">{getErrorMessage()}</p>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="group relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400 outline-none"
                  required
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot_password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <EyeOff className="h-5 w-5" />
                    : <Eye    className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* ── Submit ── */}
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className="group relative w-full h-13 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Sign In
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* ── Divider ── */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/60 px-3 text-xs font-medium text-slate-400">
                New to SafePay?
              </span>
            </div>
          </div>

          {/* ── Register CTA ── */}
          <Link to="/sign-up">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 border-slate-200 bg-white/50 text-slate-700 text-sm font-semibold hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              Create an account
            </Button>
          </Link>
        </div>

      
      </div>
    </div>
  );
}