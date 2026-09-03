"use client";

import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUnit } from "@/app/actions";
import UnitFormFields from "./UnitFormFields";
import BackBtn from "./BackBtn";

type UnitEditFormProps = {
  unit: Unit;
  forceId: string;
  supplyLimit: number;
  otherUnitsPoints: number;
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
  });
  const initialState: CreateFormState = { message: "", success: false };
  const [state, formAction, pending] = useActionState(updateUnit, initialState);

  const projectedUsed = otherUnitsPoints + Number(values.pointsValue || 0);
  const wouldExceed = supplyLimit > 0 && projectedUsed > supplyLimit;

  useEffect(() => {
    if (state.success) {
      router.push("/forces");
    }
  }, [state.success, router]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <form
      action={formAction}
      className="grid grid-cols-12 gap-4 border-2 border-yellow-500 rounded-2xl p-4 my-8"
    >
      <div className="col-span-12">
        <BackBtn url="/forces" />
      </div>
      {!pending && state.message !== "" && (
        <div
          className={`col-span-12 ${state.success ? "bg-green-300" : "bg-red-300"}`}
        >
          {state.message}
        </div>
      )}
      <input type="hidden" name="id" value={unit.id} />
      <UnitFormFields mode="fullEdit" values={values} onChange={onChange} />
      <p className="col-span-12">
        Supply after save: {projectedUsed} / {supplyLimit}
      </p>
      {wouldExceed && (
        <p className="col-span-12 text-red-700">
          New points value would exceed the supply limit.
        </p>
      )}
      <div className="col-span-12">
        <button
          type="submit"
          className="bg-yellow-400 px-4 py-2 hover:bg-yellow-300 disabled:opacity-50"
          disabled={pending || wouldExceed || !values.name.trim()}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UnitEditForm;
