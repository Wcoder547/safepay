import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/sections/LandingPage";
import { requireGuest } from "@/lib/guards";
  
export const Route = createFileRoute("/")({
   beforeLoad: requireGuest,
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "SafePay — Send money safely. Blocked before it hurts." },
      { name: "description", content: "SafePay uses real-time AI to detect fraud before every transaction. Instant transfers. Zero fees. Full peace of mind." },
    ],
  }),
});
