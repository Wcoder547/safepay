import { useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, User, Mail,  Hash, Shield,  ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading] = useState(false);
  const [cnic, setCnic] = useState("");

  const formatCNIC = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, "");
    let formatted = "";
    if (numbers.length > 0) formatted = numbers.slice(0, 5);
    if (numbers.length > 5) formatted += "-" + numbers.slice(5, 12);
    if (numbers.length > 12) formatted += "-" + numbers.slice(12, 13);
    return formatted;
  }, []);

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formatted = formatCNIC(rawValue);
    setCnic(formatted);
  };

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
        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Get Started
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Create your account in seconds
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">Full Name</label>
              <div className="group relative">
                <input
                  type="text"
                  placeholder="Waseem Akram"
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm placeholder:text-slate-400 peer"
                  required
                />
                <User className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="group relative">
                <input
                  type="email"
                  placeholder="mw5667155@gmail.com"
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm placeholder:text-slate-400 peer"
                  required
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">Phone Number</label>
              <div className="flex overflow-hidden rounded-2xl border-2 border-slate-200/60 bg-white/70 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300 group">
                <span className="flex items-center border-r border-slate-200 bg-white/50 px-4 text-sm font-semibold text-slate-600">
                  +92
                </span>
                <input
                  type="tel"
                  placeholder="3431077698"
                  className="flex-1 bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* CNIC - Auto-formatted */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">CNIC</label>
              <div className="group relative">
                <input
                  type="text"
                  value={cnic}
                  onChange={handleCnicChange}
                  placeholder="38405-5723074-1"
                  maxLength={14}
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm placeholder:text-slate-400 peer font-mono tracking-wider"
                  required
                />
                <Hash className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                {cnic.length === 13 && (
                  <div className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-emerald-500 font-medium">
                    ✓ Valid
                  </div>
                )}
              </div>
            
            </div>

            {/* Password */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">Password</label>
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create strong password"
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm placeholder:text-slate-400 peer"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 group-focus-within:text-blue-500 transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* PIN */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">4-Digit PIN</label>
              <div className="group relative">
                <input
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm placeholder:text-slate-400 peer text-center tracking-wider font-mono"
                  required
                />
                <Shield className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-2">
              <div />
              <Button 
                type="submit"
                disabled={isLoading || cnic.length !== 13}
                className="group relative overflow-hidden h-14 px-8 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2 relative z-10">
                  {isLoading ? "Creating..." : "Create Account"}
                  <ArrowRight className={`h-5 w-5 transition-transform ${isLoading ? '' : 'group-hover:translate-x-1'}`} />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link 
              to="/sign-in" 
              className="font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl text-xs text-slate-500 shadow-lg">
            🔒 Protected with enterprise-grade security
          </div>
        </div>
      </div>
    </div>
  );
}