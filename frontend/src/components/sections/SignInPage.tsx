import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-2xl animate-ping" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="group relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-14 px-5 pr-12 rounded-2xl bg-white/70 border-2 border-slate-200/60 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-sm placeholder:text-slate-400 peer"
                  required
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.5 4.5L21 8V3h-6M3 8h6M21 8h-6" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">Password</label>
              <div className="group relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            {/* Forgot Password & Submit */}
            <div className="flex items-center justify-between pt-2">
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot Password?
              </a>
              <Button 
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden h-14 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2 relative z-10">
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className={`h-5 w-5 transition-transform ${isLoading ? '' : 'group-hover:translate-x-1'}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link 
              to="/sign-up" 
              className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Create one
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