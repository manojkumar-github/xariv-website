import { SignIn } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/pulse-api";
import { redirect } from "next/navigation";

export default function SignInPage() {
  if (!clerkConfigured) {
    redirect("/app");
  }
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
