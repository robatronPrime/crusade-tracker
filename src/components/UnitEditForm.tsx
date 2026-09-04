"use client";

import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUnit } from "@/app/actions";
import UnitFormFields, { UnitTraitKey } from "./UnitFormFields";
import ParchmentCard from "@/components/ParchmentCard";

type UnitEditFormProps = {
  unit: Unit;
  forceId: string;
  supplyLimit: number;
  otherUnitsPoints: number;
};

const emptyTraits = {
  wargear: [] as UnitWargear[],
  enhancements: [] as UnitWargear[],
  battleHonours: [] as UnitWargear[],
  battleScars: [] as UnitWargear[],
};

const UnitEditForm = ({
  unit,
  supplyLimit,
  otherUnitsPoints,
}: UnitEditFormProps) => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: unit.name ?? "",
    modelCount: unit.modelCount ?? 0,
    pointsValue: unit.pointsValue ?? 0,
    crusadePoints: unit.crusadePoints ?? 0,
    xp: unit.xp ?? 0,
    battlesPlayed: unit.battlesPlayed ?? 0,
    battlesSurvived: unit.battlesSurvived ?? 0,
    enemyUnitsDestroyed: unit.enemyUnitsDestroyed ?? 0,
    type: unit.type ?? "",
    wargear: unit.wargear ?? emptyTraits.wargear,
    enhancements: unit.enhancements ?? emptyTraits.enhancements,
    battleHonours: unit.battleHonours ?? emptyTraits.battleHonours,
    battleScars: unit.battleScars ?? emptyTraits.battleScars,
  });
  const initialState: CreateFormState = { message: "", success: false };
  const [state, formAction, pending] = useActionState(updateUnit, initialState);

  const projectedUsed = otherUnitsPoints + Number(values.pointsValue || 0);
  const wouldExceed = supplyLimit > 0 && projectedUsed > supplyLimit;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const onTraitsChange = (key: UnitTraitKey, items: UnitWargear[]) => {
    setValues((v) => ({ ...v, [key]: items }));
  };

  return (
    <ParchmentCard className="my-8">
      <form action={formAction}>

        {!pending && state.message !== "" && (
          <div
            className={`rounded px-4 py-2 mb-6 text-sm ${
              state.success
                ? "bg-success-bg text-success-text"
                : "bg-danger/20 text-danger border border-danger"
            }`}
          >
            {state.message}
          </div>
        )}

        <input type="hidden" name="id" value={unit.id} />

        <div className="grid grid-cols-12 gap-6">
          {/* Left: identity + points */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-widest text-ink border-b border-brass/40 pb-2">
              Edit Unit
            </h2>
            <UnitFormFields
              mode="fullEdit"
              values={values}
              onChange={onChange}
              onTraitsChange={onTraitsChange}
            />
          </div>

          {/* Right: supply + save */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 lg:border-l lg:border-brass/40 lg:pl-6">
            <h3 className="font-display text-lg uppercase tracking-widest text-ink border-b border-brass/40 pb-2">
              Supply
            </h3>
            <p className="text-ink/60 text-sm">
              After save: <span className="font-bold text-ink">{projectedUsed}</span> / {supplyLimit}
            </p>
            {wouldExceed && (
              <p className="text-danger text-sm">
                New points value would exceed the supply limit.
              </p>
            )}
            <button
              type="submit"
              className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pending || wouldExceed || !values.name.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </ParchmentCard>
  );
};

export default UnitEditForm;
