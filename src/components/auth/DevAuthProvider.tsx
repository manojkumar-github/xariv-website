"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "xariv-dev-auth";

type DevUser = {
  id: string;
  email: string;
  name: string;
};

type DevAuthContextValue = {
  user: DevUser | null;
  token: string | null;
  signIn: (name?: string) => void;
  signOut: () => void;
};

const DevAuthContext = createContext<DevAuthContextValue | null>(null);

function tokenFor(user: DevUser) {
  return `dev:${user.id}:${user.email}`;
}

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DevUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as DevUser);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = useCallback((name = "Local Dev") => {
    const next: DevUser = {
      id: "local-dev",
      email: "dev@xariv.local",
      name,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token: user ? tokenFor(user) : null,
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  );

  return <DevAuthContext.Provider value={value}>{children}</DevAuthContext.Provider>;
}

export function useDevAuth() {
  const ctx = useContext(DevAuthContext);
  if (!ctx) throw new Error("useDevAuth must be used within DevAuthProvider");
  return ctx;
}
