/** Pulse control-plane API base URL (local FastAPI). */
export const pulseApiUrl =
  process.env.NEXT_PUBLIC_PULSE_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

/** When Clerk keys are absent, local Bearer dev:<id> auth is used. */
export const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 10,
);

export const devAuthEnabled =
  process.env.NEXT_PUBLIC_DEV_AUTH === "true" || !clerkConfigured;

export type ExperimentSummary = {
  id: string;
  name: string;
  status: string;
  target: string;
  workload_id: string;
  model_id: string;
  engine: string;
  inference_url: string | null;
  throughput_tps: number | null;
  ttft_p50_ms: number | null;
  latency_p99_ms: number | null;
  hardware_label: string | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export type ExperimentDetail = ExperimentSummary & {
  parameters: Record<string, unknown>;
  result_payload: Record<string, unknown> | null;
  claimed_by_agent_id: string | null;
};

export type MeResponse = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
};

export type AgentInfo = {
  id: string;
  name: string;
  status: string;
  hostname: string | null;
  last_seen_at: string | null;
  created_at: string;
};

export type CreateExperimentInput = {
  name: string;
  workload_id: string;
  model_id: string;
  engine: string;
  target?: "local";
  inference_url?: string | null;
  parameters?: Record<string, unknown>;
};

async function pulseFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${pulseApiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type RelayArtifact = {
  model_id: string;
  source: string;
  path: string;
  filename: string;
  bytes: number;
  status: string;
  progress_pct: number;
  error: string | null;
};

export type RelayModel = {
  id: string;
  name: string;
  variant: string;
  family: string;
  params: string;
  quant: string;
  quantized: boolean;
  hf_repo: string | null;
  hf_file: string;
  approx_size_gb: number;
  demo_role: string | null;
  recommended_port: number;
  notes: string;
  artifact: RelayArtifact | null;
  local: boolean;
};

export type RelayDeployment = {
  id: string;
  model_id: string;
  name: string;
  variant: string;
  framework: string;
  port: number;
  status: string;
  pid: number | null;
  openai_url: string;
  error: string | null;
  started_at: string | null;
  quantized: boolean;
};

export type RelayCatalog = {
  frameworks: { id: string; name: string; status: string; best_for: string; requires: string }[];
  models: RelayModel[];
  deployments: RelayDeployment[];
  llama_server: string | null;
  platform: string;
};

export const pulseApi = {
  me: (token: string) => pulseFetch<MeResponse>("/api/v1/me", token),
  listExperiments: (token: string) =>
    pulseFetch<ExperimentSummary[]>("/api/v1/experiments", token),
  getExperiment: (token: string, id: string) =>
    pulseFetch<ExperimentDetail>(`/api/v1/experiments/${id}`, token),
  createExperiment: (token: string, body: CreateExperimentInput) =>
    pulseFetch<ExperimentDetail>("/api/v1/experiments", token, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  cancelExperiment: (token: string, id: string) =>
    pulseFetch<ExperimentDetail>(`/api/v1/experiments/${id}/cancel`, token, {
      method: "POST",
    }),
  createConnectToken: (token: string, name = "local") =>
    pulseFetch<{
      agent_id: string;
      connect_token: string;
      expires_at: string;
      instructions: string;
    }>("/api/v1/agents/connect-token", token, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  listAgents: (token: string) => pulseFetch<AgentInfo[]>("/api/v1/agents", token),
  listWorkloads: async () => {
    const res = await fetch(`${pulseApiUrl}/api/v1/workloads`);
    if (!res.ok) throw new Error(`Failed to load workloads: ${res.status}`);
    return res.json() as Promise<{ workloads: { id: string; name: string; type: string }[] }>;
  },
  relayCatalog: (token: string) => pulseFetch<RelayCatalog>("/api/v1/relay/catalog", token),
  relayDownload: (token: string, model_id: string) =>
    pulseFetch<RelayArtifact>("/api/v1/relay/download", token, {
      method: "POST",
      body: JSON.stringify({ model_id }),
    }),
  relayImport: (token: string, path: string, name?: string) =>
    pulseFetch<RelayModel>("/api/v1/relay/import", token, {
      method: "POST",
      body: JSON.stringify({ path, name }),
    }),
  relayDeploy: (token: string, model_id: string, framework = "llama.cpp", port?: number) =>
    pulseFetch<RelayDeployment>("/api/v1/relay/deploy", token, {
      method: "POST",
      body: JSON.stringify({ model_id, framework, port }),
    }),
  relayStop: (token: string, deploymentId: string) =>
    pulseFetch<RelayDeployment>(`/api/v1/relay/deployments/${deploymentId}/stop`, token, {
      method: "POST",
    }),
};
