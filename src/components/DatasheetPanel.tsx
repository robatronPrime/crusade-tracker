import { JSX } from "react";
import StatBlock from "./StatBlock";

type DatasheetPanelProps = {
  datasheet: unknown;
  datasheetError: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function displayValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) {
    const joined = value.map((item) => displayValue(item)).filter((item) => item && item !== "—").join(", ");
    return joined || "—";
  }
  if (typeof value === "object") {
    const joined = Object.values(value as Record<string, unknown>)
      .map((item) => displayValue(item))
      .filter((item) => item && item !== "—")
      .join(", ");
    return joined || "—";
  }
  return String(value);
}

function field(record: Record<string, unknown> | null, ...keys: string[]): unknown {
  if (!record) return undefined;
  for (const key of keys) {
    if (record[key] != null && record[key] !== "") return record[key];
  }
  return undefined;
}

function WeaponTable({
  title,
  weapons,
  skillKey
}: {
  title: string;
  weapons: unknown[];
  skillKey: "BS" | "WS";
}): JSX.Element | null {
  if (weapons.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 min-w-0">
      <h4 className="text-xs uppercase tracking-widest text-ink/60">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink">
          <thead>
            <tr className="text-xs uppercase tracking-widest text-ink/60 border-b border-brass/40">
              <th className="py-2 pr-3 font-normal">Name</th>
              <th className="py-2 pr-3 font-normal">Range</th>
              <th className="py-2 pr-3 font-normal">A</th>
              <th className="py-2 pr-3 font-normal">BS/WS</th>
              <th className="py-2 pr-3 font-normal">S</th>
              <th className="py-2 pr-3 font-normal">AP</th>
              <th className="py-2 pr-3 font-normal">D</th>
              <th className="py-2 font-normal">Keywords</th>
            </tr>
          </thead>
          <tbody>
            {weapons.map((weapon, index) => {
              const row = asRecord(weapon) ?? {};
              const name = displayValue(field(row, "name"));
              return (
                <tr key={`${name}-${index}`} className="border-b border-brass/20 align-top">
                  <td className="py-2 pr-3 font-medium">{name}</td>
                  <td className="py-2 pr-3">{displayValue(field(row, "Range", "range"))}</td>
                  <td className="py-2 pr-3">{displayValue(field(row, "A", "a"))}</td>
                  <td className="py-2 pr-3">{displayValue(field(row, skillKey, skillKey.toLowerCase(), "BS", "WS", "bs", "ws"))}</td>
                  <td className="py-2 pr-3">{displayValue(field(row, "S", "s"))}</td>
                  <td className="py-2 pr-3">{displayValue(field(row, "AP", "ap"))}</td>
                  <td className="py-2 pr-3">{displayValue(field(row, "D", "d"))}</td>
                  <td className="py-2">{displayValue(field(row, "Keywords", "keywords"))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DatasheetPanel = ({ datasheet, datasheetError }: DatasheetPanelProps): JSX.Element | null => {
  if (datasheetError) {
    return <p className="text-ink/50">{datasheetError}</p>;
  }

  const sheet = asRecord(datasheet);
  if (!sheet) return null;

  const stats = asRecord(sheet.stats);
  const weapons = asRecord(sheet.weapons) ?? {};
  const ranged = asList(field(weapons, "ranged") ?? field(sheet, "ranged_weapons", "rangedWeapons"));
  const melee = asList(field(weapons, "melee") ?? field(sheet, "melee_weapons", "meleeWeapons"));
  const abilities = asList(sheet.abilities).map(asRecord).filter(Boolean) as Record<string, unknown>[];
  const specialRules = asList(field(sheet, "special_rules", "specialRules"));
  const keywordsRaw = field(sheet, "keywords");
  const keywordRecord = asRecord(keywordsRaw);
  const keywords = Array.isArray(keywordsRaw)
    ? keywordsRaw
    : keywordRecord
      ? Object.values(keywordRecord).flatMap((value) => (asList(value).length ? asList(value) : [value]))
      : keywordsRaw != null
        ? [keywordsRaw]
        : [];

  return (
    <div className="flex flex-col gap-6 border-t border-brass/40 pt-6">
      <h3 className="text-lg font-bold text-ink">{displayValue(sheet.name)}</h3>

      {stats ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-4">
          {Object.entries(stats).map(([key, value]) => (
            <StatBlock key={key} label={key} value={displayValue(value)} />
          ))}
        </div>
      ) : null}

      <WeaponTable title="Ranged weapons" weapons={ranged} skillKey="BS" />
      <WeaponTable title="Melee weapons" weapons={melee} skillKey="WS" />

      {abilities.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-widest text-ink/60">Abilities</h4>
          <ul className="flex flex-col gap-2">
            {abilities.map((ability, index) => (
              <li key={`${displayValue(ability.name)}-${index}`} className="flex flex-col">
                <span className="text-ink text-sm">{displayValue(ability.name)}</span>
                {ability.description || ability.desc ? (
                  <span className="text-ink/50 text-xs">{displayValue(ability.description ?? ability.desc)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {specialRules.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-widest text-ink/60">Special rules</h4>
          <p className="text-ink text-sm">
            {specialRules
              .map((rule) => {
                const record = asRecord(rule);
                return record ? displayValue(field(record, "name", "description")) : displayValue(rule);
              })
              .join(", ")}
          </p>
        </div>
      ) : null}

      {keywords.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs uppercase tracking-widest text-ink/60">Keywords</h4>
          <p className="text-ink text-sm">{keywords.map((keyword) => displayValue(keyword)).join(", ")}</p>
        </div>
      ) : null}
    </div>
  );
};

export default DatasheetPanel;
