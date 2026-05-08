import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/components/sections/SignInPage";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});
