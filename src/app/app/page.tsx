"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSessionAuth } from "@/components/auth/AuthProviders";
import { pulseApi, type ExperimentSummary } from "@/lib/pulse-api";
import { ExperimentsTable } from "@/components/app/ExperimentsTable";

export default function AppHomePage() {
  const auth = useSessionAuth();
  const [rows, setRows] = useState<ExperimentSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!auth.isSignedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await auth.getToken();
      if (!token) throw new Error("No auth token");
      await pulseApi.me(token);
      const data = await pulseApi.listExperiments(token);
      setRows(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth.isLoaded) return;
    void load();
  }, [auth.isLoaded, auth.isSignedIn, load]);

  if (!auth.isLoaded) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!auth.isSignedIn) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-line bg-surface p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Your Pulse workspace</h1>
        <p className="mt-3 text-ink-soft">
          Sign in to queue local benchmarks, connect the CLI agent, and track results in a table.
        </p>
        {auth.mode === "dev" ? (
          <button
            type="button"
            onClick={() => auth.signInDev?.()}
            className="mt-6 rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white"
          >
            Continue with local dev auth
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white"
          >
            Sign in
          </Link>
        )}
        <p className="mt-4 text-xs text-muted">
          Control plane only — benchmarks run on your machine via{" "}
          <code className="rounded bg-code-bg px-1">xariv-pulse agent</code>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Experiments</h1>
          <p className="mt-2 text-ink-soft">
            {auth.email || auth.displayName} · private runs on your local agent
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Refresh
          </button>
          <Link
            href="/app/connect"
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Connect agent
          </Link>
          <Link
            href="/app/experiments/new"
            className="rounded-lg bg-cta-gradient px-4 py-2 text-sm font-medium text-white"
          >
            New experiment
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <p className="mt-2 text-xs">
            Is the Pulse API running at{" "}
            <code>{process.env.NEXT_PUBLIC_PULSE_API_URL || "http://localhost:8000"}</code>?
          </p>
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-muted">Loading experiments…</p>
        ) : (
          <ExperimentsTable rows={rows} />
        )}
      </div>
    </div>
  );
}
