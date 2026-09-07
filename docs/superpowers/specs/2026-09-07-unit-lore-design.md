# Unit Lore Design

**Date:** 2026-09-07  
**Status:** Approved  
**Scope:** Make unit lore optional and consistent with force lore. Unblock unit create. Edit lore only on the unit page.

---

## Summary

Units already have a `lore` field, a unit-page display, and an edit textarea. Create paths (quick-add and create-force drafts) do not collect lore, but `POST /units` and the `addUnit` / `updateUnit` actions reject empty lore. That mismatch blocks adding a unit.

This change treats lore as optional. Create flows stay compact. Players write or clear lore on the unit page.

---

## Decisions

| Decision | Choice |
|----------|--------|
| Required vs optional | Optional (Approach A) |
| Create UI | No lore field on quick-add or create-force unit drafts |
| Edit / display UI | Unit page shows lore or “No lore recorded.”; edit form keeps the lore textarea |
| Empty value | Persist `""`; treat missing `lore` as empty |
| Clearing lore | Allowed on edit save |
| Force lore | Unchanged |

Out of scope: AI-generated lore, markdown rendering, per-unit lore on force create, a separate lore-only endpoint.

---

## Data model

`Unit.lore` is an optional string.

- New units: if the client omits lore or sends blank, store `lore: ""`.
- Existing units: missing `lore` is displayed and edited as empty.
- Force documents and force-level `lore` are unchanged.
- Units created as part of `POST /forces` do not need lore; persist `""` if the field is absent.

No migration. Reads already use optional chaining (`unit.lore?.trim()`).

---

## API and server actions

### `POST /units`

Accept `lore` as an optional string. Coerce with `String(lore ?? "")`. Do **not** return `400` for empty lore. Store the string on the unit document.

### `PATCH /units/:id`

If `lore` is present in the body, coerce to string (including `""`) and persist. No extra empty-lore validation.

### Zod

`addUnitSchema` and `updateUnitSchema` keep `lore: z.string().optional()`.

`forceUnitSchema` includes `lore: z.string().optional()` so create-force units validate if the field is present; it is not required.

### Server actions

`addUnit` and `updateUnit` must not treat `lore.trim() === ""` as invalid. Trait JSON parse failures stay errors, independent of lore. Pass `lore` through as a string (default `""`).

---

## UI

### Quick-add (`UnitQuickActions`)

Unchanged fields: name, models, points. No lore input. Submit succeeds with empty lore. Save remains disabled only for empty name or supply-limit overflow.

### Create force (`ForceForm`)

Unit drafts stay without lore. No new field.

### Unit page (`UnitPage`)

Keep the Lore block:

- Empty / whitespace-only → “No lore recorded.”
- Otherwise → `whitespace-pre-wrap` text.

### Edit unit (`UnitEditForm`)

Keep the lore textarea (`name="lore"`). Enable Save when the unit has a non-empty name and would not exceed supply, **even if lore is empty**. Submit always includes lore (possibly `""`) so a cleared textarea persists as empty.

---

## Error handling

- Empty lore is never an error.
- Invalid trait payloads return “Invalid unit traits payload.” (do not mention lore).
- Supply-limit errors unchanged.
- Other API failures still use the form error banner.

---

## Testing

1. Quick-add a unit with only name / models / points → unit is created; unit page shows “No lore recorded.”
2. Open edit, enter lore, save → unit page shows the text, including line breaks.
3. Clear lore and save → “No lore recorded.” again.
4. Create a force with a drafted unit and no unit lore → succeeds.
5. Force lore create/edit still works.
6. Supply-limit block still prevents add/save when points would exceed the limit.
7. Edit save still requires a unit name.

---

## Files to change

| File | Change |
|------|--------|
| `crusade-tracker-api/routes/units.mjs` | Remove empty-lore rejection on POST; persist `""` |
| `crusade-tracker/src/app/actions.ts` | Stop treating empty lore as invalid on add/update |
| `crusade-tracker/src/components/UnitEditForm.tsx` | Do not disable Save for empty lore |
| `crusade-tracker/src/app/schema.ts` | Optional `lore` on `forceUnitSchema` if missing |

No new routes or components. `UnitPage` display can stay as-is.
