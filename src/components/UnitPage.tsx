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
    <div className="flex flex-col gap-1 min-w-[10rem]">
      <span className="text-xs uppercase tracking-widest text-ink/60">{label}</span>
      {items.map((item) => (
        <div key={item.id} className="flex flex-col">
          <span className="text-ink text-sm">{item.name}</span>
          {item.desc ? <span className="text-ink/50 text-xs">{item.desc}</span> : null}
        </div>
      ))}
    </div>
  );
};

const UnitPage = ({ unit, forceId, supplyLimit, otherUnitsPoints }: UnitPageProps) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <div className="col-span-12">
        <ParchmentCard>
          <div className="flex flex-wrap gap-8 justify-between">
            <StatBlock label="Model Count" value={unit.modelCount ?? 0} />
            <StatBlock label="Points Value" value={unit.pointsValue ?? 0} />
            <StatBlock label="Crusade Points" value={unit.crusadePoints ?? 0} />
            <StatBlock label="XP" value={unit.xp ?? 0} />
            <StatBlock label="Battles Played" value={unit.battlesPlayed ?? 0} />
            <StatBlock label="Battles Survived" value={unit.battlesSurvived ?? 0} />
            <StatBlock label="Enemy Units Destroyed" value={unit.enemyUnitsDestroyed ?? 0} />
            <StatBlock label="Type" value={unit.type ?? ""} />
            <TraitSummary label="Wargear" items={unit.wargear} />
            <TraitSummary label="Enhancements" items={unit.enhancements} />
            <TraitSummary label="Battle Honours" items={unit.battleHonours} />
            <TraitSummary label="Battle Scars" items={unit.battleScars} />
          </div>
        
        <button className="bg-brass text-black px-4 py-2 rounded-md hover:bg-brass-hover" onClick={() => setEditMode((prev) => !prev)}>
            {editMode ? "Cancel" : "Edit"}
        </button>
        </ParchmentCard>
        {editMode && <UnitEditForm
            unit={unit}
            forceId={forceId}
            supplyLimit={supplyLimit}
            otherUnitsPoints={otherUnitsPoints}
          />
        }
      </div>
  );
};

export default UnitPage;