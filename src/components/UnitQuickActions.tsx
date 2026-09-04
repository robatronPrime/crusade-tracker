"use client";

import Link from "next/link";
import { ChangeEvent, useActionState, useEffect, useState, useTransition } from "react";
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
  const [deleteState, setDeleteState] = useState<CreateFormState | null>(null);

  useEffect(() => {
    if (state.success) {
      setDraft({ name: "", modelCount: 0, pointsValue: 0 });
    }
  }, [state.success]);

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
      const result = await deleteUnit(unitId);
      if (!result.success) {
        setDeleteState(result);
      } else {
        setDeleteState(null);
      }
    });
  };

  return (
    <div className="mt-4">
      {/* Unit table header */}
      <div className="grid grid-cols-12 gap-4 w-full mb-2 text-xs uppercase tracking-widest text-ink/60">
        <div className="col-span-5 lg:col-span-6">Units</div>
        <div className="col-span-1 text-center">XP</div>
        <div className="col-span-1 text-center">Pts</div>
        <div className="col-span-1 text-center">Mdl</div>
        <div className="col-span-1 text-center">CP</div>
        <div className="col-span-3 lg:col-span-2">Actions</div>
      </div>

      {units?.map((unit) => {
        const managed = isManagedUnit(unit);
        const label = unitDisplayName(unit);
        return (
          <div
            key={String(unit.id ?? label)}
            className="col-span-12 grid grid-cols-12 gap-4 w-full items-center mb-1 py-1 border-b border-brass/20 text-sm"
          >
            <div className="col-span-5 lg:col-span-6 font-medium">{label}</div>
            <div className="col-span-1 text-center">{unit.xp ?? 0}</div>
            <div className="col-span-1 text-center">{unit.pointsValue}</div>
            <div className="col-span-1 text-center">{unit.modelCount}</div>
            <div className="col-span-1 text-center">{unit.crusadePoints}</div>
            <div className="col-span-3 lg:col-span-2 flex gap-2">
              {managed ? (
                <>
                  <Link className="text-brass text-xs underline hover:text-brass-hover" href={`/forces/${forceId}/units/${unit.id}`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-danger text-xs underline hover:text-danger-hover disabled:opacity-50"
                    disabled={isPending}
                    onClick={() => onDelete(String(unit.id), label)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <span className="text-ink/40 text-xs">Legacy</span>
              )}
            </div>
          </div>
        );
      })}

      {deleteState && !deleteState.success && deleteState.message !== "" && (
        <div className="bg-danger/20 text-danger border border-danger rounded px-4 py-2 my-2 text-sm">
          {deleteState.message}
        </div>
      )}

      <form action={formAction} className="grid grid-cols-12 gap-4 mt-6">
        {!pending && state.message !== "" && (
          <div
            className={`col-span-12 rounded px-4 py-2 text-sm ${
              state.success
                ? "bg-success-bg text-success-text"
                : "bg-danger/20 text-danger border border-danger"
            }`}
          >
            {state.message}
          </div>
        )}
        <input type="hidden" name="forceId" value={forceId} />
        <UnitFormFields mode="quickAdd" values={draft} onChange={onChange} />
        {wouldExceed && (
          <p className="col-span-12 text-danger text-sm">
            Adding this unit would exceed the supply limit.
          </p>
        )}
        <div className="col-span-12">
          <button
            type="submit"
            className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pending || wouldExceed || !draft.name.trim()}
          >
            Add Unit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UnitQuickActions;
