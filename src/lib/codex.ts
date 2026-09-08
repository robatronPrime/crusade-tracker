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
