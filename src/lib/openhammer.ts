export const OPENHAMMER_DEFAULT_URL = "https://openhammer-mcp-production.up.railway.app/mcp";

export class OpenHammerError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "OpenHammerError";
    this.status = status;
  }
}

export type OpenHammerUnitSummary = {
  id: string;
  name: string;
  pointsBase: number;
  minModels: number;
};

export function getOpenHammerUrl(): string {
  const fromEnv = process.env.OPENHAMMER_MCP_URL?.trim();
  return fromEnv || OPENHAMMER_DEFAULT_URL;
}

export function parseSseJsonRpc(body: string): unknown {
  const line = body.split(/\r?\n/).find((entry) => entry.startsWith("data: "));
  if (!line) {
    throw new OpenHammerError("Datasheet service unavailable");
  }
  try {
    return JSON.parse(line.slice(6));
  } catch {
    throw new OpenHammerError("Datasheet service unavailable");
  }
}

export function extractToolResult(rpc: unknown): unknown {
  const result = (rpc as { result?: { structuredContent?: { result?: unknown }; content?: unknown } })
    ?.result;
  if (result?.structuredContent && "result" in result.structuredContent) {
    return result.structuredContent.result;
  }
  const content = result?.content;
  if (Array.isArray(content) && content.length === 1 && content[0]?.type === "text") {
    const text = String(content[0].text ?? "");
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  if (Array.isArray(content)) {
    return content.map((item: { text?: string }) => {
      try {
        return JSON.parse(String(item?.text ?? ""));
      } catch {
        return item?.text;
      }
    });
  }
  if ((rpc as { error?: { message?: string } })?.error) {
    throw new OpenHammerError("Datasheet service unavailable");
  }
  return result;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

async function mcpPost(
  fetchImpl: FetchLike,
  body: unknown,
  sessionId?: string
): Promise<{ sessionId: string; rpc: unknown; status: number }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    "MCP-Protocol-Version": "2025-03-26",
  };
  if (sessionId) headers["mcp-session-id"] = sessionId;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  let response: Response;
  try {
    response = await fetchImpl(getOpenHammerUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new OpenHammerError("Datasheet service unavailable");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok && response.status !== 202) {
    throw new OpenHammerError("Datasheet service unavailable");
  }

  const nextSession = response.headers.get("mcp-session-id") ?? sessionId ?? "";
  const text = await response.text();
  const rpc = text ? parseSseJsonRpc(text) : {};
  return { sessionId: nextSession, rpc, status: response.status };
}

export async function callOpenHammerTool(
  name: string,
  args: Record<string, unknown>,
  fetchImpl: FetchLike = fetch as FetchLike
): Promise<unknown> {
  const initialized = await mcpPost(fetchImpl, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "crusade-tracker", version: "0.1.0" },
    },
  });

  await mcpPost(
    fetchImpl,
    { jsonrpc: "2.0", method: "notifications/initialized" },
    initialized.sessionId
  );

  const called = await mcpPost(
    fetchImpl,
    {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name, arguments: args },
    },
    initialized.sessionId
  );

  return extractToolResult(called.rpc);
}

export function summarizeUnit(raw: unknown): OpenHammerUnitSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const unit = raw as {
    id?: string;
    name?: string;
    points?: { base?: number };
    composition?: { min_models?: number };
  };
  if (!unit.id || !unit.name) return null;
  const pointsBase = Number(unit.points?.base ?? 0);
  const minModels = Number(unit.composition?.min_models ?? 0);
  return {
    id: String(unit.id),
    name: String(unit.name),
    pointsBase: Number.isFinite(pointsBase) ? pointsBase : 0,
    minModels: Number.isFinite(minModels) ? minModels : 0,
  };
}
