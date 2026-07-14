"use client";

import { useAuth, useUser, ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { clerkConfigured } from "@/lib/pulse-api";
import { DevAuthProvider, useDevAuth } from "@/components/auth/DevAuthProvider";

export type SessionAuth = {
  isLoaded: boolean;
  isSignedIn: boolean;
  displayName: string | null;
  email: string | null;
  getToken: () => Promise<string | null>;
  mode: "clerk" | "dev";
  /** Dev-only quick sign-in */
  signInDev?: () => void;
  signOutDev?: () => void;
};

const SessionAuthContext = createContext<SessionAuth | null>(null);

function ClerkSessionProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const getSessionToken = useCallback(async () => (await getToken()) ?? null, [getToken]);

  const value = useMemo<SessionAuth>(
    () => ({
      isLoaded,
      isSignedIn: Boolean(isSignedIn),
      displayName: user?.fullName || user?.username || null,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      getToken: getSessionToken,
      mode: "clerk",
    }),
    [isLoaded, isSignedIn, user, getSessionToken],
  );

  return <SessionAuthContext.Provider value={value}>{children}</SessionAuthContext.Provider>;
}

function DevSessionProvider({ children }: { children: ReactNode }) {
  const dev = useDevAuth();
  const value = useMemo<SessionAuth>(
    () => ({
      isLoaded: true,
      isSignedIn: Boolean(dev.user),
      displayName: dev.user?.name ?? null,
      email: dev.user?.email ?? null,
      getToken: async () => dev.token,
      mode: "dev",
      signInDev: () => dev.signIn(),
      signOutDev: () => dev.signOut(),
    }),
    [dev],
  );
  return <SessionAuthContext.Provider value={value}>{children}</SessionAuthContext.Provider>;
}

export function AuthProviders({ children }: { children: ReactNode }) {
  if (clerkConfigured) {
    return (
      <ClerkProvider>
        <ClerkSessionProvider>{children}</ClerkSessionProvider>
      </ClerkProvider>
    );
  }

  return (
    <DevAuthProvider>
      <DevSessionProvider>{children}</DevSessionProvider>
    </DevAuthProvider>
  );
}

export function useSessionAuth(): SessionAuth {
  const ctx = useContext(SessionAuthContext);
  if (!ctx) throw new Error("useSessionAuth must be used within AuthProviders");
  return ctx;
}

export function AuthControls() {
  const auth = useSessionAuth();

  if (auth.mode === "clerk") {
    return (
      <div className="flex items-center gap-2">
        {auth.isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:text-ink"
            >
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
    );
  }

  if (auth.isSignedIn) {
    return (
      <button
        type="button"
        onClick={() => auth.signOutDev?.()}
        className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:text-ink"
      >
        {auth.displayName || "Account"} · Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => auth.signInDev?.()}
      className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:text-ink"
    >
      Dev sign in
    </button>
  );
}

export { SignInButton };
