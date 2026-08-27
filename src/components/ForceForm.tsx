"use client";

import Input from "./Input";
import { createForce } from "@/app/actions";
import Image from "next/image";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { number, success } from "zod";

type ForceFormProps = {
  userId: string;
}

const ForceForm: React.FC<ForceFormProps> = ({ userId }) => {
  const [units, setUnits] = useState<Unit[]>([]); 
  const [id, setId] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const initialState: CreateFormState = {message:"", success: false};
  const [state, formAction, pending] = useActionState(createForce, initialState);
  const defaultUnit = {
    xp: 0,
    name: "",
    type: "",
    modelCount: 0,
    pointsValue: 0,
    crusadePoints: 0,
    battlesPlayed: 0,
    battlesSurvived: 0,
    enemyUnitsDestroyed: 0,
  };
  const [unitDraft, setUnitDraft] = useState<Omit<Unit, "id" >>(defaultUnit);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setId(slugify(value));
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  
  const addUnit = (): void => {
    if (!unitDraft.name.trim()) return;

    const newUnit: Unit = {
      id: Date.now(),
      ...unitDraft
    };

    setUnits((currentUnits) => [
      ...currentUnits,
      newUnit,
    ]);

    setUnitDraft(defaultUnit);
  }

  const handleUnitInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUnitDraft((unit) => ({
      ...unit,
      
    }))
  }

  useEffect(() => {
    console.log(state, pending);
  }, [state, pending]);
  

  return (
    <form action={formAction} className="grid grid-cols-12 gap-4 border-2 border-yellow-500 bg-grey-100 rounded-2xl lg:gap-x-8 lg:gap-y-1 my-8 p-4">
      {!pending && state.message !== "" && (
        <div className={`col-span-12 flex justify-center mb-2 ${state.success ? "bg-green-300" : "bg-red-300"}`}>
          <h4>{state.message}</h4>
        </div>
      )}
      <div className="col-span-3">
        <Input name="name" label="Name" type="text" value={name} onChange={handleOnChange} />
      </div>
      <div className="col-span-3">
        <Input name="supplyLimit" type="number" label="Supply Limit" />
      </div>
      <div className="col-span-3">
        <Input name="supplyUsed" type="number" label="Supply Used" />
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

      {units && (
        <div>
          <p>Added units</p>
          {units.map((unit, idx) => (
            <p key={unit.id}>{unit.name}</p>
          ))}
        </div>
      )}
      <div className="col-span-12">
        <h3>Units</h3>

        <div>
          <Input name="unitName" type="text" label="Unit Name" />
          <Input name="pointsValue" type="number" label="Points Value" />
          <Input name="crusadePoints" type="number" label="Crusade Points" onChange={(e) => } />
        </div>

        <button onClick={addUnit}>add unit</button>
      </div>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="userId" value={userId} />

      <div className="col-span-12">
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default ForceForm;
