import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/components/sections/SignUpPage";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});
