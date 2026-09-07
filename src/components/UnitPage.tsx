"use client";

import { useState } from "react";
import ParchmentCard from "./ParchmentCard";
import StatBlock from "./StatBlock";
import UnitEditForm from "./UnitEditForm";

type UnitPageProps = {
  unit: Unit;
  forceId: string;
  supplyLimit: number;
  otherUnitsPoints: number;
};

const TraitSummary = ({ label, items }: { label: string; items?: UnitWargear[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <span className="text-xs uppercase tracking-widest text-ink/60">{label}</span>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col">
            <span className="text-ink text-sm">{item.name}</span>
            {item.desc ? <span className="text-ink/50 text-xs">{item.desc}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

const UnitPage = ({ unit, forceId, supplyLimit, otherUnitsPoints }: UnitPageProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const traitGroups = [
    { label: "Wargear", items: unit.wargear },
    { label: "Enhancements", items: unit.enhancements },
    { label: "Battle Honours", items: unit.battleHonours },
    { label: "Battle Scars", items: unit.battleScars }
  ].filter((group) => group.items && group.items.length > 0);

  return (
    <div className="col-span-12">
      <ParchmentCard>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
            <StatBlock label="Model Count" value={unit.modelCount ?? 0} />
            <StatBlock label="Points Value" value={unit.pointsValue ?? 0} />
            <StatBlock label="Crusade Points" value={unit.crusadePoints ?? 0} />
            <StatBlock label="XP" value={unit.xp ?? 0} />
            <StatBlock label="Battles Played" value={unit.battlesPlayed ?? 0} />
            <StatBlock label="Battles Survived" value={unit.battlesSurvived ?? 0} />
            <StatBlock label="Enemy Units Destroyed" value={unit.enemyUnitsDestroyed ?? 0} />
            <StatBlock label="Type" value={unit.type ?? ""} />
          </div>

          {traitGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 pt-6 border-t border-brass/40">
              {traitGroups.map((group) => (
                <TraitSummary key={group.label} label={group.label} items={group.items} />
              ))}
            </div>
          ) : null}

          <button
            className="self-start bg-brass text-black px-4 py-2 rounded-md hover:bg-brass-hover"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>
      </ParchmentCard>
      <div className="col-span-12 mt-6">
        {editMode && (
          <UnitEditForm
            unit={unit}
            forceId={forceId}
            supplyLimit={supplyLimit}
            otherUnitsPoints={otherUnitsPoints}
          />
        )}
      </div>
    </div>
  );
};

export default UnitPage;
