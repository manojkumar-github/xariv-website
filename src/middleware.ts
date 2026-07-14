import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtected = createRouteMatcher(["/app(.*)"]);
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 10,
);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export default function middleware(req: NextRequest, event: unknown) {
  if (!clerkConfigured) {
    return NextResponse.next();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (clerkHandler as any)(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
