# OpenHammer Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let players set optional edition and faction on a force, link units to OpenHammer datasheets via `type`, and show live datasheets on the unit page.

**Architecture:** Express stores `edition`, `faction`, and datasheet ids only. Next.js BFF speaks MCP Streamable HTTP to OpenHammer. The browser never calls Railway; Mongo never stores full datasheets.

**Tech Stack:** Next.js 15, React 19, TypeScript, Express ESM, MongoDB driver, Node test runner, OpenHammer MCP (`2025-03-26`).

## Global Constraints

- Never read `.env` files.
- Persist crusade data only through Express (`API_URL`); do not connect Next.js to MongoDB.
- OpenHammer URL: `process.env.OPENHAMMER_MCP_URL` or default `https://openhammer-mcp-production.up.railway.app/mcp`.
- Linked `type` pattern: `/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/i`.
- Lock error body: `{ error: "Unlink units before changing edition or faction" }` with HTTP 409.
- Overwrite on link: `name` ← datasheet `name`, `pointsValue` ← `points.base`, `modelCount` ← `composition.min_models`, `type` ← datasheet `id`.
- Do not add edition/faction or datasheet picker to force create (`ForceForm.tsx`).
- Two git repos: commit API work in `crusade-tracker-api`, frontend work in `crusade-tracker`. Do not push.
- Prettier: frontend 2-space, double quotes; API single quotes in `.mjs`.

## File map

| File | Responsibility |
|------|----------------|
| `crusade-tracker-api/lib/codexLock.mjs` | Datasheet-id pattern, lock decision |
| `crusade-tracker-api/lib/codexLock.test.mjs` | Lock unit tests |
| `crusade-tracker-api/routes/forces.mjs` | Persist edition/faction; enforce lock on PATCH |
| `crusade-tracker/src/lib/openhammer.ts` | MCP session + tool calls |
| `crusade-tracker/src/lib/openhammer.test.ts` | Fake-fetch MCP tests |
| `crusade-tracker/src/lib/codex.ts` | `forceHasCodex`, `isLinkedUnitType`, overwrite helper |
| `crusade-tracker/src/app/api/openhammer/**` | BFF HTTP |
| `crusade-tracker/src/types.d.ts` | `edition`, `faction` on Force |
| `crusade-tracker/src/app/schema.ts` | Zod for edition/faction |
| `crusade-tracker/src/app/actions.ts` | PATCH edition/faction |
| `crusade-tracker/src/components/ForceEditForm.tsx` | Edition/faction fields |
| `crusade-tracker/src/components/ForceDetails.tsx` | Header + pass Codex into quick-add |
| `crusade-tracker/src/components/DatasheetPicker.tsx` | Search/select/unlink |
| `crusade-tracker/src/components/UnitFormFields.tsx` | Picker instead of Type input |
| `crusade-tracker/src/components/UnitQuickActions.tsx` | Codex props |
| `crusade-tracker/src/components/UnitEditForm.tsx` | Codex props |
| `crusade-tracker/src/components/UnitPage.tsx` | Live datasheet panel |
| `crusade-tracker/src/app/forces/[id]/edit/page.tsx` | Pass edition/faction |
| `crusade-tracker/src/app/forces/[id]/units/[unitId]/page.tsx` | Pass Codex + fetch datasheet |
| `AGENTS.md` | `OPENHAMMER_MCP_URL` |

---

### Task 1: Codex lock helper (API)

**Files:**
- Create: `crusade-tracker-api/lib/codexLock.mjs`
- Create: `crusade-tracker-api/lib/codexLock.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `export const DATASHEET_ID_RE = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/i;`
  - `export function isLinkedUnitType(type): boolean`
  - `export function hasLinkedUnits(units): boolean`
  - `export function shouldBlockCodexChange({ currentEdition, currentFaction, nextEdition, nextFaction, units }): boolean`
  - `export const CODEX_LOCK_ERROR = "Unlink units before changing edition or faction";`

- [ ] **Step 1: Write the failing test**

Create `crusade-tracker-api/lib/codexLock.test.mjs`:

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isLinkedUnitType,
  hasLinkedUnits,
  shouldBlockCodexChange,
} from './codexLock.mjs';

test('treats OpenHammer ids as linked', () => {
  assert.equal(isLinkedUnitType('8da0-4570-c3c-819f'), true);
  assert.equal(isLinkedUnitType('Infantry'), false);
  assert.equal(isLinkedUnitType(''), false);
  assert.equal(isLinkedUnitType(undefined), false);
});

test('hasLinkedUnits is true only for id-pattern types', () => {
  assert.equal(hasLinkedUnits([{ type: 'Infantry' }, { type: '' }]), false);
  assert.equal(hasLinkedUnits([{ type: '8da0-4570-c3c-819f' }]), true);
});

test('does not block when edition and faction are unchanged', () => {
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: '10e',
      nextFaction: 'Space Marines',
      units: [{ type: '8da0-4570-c3c-819f' }],
    }),
    false
  );
});

test('blocks edition or faction change when a unit is linked', () => {
  const units = [{ type: '8da0-4570-c3c-819f' }];
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: '11e',
      nextFaction: 'Space Marines',
      units,
    }),
    true
  );
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: '10e',
      nextFaction: 'Adepta Sororitas',
      units,
    }),
    true
  );
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: '',
      nextFaction: '',
      units,
    }),
    true
  );
});

test('allows change when no unit is linked', () => {
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: '11e',
      nextFaction: 'Orks',
      units: [{ type: 'Infantry' }, { type: '' }],
    }),
    false
  );
});

test('ignores omitted next fields', () => {
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: undefined,
      nextFaction: 'Orks',
      units: [{ type: '8da0-4570-c3c-819f' }],
    }),
    true
  );
  assert.equal(
    shouldBlockCodexChange({
      currentEdition: '10e',
      currentFaction: 'Space Marines',
      nextEdition: undefined,
      nextFaction: undefined,
      units: [{ type: '8da0-4570-c3c-819f' }],
    }),
    false
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run from `crusade-tracker-api`:

```bash
node --test lib/codexLock.test.mjs
```

Expected: FAIL (`ERR_MODULE_NOT_FOUND` for `./codexLock.mjs`).

- [ ] **Step 3: Write minimal implementation**

Create `crusade-tracker-api/lib/codexLock.mjs`:

```js
export const DATASHEET_ID_RE = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/i;

export const CODEX_LOCK_ERROR = 'Unlink units before changing edition or faction';

export function isLinkedUnitType(type) {
  return DATASHEET_ID_RE.test(String(type ?? ''));
}

export function hasLinkedUnits(units) {
  if (!Array.isArray(units)) return false;
  return units.some((unit) => isLinkedUnitType(unit?.type));
}

export function shouldBlockCodexChange({
  currentEdition,
  currentFaction,
  nextEdition,
  nextFaction,
  units,
}) {
  const editionChanging =
    nextEdition !== undefined && String(nextEdition) !== String(currentEdition ?? '');
  const factionChanging =
    nextFaction !== undefined && String(nextFaction) !== String(currentFaction ?? '');
  if (!editionChanging && !factionChanging) return false;
  return hasLinkedUnits(units);
}
```

- [ ] **Step 4: Run tests and make sure they pass**

```bash
node --test lib/codexLock.test.mjs
```

Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
cd crusade-tracker-api
git add lib/codexLock.mjs lib/codexLock.test.mjs
git commit -m "Add helper that locks force edition and faction while units are linked."
```

---

### Task 2: Persist edition and faction on force PATCH

**Files:**
- Modify: `crusade-tracker-api/routes/forces.mjs`

**Interfaces:**
- Consumes: `shouldBlockCodexChange`, `CODEX_LOCK_ERROR` from `../lib/codexLock.mjs`
- Produces: `PATCH /forces/:id` accepts `edition` and `faction`; 409 when lock fires. GET already returns stored fields.

Allowed editions after normalize: `""`, `"10e"`, `"11e"`.

- [ ] **Step 1: Add a focused test for normalize/validate if you extract it; otherwise skip extra file and cover lock via existing helper tests.** Do not add a live Mongo test. The lock helper is the tested core; this task wires it.

- [ ] **Step 2: Implement PATCH fields**

In `crusade-tracker-api/routes/forces.mjs`:

1. Add import:

```js
import { shouldBlockCodexChange, CODEX_LOCK_ERROR } from '../lib/codexLock.mjs';
```

2. After loading `existing` in `router.patch("/:id")`, load collection units (same query as `recalculateSupplyUsed`) **before** building `updates`, so lock sees current `type` values:

```js
const collectionUnits = await db
  .collection('units')
  .find({ forceId: forceObjectId })
  .toArray();
const embedded = (Array.isArray(existing.units) ? existing.units : []).filter(
  (entry) => !isObjectIdRef(entry) && typeof entry === 'object'
);
const unitsForLock = [...collectionUnits, ...embedded];
```

(`isObjectIdRef` is already imported from `resolveForceUnits.mjs`.)

3. Add a local normalizer in `forces.mjs` (keep it next to the handler):

```js
function normalizeEdition(value) {
  const edition = String(value ?? '').trim();
  if (edition === '' || edition === '10e' || edition === '11e') return edition;
  return null;
}

function normalizeFaction(value) {
  return String(value ?? '').trim();
}
```

4. Inside the handler, after other field copies and **before** `Object.keys(updates).length === 0`:

```js
    if (body.edition !== undefined) {
      const edition = normalizeEdition(body.edition);
      if (edition === null) {
        return res.status(400).json({ error: 'Invalid edition' });
      }
      updates.edition = edition;
    }

    if (body.faction !== undefined) {
      updates.faction = normalizeFaction(body.faction);
    }

    if (
      shouldBlockCodexChange({
        currentEdition: existing.edition ?? '',
        currentFaction: existing.faction ?? '',
        nextEdition: body.edition !== undefined ? updates.edition : undefined,
        nextFaction: body.faction !== undefined ? updates.faction : undefined,
        units: unitsForLock,
      })
    ) {
      return res.status(409).json({ error: CODEX_LOCK_ERROR });
    }
```

- [ ] **Step 3: Run lock tests again**

```bash
node --test lib/codexLock.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
cd crusade-tracker-api
git add routes/forces.mjs
git commit -m "Persist force edition and faction and reject Codex changes while units are linked."
```

---

### Task 3: OpenHammer MCP client (frontend)

**Files:**
- Create: `crusade-tracker/src/lib/openhammer.ts`
- Create: `crusade-tracker/src/lib/openhammer.test.ts`
- Modify: `crusade-tracker/package.json` (add `tsx` devDependency and `"test"` script)

**Interfaces:**
- Consumes: `fetch`, `OPENHAMMER_MCP_URL`
- Produces:
  - `export const OPENHAMMER_DEFAULT_URL = "https://openhammer-mcp-production.up.railway.app/mcp";`
  - `export class OpenHammerError extends Error { status: number }`
  - `export function getOpenHammerUrl(): string`
  - `export function parseSseJsonRpc(body: string): unknown`
  - `export function extractToolResult(rpc: unknown): unknown`
  - `export async function callOpenHammerTool(name: string, args: Record<string, unknown>, fetchImpl?: typeof fetch): Promise<unknown>`
  - `export type OpenHammerUnitSummary = { id: string; name: string; pointsBase: number; minModels: number }`
  - `export function summarizeUnit(raw: unknown): OpenHammerUnitSummary | null`

- [ ] **Step 1: Add test script**

In `crusade-tracker/package.json` scripts add `"test": "tsx --test src/lib/openhammer.test.ts src/lib/codex.test.ts"` and add `"tsx": "^4.19.3"` to `devDependencies`. Run `npm install` in `crusade-tracker`.

- [ ] **Step 2: Write the failing test**

Create `crusade-tracker/src/lib/openhammer.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd crusade-tracker
npm test
```

Expected: FAIL (cannot find `./openhammer.ts`).

- [ ] **Step 4: Write `src/lib/openhammer.ts`**

```ts
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
```

If `tsx` fails to import `./openhammer.ts`, change the test import to `./openhammer.js` or `./openhammer` (no extension) until `npm test` runs.

- [ ] **Step 5: Run tests**

```bash
cd crusade-tracker
npm test
```

Expected: PASS for `openhammer.test.ts` (codex.test.ts may still be missing until Task 5; if the glob fails, temporarily set `"test": "tsx --test src/lib/openhammer.test.ts"` and add `codex.test.ts` in Task 5).

- [ ] **Step 6: Commit**

```bash
cd crusade-tracker
git add package.json package-lock.json src/lib/openhammer.ts src/lib/openhammer.test.ts
git commit -m "Add OpenHammer MCP client with session handling and unit summary mapping."
```

---

### Task 4: OpenHammer BFF routes

**Files:**
- Create: `crusade-tracker/src/app/api/openhammer/editions/route.ts`
- Create: `crusade-tracker/src/app/api/openhammer/factions/route.ts`
- Create: `crusade-tracker/src/app/api/openhammer/units/route.ts`
- Create: `crusade-tracker/src/app/api/openhammer/units/[unitId]/route.ts`

**Interfaces:**
- Consumes: `callOpenHammerTool`, `OpenHammerError`, `summarizeUnit`
- Produces JSON:
  - GET `/api/openhammer/editions` → `{ editions: string[] }`
  - GET `/api/openhammer/factions?edition=` → `{ factions: { name: string; faction_type?: string; unit_count?: number }[] }`
  - GET `/api/openhammer/units?edition=&faction=&name=` → `{ units: OpenHammerUnitSummary[] }`
  - GET `/api/openhammer/units/[unitId]?edition=` → `{ unit: unknown }` full datasheet
  - 400 missing/invalid edition; 404 unknown unit; 502 `{ error: "Datasheet service unavailable" }`

Shared helper in `crusade-tracker/src/lib/openhammerHttp.ts`:

```ts
import { NextResponse } from "next/server";
import { OpenHammerError } from "@/lib/openhammer";

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function handleOpenHammerError(error: unknown): NextResponse {
  if (error instanceof OpenHammerError) {
    return jsonError("Datasheet service unavailable", error.status);
  }
  return jsonError("Datasheet service unavailable", 502);
}

export function parseEdition(value: string | null): string | null {
  if (value === "10e" || value === "11e") return value;
  return null;
}
```

`editions/route.ts`:

```ts
import { NextResponse } from "next/server";
import { callOpenHammerTool } from "@/lib/openhammer";
import { handleOpenHammerError } from "@/lib/openhammerHttp";

export async function GET() {
  try {
    const result = await callOpenHammerTool("list_editions", {});
    const editions = Array.isArray(result) ? result.map(String) : [];
    return NextResponse.json({ editions });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
```

`factions/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callOpenHammerTool } from "@/lib/openhammer";
import { handleOpenHammerError, jsonError, parseEdition } from "@/lib/openhammerHttp";

export async function GET(req: NextRequest) {
  const edition = parseEdition(req.nextUrl.searchParams.get("edition"));
  if (!edition) return jsonError("edition is required", 400);
  try {
    const result = await callOpenHammerTool("list_factions", { edition });
    const factions = Array.isArray(result) ? result : [];
    return NextResponse.json({ factions });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
```

`units/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callOpenHammerTool, summarizeUnit } from "@/lib/openhammer";
import { handleOpenHammerError, jsonError, parseEdition } from "@/lib/openhammerHttp";

export async function GET(req: NextRequest) {
  const edition = parseEdition(req.nextUrl.searchParams.get("edition"));
  const faction = req.nextUrl.searchParams.get("faction")?.trim() ?? "";
  const name = req.nextUrl.searchParams.get("name")?.trim() || undefined;
  if (!edition) return jsonError("edition is required", 400);
  if (!faction) return jsonError("faction is required", 400);
  try {
    const result = await callOpenHammerTool("search_units", {
      edition,
      faction,
      name: name ?? null,
      limit: 50,
    });
    const list = Array.isArray(result) ? result : [];
    const units = list.map(summarizeUnit).filter((unit): unit is NonNullable<typeof unit> => unit != null);
    return NextResponse.json({ units });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
```

`units/[unitId]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { callOpenHammerTool } from "@/lib/openhammer";
import { handleOpenHammerError, jsonError, parseEdition } from "@/lib/openhammerHttp";

type RouteContext = { params: Promise<{ unitId: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { unitId } = await params;
  const edition = parseEdition(req.nextUrl.searchParams.get("edition"));
  if (!edition) return jsonError("edition is required", 400);
  if (!unitId) return jsonError("unit id is required", 400);
  try {
    const result = await callOpenHammerTool("get_unit", { edition, unit_id: unitId });
    if (result == null || (typeof result === "object" && result !== null && "error" in result)) {
      return jsonError("datasheet not found", 404);
    }
    const unit = Array.isArray(result) ? result[0] : result;
    if (!unit) return jsonError("datasheet not found", 404);
    return NextResponse.json({ unit });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
```

- [ ] **Step 1: Create the four routes and `openhammerHttp.ts` as above**

- [ ] **Step 2: Run `npm test` in crusade-tracker**

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
cd crusade-tracker
git add src/lib/openhammerHttp.ts src/app/api/openhammer
git commit -m "Expose OpenHammer editions, factions, and units through Next.js API routes."
```

---

### Task 5: Types, Zod, updateForce, and Codex helpers

**Files:**
- Modify: `crusade-tracker/src/types.d.ts`
- Modify: `crusade-tracker/src/app/schema.ts`
- Modify: `crusade-tracker/src/app/actions.ts`
- Create: `crusade-tracker/src/lib/codex.ts`
- Create: `crusade-tracker/src/lib/codex.test.ts`
- Modify: `crusade-tracker/package.json` test script to include `codex.test.ts` if not already

**Interfaces:**
- Consumes: lock pattern identical to API
- Produces:
  - `Force.edition?: string; Force.faction?: string`
  - `forceSchema` optional `edition`, `faction`
  - `updateForce` PATCH includes them
  - `export function forceHasCodex(force: { edition?: string; faction?: string }): boolean`
  - `export function isLinkedUnitType(type?: string): boolean`
  - `export function applyDatasheetOverwrite<T extends Partial<Unit>>(unit: T, sheet: OpenHammerUnitSummary): T`

- [ ] **Step 1: Write `codex.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { applyDatasheetOverwrite, forceHasCodex, isLinkedUnitType } from "./codex.ts";

test("forceHasCodex requires edition and faction", () => {
  assert.equal(forceHasCodex({ edition: "10e", faction: "Space Marines" }), true);
  assert.equal(forceHasCodex({ edition: "10e", faction: "" }), false);
  assert.equal(forceHasCodex({ edition: "", faction: "Space Marines" }), false);
});

test("applyDatasheetOverwrite sets type, name, points, models", () => {
  const next = applyDatasheetOverwrite(
    { name: "Old", pointsValue: 1, modelCount: 1, type: "", xp: 3 },
    { id: "8da0-4570-c3c-819f", name: "Intercessor Squad", pointsBase: 80, minModels: 5 }
  );
  assert.equal(next.type, "8da0-4570-c3c-819f");
  assert.equal(next.name, "Intercessor Squad");
  assert.equal(next.pointsValue, 80);
  assert.equal(next.modelCount, 5);
  assert.equal(next.xp, 3);
});

test("isLinkedUnitType matches OpenHammer ids", () => {
  assert.equal(isLinkedUnitType("8da0-4570-c3c-819f"), true);
  assert.equal(isLinkedUnitType("Infantry"), false);
});
```

- [ ] **Step 2: Run tests (fail)**

```bash
cd crusade-tracker
npm test
```

Expected: FAIL missing `codex.ts`.

- [ ] **Step 3: Implement `codex.ts`**

```ts
import type { OpenHammerUnitSummary } from "./openhammer";

const DATASHEET_ID_RE = /^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/i;

export function isLinkedUnitType(type?: string): boolean {
  return DATASHEET_ID_RE.test(String(type ?? ""));
}

export function forceHasCodex(force: { edition?: string; faction?: string }): boolean {
  return (force.edition === "10e" || force.edition === "11e") && Boolean(force.faction?.trim());
}

export function applyDatasheetOverwrite<T extends Partial<Unit>>(
  unit: T,
  sheet: OpenHammerUnitSummary
): T {
  return {
    ...unit,
    type: sheet.id,
    name: sheet.name,
    pointsValue: sheet.pointsBase,
    modelCount: sheet.minModels,
  };
}
```

- [ ] **Step 4: Update types, schema, actions**

In `types.d.ts` add to `Force`:

```ts
  edition?: string;
  faction?: string;
```

In `schema.ts` add to `forceSchema`:

```ts
  edition: z.enum(["", "10e", "11e"]).optional(),
  faction: z.string().optional(),
```

In `updateForce` `safeParse` include:

```ts
    edition: formString(formData, "edition"),
    faction: formString(formData, "faction"),
```

Destructure `edition` and `faction` from `validated.data` and add them to the PATCH JSON body.

Handle 409:

```ts
      if (response.status === 409) {
        return { success: false, message: data?.error ?? "Unlink units before changing edition or faction" };
      }
```

- [ ] **Step 5: Run tests**

```bash
cd crusade-tracker
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd crusade-tracker
git add src/types.d.ts src/app/schema.ts src/app/actions.ts src/lib/codex.ts src/lib/codex.test.ts package.json
git commit -m "Store force Codex fields and map datasheet overwrites onto crusade units."
```

---

### Task 6: Force edit UI and detail header

**Files:**
- Modify: `crusade-tracker/src/components/ForceEditForm.tsx`
- Modify: `crusade-tracker/src/app/forces/[id]/edit/page.tsx`
- Modify: `crusade-tracker/src/components/ForceDetails.tsx`

**Interfaces:**
- Consumes: GET `/api/openhammer/editions`, GET `/api/openhammer/factions?edition=`, `isLinkedUnitType`, `forceHasCodex`
- Produces: Players can save optional edition/faction; controls disabled when any unit is linked.

- [ ] **Step 1: Pass `edition` and `faction` from the edit page into `ForceEditForm`**

```tsx
          edition={force.edition ?? ""}
          faction={force.faction ?? ""}
```

Extend `ForceEditFormProps` and `values` state with `edition` and `faction` strings.

- [ ] **Step 2: Add Codex fields to the form**

Client-fetch editions on mount (`fetch("/api/openhammer/editions")`). When `values.edition` is `10e` or `11e`, fetch factions. Use native `<select>` with the same parchment/brass classes as `Input`. Include hidden inputs `name="edition"` and `name="faction"` if using uncontrolled selects, or keep them controlled with `name` attributes so `FormData` includes them.

`const locked = units.some((unit) => isLinkedUnitType(unit.type));`

When `locked`, disable both selects and show: `Unlink units before changing edition or faction.`

Empty option value `""` for unset.

Changing edition to `""` must also set faction to `""`.

- [ ] **Step 3: Force details header**

After the force name heading, if `forceHasCodex(forceProps)` render:

```tsx
<p className="text-sm text-ink/60 mb-4">{forceProps.edition} · {forceProps.faction}</p>
```

Pass `edition` and `faction` into `UnitQuickActions` (next task can land the prop types together; if compiling fails, add optional props now).

- [ ] **Step 4: `npx next lint` in crusade-tracker**

Expected: no new errors in touched files.

- [ ] **Step 5: Commit**

```bash
cd crusade-tracker
git add src/components/ForceEditForm.tsx src/app/forces/[id]/edit/page.tsx src/components/ForceDetails.tsx
git commit -m "Let players set force edition and faction from the Order of Battle edit page."
```

---

### Task 7: Datasheet picker on unit forms

**Files:**
- Create: `crusade-tracker/src/components/DatasheetPicker.tsx`
- Modify: `crusade-tracker/src/components/UnitFormFields.tsx`
- Modify: `crusade-tracker/src/components/UnitQuickActions.tsx`
- Modify: `crusade-tracker/src/components/UnitEditForm.tsx`
- Modify: `crusade-tracker/src/components/ForceDetails.tsx` (pass Codex into quick-add)

**Interfaces:**
- Consumes: `OpenHammerUnitSummary`, `applyDatasheetOverwrite`, `forceHasCodex`, `isLinkedUnitType`, GET `/api/openhammer/units`
- Produces: On Codex forces, picking a datasheet overwrites name/points/models/`type`; unlink clears `type` only. No free-text Type field. Force create is unchanged.

`DatasheetPicker` props:

```ts
type DatasheetPickerProps = {
  edition: string;
  faction: string;
  typeValue: string;
  disabled?: boolean;
  onLinked: (sheet: OpenHammerUnitSummary) => void;
  onUnlink: () => void;
};
```

Behavior:

- Search input (local state). Debounce 300ms. Fetch `/api/openhammer/units?edition=&faction=&name=`.
- Show up to 50 results as buttons. Click calls `onLinked(sheet)`.
- If `isLinkedUnitType(typeValue)`, show `Linked` plus an Unlink button calling `onUnlink`.
- On fetch error, show `Datasheet service unavailable` with a Retry button; name/points/models remain editable.

`UnitFormFields` add optional:

```ts
  hasCodex?: boolean;
  edition?: string;
  faction?: string;
  onDatasheetLinked?: (sheet: OpenHammerUnitSummary) => void;
  onDatasheetUnlink?: () => void;
```

Remove the Type `<Input>` from create and fullEdit modes. For `quickAdd`, keep name/models/points. When `hasCodex`, render `DatasheetPicker` in `col-span-12` **above** those fields, plus hidden `<input name="type" value={values.type ?? ""} />`.

When `!hasCodex`, still output hidden `type` as `""` (do not keep legacy free-text).

`UnitQuickActions` / `UnitEditForm` `onDatasheetLinked`:

```ts
setDraft((d) => applyDatasheetOverwrite(d, sheet));
```

Unlink:

```ts
setDraft((d) => ({ ...d, type: "" }));
```

Same for `UnitEditForm` `values`.

`ForceDetails` → `UnitQuickActions`:

```tsx
        edition={forceProps.edition ?? ""}
        faction={forceProps.faction ?? ""}
```

`UnitQuickActions` `hasCodex={forceHasCodex({ edition, faction })}`.

Unit detail page must pass edition/faction into `UnitPage` → `UnitEditForm` (Task 8 can pass them; add props in this task so edit form compiles).

- [ ] **Step 1: Implement picker + wire forms as above. Do not modify `ForceForm.tsx`.**

- [ ] **Step 2: Lint**

```bash
cd crusade-tracker
npx next lint
```

Expected: clean for new files.

- [ ] **Step 3: Commit**

```bash
cd crusade-tracker
git add src/components/DatasheetPicker.tsx src/components/UnitFormFields.tsx src/components/UnitQuickActions.tsx src/components/UnitEditForm.tsx src/components/ForceDetails.tsx src/components/UnitPage.tsx src/app/forces/[id]/units/[unitId]/page.tsx
git commit -m "Replace free-text unit type with an OpenHammer datasheet picker."
```

---

### Task 8: Live datasheet on the unit page

**Files:**
- Modify: `crusade-tracker/src/app/forces/[id]/units/[unitId]/page.tsx`
- Modify: `crusade-tracker/src/components/UnitPage.tsx`
- Create: `crusade-tracker/src/components/DatasheetPanel.tsx`

**Interfaces:**
- Consumes: `fetchSiteApi('/api/openhammer/units/${type}?edition=')`, `isLinkedUnitType`, `forceHasCodex`
- Produces: Crusade stats always; datasheet below when linked; errors non-blocking.

On the server page, after loading force:

```ts
  const edition = String(force.edition ?? "");
  const faction = String(force.faction ?? "");
  let datasheet: unknown = null;
  let datasheetError: string | null = null;

  if (forceHasCodex({ edition, faction }) && isLinkedUnitType(unit.type)) {
    const sheetRes = await fetchSiteApi(
      `/api/openhammer/units/${encodeURIComponent(unit.type ?? "")}?edition=${encodeURIComponent(edition)}`
    );
    if (sheetRes.status === 404) {
      datasheetError = "datasheet not found";
    } else if (!sheetRes.ok) {
      datasheetError = "datasheet unavailable";
    } else {
      const payload = await sheetRes.json();
      datasheet = payload.unit ?? null;
    }
  }
```

Pass `edition`, `faction`, `datasheet`, `datasheetError` into `UnitPage`.

`UnitPage`: remove `StatBlock label="Type"`. Do not show the raw id.

`DatasheetPanel`: if `datasheetError`, show that sentence in `text-ink/50`. If `datasheet` object, show:

- Name heading from `datasheet.name`
- Stats row from `datasheet.stats` keys
- Ranged then melee weapon tables (`name`, Range, A, BS/WS, S, AP, D, Keywords)
- Abilities (`name` + `description`)
- Special rules list
- Keywords list

If unlinked, render nothing.

Wire `UnitEditForm` Codex props from `UnitPage`.

- [ ] **Step 1: Implement panel + server fetch**

- [ ] **Step 2: Lint**

```bash
cd crusade-tracker
npx next lint
```

- [ ] **Step 3: Commit**

```bash
cd crusade-tracker
git add src/components/DatasheetPanel.tsx src/components/UnitPage.tsx src/app/forces/[id]/units/[unitId]/page.tsx src/components/UnitEditForm.tsx
git commit -m "Show live OpenHammer datasheets on linked crusade units."
```

---

### Task 9: Agent guide and lint

**Files:**
- Modify: `C:\Users\roberts\Documents\crusade\AGENTS.md` (workspace guide; not a git repo — edit in place, do not commit)

Add this row to the Environment variables table:

```
| `OPENHAMMER_MCP_URL` | Next.js OpenHammer BFF | MCP Streamable HTTP endpoint (default `https://openhammer-mcp-production.up.railway.app/mcp`) |
```

Update Domain Model: Force may include `edition` and `faction`. Unit `type` is the OpenHammer unit id when linked.

- [ ] **Step 1: Edit AGENTS.md as above**

- [ ] **Step 2: API lint**

```bash
cd crusade-tracker-api
npm run lint
```

Expected: pass, or only pre-existing issues in files this work did not touch. Fix lint in files you changed.

- [ ] **Step 3: Frontend lint**

```bash
cd crusade-tracker
npx next lint
```

Expected: pass for the new OpenHammer files.

- [ ] **Step 4: No commit for AGENTS.md. If lint forced code edits, commit those in the matching repo with a message that names the lint fix.**

---

### Task 10: Browser verification

No new files.

- [ ] **Step 1: Run API `npm run dev` and frontend `npm run dev`.** Set `OPENHAMMER_MCP_URL` only if not using the default.

- [ ] **Step 2: Exercise the spec checklist**

1. Create force still has no Codex fields.
2. Edit force: set `10e` and a faction, save, header shows `10e · {faction}`.
3. Quick-add: pick a datasheet; name/points/models overwrite; add unit.
4. Unit page shows live datasheet; Type id is not shown.
5. Unlink on edit; datasheet gone; change faction; save succeeds.
6. Link again; edition/faction selects disabled.
7. If OpenHammer is stopped, picker and panel show unavailable; crusade stats remain.

- [ ] **Step 3: Do not commit unless verification prompted a fix; then commit the fix with a message that names the bug.**

---

## Self-review

**Spec coverage**

- Optional Codex on edit, not create — Tasks 6, 7 (`ForceForm` untouched)
- `type` as unit id + overwrite — Tasks 5, 7
- Lock 409 — Tasks 1–2, 6 UI, 5 action message
- BFF MCP — Tasks 3–4
- Live datasheet + non-blocking errors — Task 8
- Tests (lock + fake MCP) — Tasks 1, 3, 5
- AGENTS.md env — Task 9
- Browser checklist — Task 10
- Legacy type not a link — Tasks 1, 5, 7

**Placeholders:** none remaining after Task 5 test script note (resolve in Task 3 by including both test files or widening the script in Task 5).

**Types:** `OpenHammerUnitSummary`, `callOpenHammerTool`, `applyDatasheetOverwrite`, `CODEX_LOCK_ERROR` names are consistent across tasks.
