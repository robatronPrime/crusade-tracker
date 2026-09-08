# OpenHammer integration

Date: 2026-09-08  
Branch: `feat/openhammer-integration` (frontend and API)  
Status: approved in conversation; awaiting spec review

## Goal

Players assign a rules edition and a Codex faction to an Order of Battle. They then link each crusade unit to a datasheet in that faction. Linked units show a live datasheet from OpenHammer. Crusade progression (XP, honours, scars, supply) stays in MongoDB.

## Non-goals

- Calling OpenHammer from Express or from the browser
- Copying full datasheets into Mongo
- Faction/edition on force create
- Allies / soup lists (one faction per force)
- Auto-filling wargear, enhancements, or crusade points from the datasheet
- Changing the MCP URL per user

## Architecture

OpenHammer is a live reference. Orders of Battle remain the Express/Mongo source of truth.

```
Browser → Next.js Server Actions / RSC
            → /api/openhammer/*  → OpenHammer MCP (Railway)
            → /api/forces|units  → Express → MongoDB
```

- Next.js BFF speaks MCP Streamable HTTP to `OPENHAMMER_MCP_URL` (default `https://openhammer-mcp-production.up.railway.app/mcp`).
- Express stores `edition`, `faction`, and `unit.type` only. It never calls OpenHammer.
- Datasheets are fetched at read time. Stale Codex text in Mongo is not a concern.

## Data model

### Force (Mongo `forces`)

| Field | Type | Meaning |
|-------|------|---------|
| `edition` | `""` \| `"10e"` \| `"11e"` | OpenHammer edition. Empty = unset. |
| `faction` | string | Exact OpenHammer faction `name` (e.g. `"Space Marines"`). Empty = unset. |

Both default to `""` for existing documents. Create-force does not send them.

A force **has a Codex** when `edition` is `10e` or `11e` **and** `faction` is non-empty.

### Unit `type` (Mongo `units`)

`type` stores the OpenHammer unit `id` when linked (example: `8da0-4570-c3c-819f`). Empty means unlinked.

A unit is **linked** only when `type` matches this pattern:

```
/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/i
```

Legacy free-text values (e.g. `"Infantry"`) are not links. They do not lock faction changes and do not load a datasheet. Linking a datasheet overwrites `type` with the id.

### Overwrite on link

Choosing a datasheet always sets:

| Crusade field | OpenHammer source |
|---------------|-------------------|
| `type` | `id` |
| `name` | `name` |
| `pointsValue` | `points.base` (integer; `0` if missing) |
| `modelCount` | `composition.min_models` (integer; `0` if missing) |

The player may edit name, points, and models afterwards. Unlink clears `type` only; name/points/models stay as last saved.

Wargear and other trait lists are not copied.

Point overwrite still goes through existing supply-limit checks. If the new points would exceed supply, the save is rejected with the current supply error; the draft picker should show the same `wouldExceed` warning before submit.

## Faction lock

Express `PATCH /forces/:id` must apply this rule when `edition` or `faction` is present in the body and the new value differs from the stored value (including clearing a set value):

If any unit on the force is **linked** (id-pattern `type`), respond **409** with `{ error: "Unlink units before changing edition or faction" }`.

Same values (no-op) succeed. Unlinked or legacy-`type` units do not lock.

The force edit UI disables edition/faction controls when any unit is linked and explains that they must unlink first.

## OpenHammer BFF

Thin client: `crusade-tracker/src/lib/openhammer.ts`

- Initialize MCP session (`protocolVersion` `2025-03-26`), send `notifications/initialized`, then `tools/call`.
- Reuse `mcp-session-id` for the duration of one incoming HTTP request (initialize + calls for that request). Do not share sessions across requests.
- Timeout: 10 seconds per MCP HTTP call. Map failures to a typed error the route handlers turn into JSON.

Routes (Clerk middleware already covers `/api/*`):

| Method | Path | MCP tool | Notes |
|--------|------|----------|--------|
| GET | `/api/openhammer/editions` | `list_editions` | |
| GET | `/api/openhammer/factions?edition=` | `list_factions` | `400` if edition missing/invalid |
| GET | `/api/openhammer/units?edition=&faction=&name=` | `search_units` | `faction` exact; `name` optional partial; `limit` 50 |
| GET | `/api/openhammer/units/[unitId]?edition=` | `get_unit` | `400` without edition; `404` if MCP returns nothing / unknown id |

JSON shape for list/search: pass through `name`, `id`, `points.base`, `composition.min_models` so the picker can overwrite without a second `get_unit` call. The unit page uses `get_unit` for the full datasheet (stats, weapons, abilities, keywords, special rules).

OpenHammer 5xx/timeout → **502** `{ error: "Datasheet service unavailable" }` on BFF routes. Unit page treats that as non-blocking.

## UI

### Force create

Unchanged. No edition/faction. Units remain fully manual; `type` stays empty.

### Force edit

Two fields after name: edition select (`10e` / `11e` / unset), then faction select (loaded after edition). Saving uses existing `updateForce` with the new fields in Zod `forceSchema`.

### Unit forms (quick-add, unit edit)

- No Codex on the force: current name/models/points inputs; hide the datasheet picker; do not show a free-text Type field for new edits (legacy `type` that is not an id is ignored).
- Codex on the force: datasheet search-and-pick for that edition + faction. Select overwrites name/points/models/`type`. Unlink control clears `type`.
- Force create unit draft has no Codex, so no picker there.

### Unit page

Crusade stats always render. If the unit is linked and the force has a Codex, fetch the live datasheet and show profile stats, ranged/melee weapons, abilities, special rules, and keywords below crusade stats. Failures: short “datasheet unavailable” or “datasheet not found” with crusade data still visible. Unlinked units show no datasheet block.

Do not display the raw OpenHammer id as “Type”. Show the datasheet name from the live payload when loaded; otherwise omit Type.

### Force summary

When Codex is set, show edition and faction on the force detail header (e.g. `10e · Space Marines`). When unset, show nothing extra.

## Error handling (summary)

- Picker: retry-able error; form remains usable for manual name/points/models; cannot set a link without a successful search.
- Datasheet panel: non-blocking.
- Unknown id after OpenHammer data change: “datasheet not found”; unlink still works.
- 409 from force patch: show the API message on the edit form.

## Testing

API (`crusade-tracker-api`): extract or unit-test the lock helper so `PATCH` rejects edition/faction changes when any unit `type` matches the link pattern, and allows changes when all types are empty or legacy text.

Frontend: tests for the MCP client against a fake HTTP endpoint (initialize, session header, `tools/call` result parsing). No live Railway calls in CI.

Browser verification before calling the work done:

1. Edit an existing force: set 10e + a faction, save.
2. Quick-add or edit a unit: pick a datasheet; confirm name/points/models overwrite.
3. Unit page shows live datasheet.
4. Unlink; confirm datasheet gone; change faction; save succeeds.
5. Link again; confirm edition/faction controls are locked.
6. Force create still works without Codex fields.

## Files (expected)

Frontend: `types.d.ts`, `schema.ts`, `actions.ts`, `ForceEditForm.tsx`, force detail/unit pages, `UnitFormFields.tsx` / `UnitQuickActions.tsx` / `UnitEditForm.tsx`, `UnitPage.tsx`, `src/lib/openhammer.ts`, `src/app/api/openhammer/**`. Workspace `AGENTS.md` env table (`OPENHAMMER_MCP_URL`).

API: `routes/forces.mjs` patch handler, force GET already returns stored fields; unit create/update already persist `type`.

## Out of scope follow-ups

- Datasheet on force create after adding Codex to create
- Point variants (`points.variants`) and max model count as UI choices
- Caching OpenHammer responses beyond Next `revalidate` if we add fetch cache later
