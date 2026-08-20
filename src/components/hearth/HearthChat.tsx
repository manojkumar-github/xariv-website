"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSessionAuth } from "@/components/auth/AuthProviders";
import { newMessage, relayChatStream, type ChatMessage } from "@/lib/relay-chat-stream";
import {
  pulseApi,
  type RelayCatalog,
  type RelayDeployment,
  type RelayModel,
} from "@/lib/pulse-api";

const SYSTEM_PROMPT =
  "You are a helpful assistant running entirely on the user's Mac. Be concise and clear.";

export function HearthChat() {
  const auth = useSessionAuth();
  const [catalog, setCatalog] = useState<RelayCatalog | null>(null);
  const [deploymentId, setDeploymentId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!auth.isSignedIn) return;
    const token = await auth.getToken();
    if (!token) return;
    const snap = await pulseApi.relayCatalog(token);
    setCatalog(snap);
    const running = snap.deployments.filter((d) => d.status === "running");
    setDeploymentId((prev) => {
      if (prev && running.some((d) => d.id === prev)) return prev;
      return running[0]?.id ?? "";
    });
  }, [auth]);

  useEffect(() => {
    if (!auth.isLoaded || !auth.isSignedIn) return;
    void load();
    const t = setInterval(() => void load(), 3000);
    return () => clearInterval(t);
  }, [auth.isLoaded, auth.isSignedIn, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const running = catalog?.deployments.filter((d) => d.status === "running") ?? [];
  const selected = running.find((d) => d.id === deploymentId);

  async function withToken<T>(fn: (token: string) => Promise<T>) {
    const token = await auth.getToken();
    if (!token) throw new Error("Sign in to chat locally");
    return fn(token);
  }

  async function quickDeploy(model: RelayModel) {
    setBusy(model.id);
    setError(null);
    try {
      await withToken((t) => pulseApi.relayDeploy(t, model.id, "llama.cpp", model.recommended_port));
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  }

  async function quickDownload(model: RelayModel) {
    setBusy(model.id);
    setError(null);
    try {
      await withToken((t) => pulseApi.relayDownload(t, model.id));
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(null);
    }
  }

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming || !deploymentId) return;

    setInput("");
    setError(null);
    const userMsg = newMessage("user", text);
    const assistantMsg = newMessage("assistant", "");
    const history = [...messages, userMsg];
    setMessages([...history, assistantMsg]);
    setStreaming(true);

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const body = await withToken((t) =>
        pulseApi.relayChat(t, deploymentId, {
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 512,
          stream: true,
        }),
      );

      let full = "";
      for await (const chunk of relayChatStream(body)) {
        full += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...assistantMsg, content: full };
          return next;
        });
      }
    } catch (err) {
      setError(String(err));
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }

  function newChat() {
    setMessages([]);
    setError(null);
  }

  if (!auth.isLoaded) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!auth.isSignedIn) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="text-ink-soft">Sign in to run a private chat on this Mac.</p>
        {auth.signInDev && (
          <button
            type="button"
            onClick={auth.signInDev}
            className="mt-4 rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white"
          >
            Dev sign in
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <SetupBanner catalog={catalog} running={running} onRefresh={() => void load()} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm">
            <span className="mr-2 text-xs font-semibold uppercase text-muted">Model</span>
            <select
              value={deploymentId}
              onChange={(e) => setDeploymentId(e.target.value)}
              disabled={streaming || running.length === 0}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm disabled:opacity-50"
            >
              {running.length === 0 && <option value="">No model running</option>}
              {running.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} · {d.variant} (:{d.port})
                </option>
              ))}
            </select>
          </label>
          {selected && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
              Local · llama.cpp
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={newChat}
            disabled={streaming}
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink-soft hover:text-ink disabled:opacity-50"
          >
            New chat
          </button>
          <Link
            href="/app/relay"
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Manage models
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {running.length === 0 ? (
        <QuickStart
          catalog={catalog}
          busy={busy}
          onDownload={(m) => void quickDownload(m)}
          onDeploy={(m) => void quickDeploy(m)}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto py-6">
            {messages.length === 0 && (
              <div className="mx-auto max-w-xl text-center">
                <p className="text-lg font-medium text-ink">Your AI runs on this Mac.</p>
                <p className="mt-2 text-sm text-muted">
                  Nothing leaves your machine. Ask anything — powered by{" "}
                  {selected?.name ?? "your local model"}.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    "Explain KV cache in one paragraph",
                    "Write a Python fibonacci function",
                    "Summarize why local AI matters",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={streaming}
                      onClick={() => {
                        setInput(s);
                      }}
                      className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft hover:border-accent/40 hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} streaming={streaming && m === messages[messages.length - 1]} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <form onSubmit={(e) => void send(e)} className="sticky bottom-0 border-t border-line bg-canvas-subtle pt-4">
            <div className="mx-auto flex max-w-3xl gap-2">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                disabled={streaming || !deploymentId}
                placeholder="Message your local model…"
                className="flex-1 resize-none rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim() || !deploymentId}
                className="self-end rounded-xl bg-cta-gradient px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {streaming ? "…" : "Send"}
              </button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted">
              Runs on localhost via Relay · data stays on your Mac
            </p>
          </form>
        </>
      )}
    </div>
  );
}

function MessageBubble({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-accent text-white"
            : "border border-line bg-surface text-ink-soft"
        }`}
      >
        {message.content || (streaming ? "…" : "")}
        {streaming && !isUser && message.content && (
          <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-accent" />
        )}
      </div>
    </div>
  );
}

function SetupBanner({
  catalog,
  running,
  onRefresh,
}: {
  catalog: RelayCatalog | null;
  running: RelayDeployment[];
  onRefresh: () => void;
}) {
  if (!catalog) return null;
  if (catalog.llama_server && running.length > 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {!catalog.llama_server ? (
        <>
          Install llama.cpp:{" "}
          <code className="rounded bg-white/80 px-1">brew install llama.cpp</code>
        </>
      ) : (
        <>
          No model server running. Pick a model below or{" "}
          <Link href="/app/relay" className="font-medium underline">
            deploy from Relay
          </Link>
          .{" "}
          <button type="button" onClick={onRefresh} className="font-medium underline">
            Refresh
          </button>
        </>
      )}
    </div>
  );
}

function QuickStart({
  catalog,
  busy,
  onDownload,
  onDeploy,
}: {
  catalog: RelayCatalog | null;
  busy: string | null;
  onDownload: (m: RelayModel) => void;
  onDeploy: (m: RelayModel) => void;
}) {
  const models = catalog?.models.filter((m) => m.params.includes("B")) ?? [];

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12">
      <p className="text-xl font-semibold text-ink">Start your local chat</p>
      <p className="mt-2 max-w-md text-center text-sm text-muted">
        Download a small open model (1–3B), deploy with llama.cpp, then chat — all on this Mac.
      </p>
      <div className="mt-8 grid w-full max-w-2xl gap-4 md:grid-cols-2">
        {models.map((m) => {
          const ready = m.local || m.artifact?.status === "ready";
          const downloading = m.artifact?.status === "downloading";
          return (
            <div key={m.id} className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <p className="font-semibold text-ink">{m.name}</p>
              <p className="text-sm text-ink-soft">{m.variant}</p>
              <p className="mt-1 text-xs text-muted">
                {m.params} · ~{m.approx_size_gb} GB
              </p>
              <button
                type="button"
                disabled={Boolean(busy) || downloading}
                onClick={() => (ready ? onDeploy(m) : onDownload(m))}
                className="mt-4 w-full rounded-lg bg-cta-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {downloading
                  ? `Downloading… ${Math.round(m.artifact?.progress_pct ?? 0)}%`
                  : ready
                    ? "Deploy & chat"
                    : "Download & prepare"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted">
        Fine-tune and publish your own models via Relay — coming soon.
      </p>
    </div>
  );
}
