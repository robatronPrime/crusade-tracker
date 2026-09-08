import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseSseJsonRpc,
  extractToolResult,
  callOpenHammerTool,
  summarizeUnit,
  OpenHammerError,
} from "./openhammer.ts";

test("parseSseJsonRpc reads the data line", () => {
  const rpc = parseSseJsonRpc(
    'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"ok":true}}\n\n'
  );
  assert.deepEqual(rpc, { jsonrpc: "2.0", id: 1, result: { ok: true } });
});

test("extractToolResult prefers structuredContent.result", () => {
  assert.deepEqual(
    extractToolResult({
      result: { structuredContent: { result: ["10e", "11e"] }, content: [] },
    }),
    ["10e", "11e"]
  );
});

test("summarizeUnit maps points.base and min_models", () => {
  const summary = summarizeUnit({
    id: "8da0-4570-c3c-819f",
    name: "Intercessor Squad",
    points: { base: 80 },
    composition: { min_models: 5 },
  });
  assert.deepEqual(summary, {
    id: "8da0-4570-c3c-819f",
    name: "Intercessor Squad",
    pointsBase: 80,
    minModels: 5,
  });
});

test("callOpenHammerTool initializes a session then calls the tool", async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = async (url: string | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    if (calls.length === 1) {
      return new Response(
        'event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2025-03-26"}}\n\n',
        { status: 200, headers: { "mcp-session-id": "sess-1", "content-type": "text/event-stream" } }
      );
    }
    if (calls.length === 2) {
      return new Response("", { status: 202, headers: { "mcp-session-id": "sess-1" } });
    }
    return new Response(
      'event: message\ndata: {"jsonrpc":"2.0","id":3,"result":{"structuredContent":{"result":["10e"]}}}\n\n',
      { status: 200, headers: { "content-type": "text/event-stream" } }
    );
  };

  const result = await callOpenHammerTool("list_editions", {}, fetchImpl as typeof fetch);
  assert.deepEqual(result, ["10e"]);
  assert.equal(calls.length, 3);
  const thirdHeaders = new Headers(calls[2].init.headers);
  assert.equal(thirdHeaders.get("mcp-session-id"), "sess-1");
});

test("callOpenHammerTool maps HTTP failures to OpenHammerError", async () => {
  const fetchImpl = async () => new Response("nope", { status: 500 });
  await assert.rejects(
    () => callOpenHammerTool("list_editions", {}, fetchImpl as typeof fetch),
    (err: unknown) => err instanceof OpenHammerError && err.status === 502
  );
});
