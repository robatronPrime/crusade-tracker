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
