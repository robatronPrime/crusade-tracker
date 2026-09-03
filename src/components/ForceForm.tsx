"use client";

import Input from "./Input";
import UnitFormFields from "./UnitFormFields";
import { createForce } from "@/app/actions";
import { ChangeEvent, useActionState, useMemo, useState } from "react";

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

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

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
    <form
      action={formAction}
      className="grid grid-cols-12 gap-4 border-2 border-yellow-500 bg-grey-100 rounded-2xl lg:gap-x-8 lg:gap-y-1 my-8 p-4"
    >
      {!pending && state.message !== "" && (
        <div
          className={`col-span-12 flex justify-center mb-2 ${
            state.success ? "bg-green-300" : "bg-red-300"
          }`}
        >
          <h4>{state.message}</h4>
        </div>
      )}

      <div className="col-span-3">
        <Input name="name" label="Name" type="text" value={name} onChange={handleOnChange} />
      </div>
      <div className="col-span-3">
        <Input
          name="supplyLimit"
          type="number"
          label="Supply Limit"
          value={supplyLimit}
          onChange={(e) => setSupplyLimit(Number(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-3 flex items-end">
        <p className="font-bold">
          Supply Used: {supplyUsed} / {supplyLimit || "—"}
        </p>
      </div>
      <div className="col-span-3">
        <Input name="victories" type="number" label="Victories" />
      </div>
      <div className="col-span-3">
        <Input name="battleTally" type="number" label="Battle Tally" />
      </div>
      <div className="col-span-3">
        <Input name="requisitionPoints" type="number" label="Requisition Points" />
      </div>

      <div className="col-span-12 my-4">
        <p className="font-bold mb-2">Added units</p>
        <div className="grid grid-cols-12 gap-2 mb-2 font-bold text-sm">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Points</div>
          <div className="col-span-2">Models</div>
          <div className="col-span-3" />
        </div>
        {units.map((unit, idx) => (
          <div key={`${unit.name}-${idx}`} className="grid grid-cols-12 gap-2 items-center mb-1">
            <div className="col-span-5">{unit.name}</div>
            <div className="col-span-2">{unit.pointsValue}</div>
            <div className="col-span-2">{unit.modelCount}</div>
            <div className="col-span-3">
              <button
                type="button"
                className="bg-yellow-400 px-3 py-1 hover:bg-yellow-300"
                onClick={() => removeUnit(idx)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {units.length === 0 && <p className="text-sm">No units added yet.</p>}
      </div>

      <div className="col-span-12 flex flex-col items-start my-4 gap-4">
        <h3 className="font-bold">Units</h3>
        <UnitFormFields mode="create" values={unitDraft} onChange={handleUnitInput} />
        {wouldExceed && (
          <p className="text-red-700">
            Adding this unit would exceed the supply limit ({supplyUsed + draftPoints} /{" "}
            {supplyLimit}).
          </p>
        )}
        <button
          type="button"
          className="bg-yellow-400 px-4 py-2 hover:bg-yellow-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addUnit}
          disabled={wouldExceed || !unitDraft.name.trim()}
        >
          Add unit
        </button>
      </div>

      <input type="hidden" name="units" value={JSON.stringify(units)} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="userId" value={userId} />

      <div className="col-span-12">
        <button type="submit" className="btn-primary" disabled={pending}>
          Save
        </button>
      </div>
    </form>
  );
};

export default ForceForm;
