import { SignUp } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/pulse-api";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  if (!clerkConfigured) {
    redirect("/app");
  }
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
