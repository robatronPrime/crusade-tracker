"use client";

import Link from "next/link";
import { ChangeEvent, useActionState, useState, useTransition } from "react";
import { addUnit, deleteUnit } from "@/app/actions";
import UnitFormFields from "./UnitFormFields";

type UnitQuickActionsProps = {
  forceId: string;
  supplyLimit: number;
  supplyUsed: number;
  units: Unit[];
};

function unitDisplayName(unit: Unit): string {
  return unit.name || unit.unitName || "";
}

function isManagedUnit(unit: Unit): boolean {
  const id = String(unit.id ?? "");
  return /^[a-f\d]{24}$/i.test(id);
}

const UnitQuickActions = ({
  forceId,
  supplyLimit,
  supplyUsed,
  units,
}: UnitQuickActionsProps) => {
  const [draft, setDraft] = useState({
    name: "",
    modelCount: 0,
    pointsValue: 0,
  });
  const initialState: CreateFormState = { message: "", success: false };
  const [state, formAction, pending] = useActionState(addUnit, initialState);
  const [isPending, startTransition] = useTransition();

  const wouldExceed =
    supplyLimit > 0 && supplyUsed + Number(draft.pointsValue || 0) > supplyLimit;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDraft((d) => ({
      ...d,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const onDelete = (unitId: string, label: string) => {
    if (!window.confirm(`Delete unit "${label}"?`)) return;
    startTransition(async () => {
      await deleteUnit(unitId);
    });
  };

  return (
    <div className="col-span-12 mt-4">
      <div className="col-span-12 grid grid-cols-12 gap-4 w-full mb-2">
        <div className="col-span-5 lg:col-span-6 font-bold">Units</div>
        <div className="col-span-1 text-center font-bold">XP</div>
        <div className="col-span-1 text-center font-bold">Points</div>
        <div className="col-span-1 text-center font-bold">Models</div>
        <div className="col-span-1 text-center font-bold">CP</div>
        <div className="col-span-3 lg:col-span-2 font-bold">Actions</div>
      </div>

      {units?.map((unit) => {
        const managed = isManagedUnit(unit);
        const label = unitDisplayName(unit);
        return (
          <div
            key={String(unit.id ?? label)}
            className="col-span-12 grid grid-cols-12 gap-4 w-full items-center mb-1"
          >
            <div className="col-span-5 lg:col-span-6">{label}</div>
            <div className="col-span-1 text-center">{unit.xp ?? 0}</div>
            <div className="col-span-1 text-center">{unit.pointsValue}</div>
            <div className="col-span-1 text-center">{unit.modelCount}</div>
            <div className="col-span-1 text-center">{unit.crusadePoints}</div>
            <div className="col-span-3 lg:col-span-2 flex gap-2">
              {managed ? (
                <>
                  <Link
                    className="underline"
                    href={`/forces/${forceId}/units/${unit.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="underline"
                    disabled={isPending}
                    onClick={() => onDelete(String(unit.id), label)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <span className="text-xs">Legacy</span>
              )}
            </div>
          </div>
        );
      })}

      <form action={formAction} className="col-span-12 grid grid-cols-12 gap-4 mt-6">
        {!pending && state.message !== "" && (
          <div
            className={`col-span-12 ${state.success ? "bg-green-300" : "bg-red-300"}`}
          >
            {state.message}
          </div>
        )}
        <input type="hidden" name="forceId" value={forceId} />
        <UnitFormFields mode="quickAdd" values={draft} onChange={onChange} />
        {wouldExceed && (
          <p className="col-span-12 text-red-700">
            Adding this unit would exceed the supply limit.
          </p>
        )}
        <div className="col-span-12">
          <button
            type="submit"
            className="bg-yellow-400 px-4 py-2 hover:bg-yellow-300 disabled:opacity-50"
            disabled={pending || wouldExceed || !draft.name.trim()}
          >
            Add unit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnitQuickActions;
