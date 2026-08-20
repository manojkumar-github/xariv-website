/** Parse OpenAI-style SSE chunks from Relay chat proxy. */
export async function* relayChatStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string, void, unknown> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop() ?? "";

      for (const line of parts) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload) as {
            choices?: { delta?: { content?: string } }[];
            error?: string;
          };
          if (json.error) throw new Error(json.error);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export function newMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, content };
}
