"use client";

import Input from "./Input";
import ParchmentCard from "@/components/ParchmentCard";
import UnitFormFields from "./UnitFormFields";
import { createForce } from "@/app/actions";
import { ChangeEvent, useActionState, useMemo, useState } from "react";
import { slugify } from "@/utils/slugify";

type ForceFormProps = {
  userId: string;
};

type DraftUnit = {
  name: string;
  modelCount: number;
  pointsValue: number;
  crusadePoints: number;
};

const defaultDraft: DraftUnit = {
  name: "",
  modelCount: 0,
  pointsValue: 0,
  crusadePoints: 0,
};

const ForceForm: React.FC<ForceFormProps> = ({ userId }) => {
  const [units, setUnits] = useState<DraftUnit[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [supplyLimit, setSupplyLimit] = useState(0);
  const [unitDraft, setUnitDraft] = useState<DraftUnit>(defaultDraft);
  const [recordOfAchievement, setRecordOfAchievement] = useState("");
  const initialState: CreateFormState = { message: "", success: false };
  const [state, formAction, pending] = useActionState(createForce, initialState);

  const supplyUsed = useMemo(
    () => units.reduce((sum, u) => sum + Number(u.pointsValue || 0), 0),
    [units]
  );

  const draftPoints = Number(unitDraft.pointsValue || 0);
  const wouldExceed =
    supplyLimit > 0 && supplyUsed + draftPoints > supplyLimit;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setId(slugify(value));
  };

  const handleUnitInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: field, value, type } = e.target;
    setUnitDraft((unit) => ({
      ...unit,
      [field]: type === "number" ? Number(value) : value,
    }));
  };

  const addUnit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (!unitDraft.name.trim()) return;
    if (wouldExceed) return;

    setUnits((current) => [
      ...current,
      {
        name: unitDraft.name.trim(),
        modelCount: Number(unitDraft.modelCount || 0),
        pointsValue: Number(unitDraft.pointsValue || 0),
        crusadePoints: Number(unitDraft.crusadePoints || 0),
      },
    ]);
    setUnitDraft(defaultDraft);
  };

  const removeUnit = (index: number): void => {
    setUnits((current) => current.filter((_, i) => i !== index));
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

        <div className="grid grid-cols-12 gap-6">
          {/* Left: force details */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-widest text-ink border-b border-brass/40 pb-2">
              New Order of Battle
            </h2>
            <Input name="name" label="Name" type="text" value={name} onChange={handleOnChange} />
            <Input
              name="supplyLimit"
              type="number"
              label="Supply Limit"
              value={supplyLimit}
              onChange={(e) => setSupplyLimit(Number(e.target.value) || 0)}
            />
            <p className="text-ink/60 text-sm">
              Supply used: <span className="font-bold text-ink">{supplyUsed}</span> / {supplyLimit || "—"}
            </p>
            <Input name="victories" type="number" label="Victories" />
            <Input name="battleTally" type="number" label="Battle Tally" />
            <Input name="requisitionPoints" type="number" label="Requisition Points" />
            <Input name="recordOfAchievement" type="textarea" label="Record of Achievements" value={recordOfAchievement} onChange={(e) => setRecordOfAchievement(e.target.value)} />

            <input type="hidden" name="units" value={JSON.stringify(units)} />
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="userId" value={userId} />

            <button
              type="submit"
              className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              disabled={pending}
            >
              Save
            </button>
          </div>

          {/* Right: unit roster */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 lg:border-l lg:border-brass/40 lg:pl-6">
            <h3 className="font-display text-lg uppercase tracking-widest text-ink border-b border-brass/40 pb-2">
              Units
            </h3>

            <div>
              <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-widest text-ink/60 mb-1">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Pts</div>
                <div className="col-span-2">Mdl</div>
                <div className="col-span-3" />
              </div>
              {units.length === 0 && (
                <p className="text-ink/50 text-sm">No units added yet.</p>
              )}
              {units.map((unit, idx) => (
                <div key={`${unit.name}-${idx}`} className="grid grid-cols-12 gap-2 items-center py-1 border-b border-brass/20 text-sm">
                  <div className="col-span-5">{unit.name}</div>
                  <div className="col-span-2">{unit.pointsValue}</div>
                  <div className="col-span-2">{unit.modelCount}</div>
                  <div className="col-span-3">
                    <button
                      type="button"
                      className="text-danger text-xs underline hover:text-danger-hover"
                      onClick={() => removeUnit(idx)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <UnitFormFields mode="create" values={unitDraft} onChange={handleUnitInput} />
            {wouldExceed && (
              <p className="text-danger text-sm">
                Adding this unit would exceed the supply limit ({supplyUsed + draftPoints} / {supplyLimit}).
              </p>
            )}
            <button
              type="button"
              className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={addUnit}
              disabled={wouldExceed || !unitDraft.name.trim()}
            >
              Add Unit
            </button>
          </div>
        </div>
      </form>
    </ParchmentCard>
  );
};

export default ForceForm;
