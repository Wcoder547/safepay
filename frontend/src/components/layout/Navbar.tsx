import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-blue-600/30">
            SP
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">SafePay</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {["Home", "Features", "How it works", "Security"].map((l) => (
            <a key={l} href="#" className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/sign-in" className="hidden text-sm font-medium text-slate-700 hover:text-slate-900 sm:inline">Sign in</Link>
          <Link to="/sign-up">
            <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/40 transition-all">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
