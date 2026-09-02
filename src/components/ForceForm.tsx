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
    type: "",
    unitName: "",
    modelCount: 0,
    pointsValue: 0,
    crusadePoints: 0,
    battlesPlayed: 0,
    battlesSurvived: 0,
  };
  const [unitDraft, setUnitDraft] = useState<Omit<Unit, "id" >>(defaultUnit);
  const unitCol = "col-span-3"

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

  
  const addUnit = (e: any): void => {
    e.preventDefault();
    if (!unitDraft.unitName.trim()) return;

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
    const target = e.target;
    setUnitDraft((unit) => ({
      ...unit,
      [target.name]: target.value
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
          <div className="grid grid-cols-12 gap-4">

          </div>
          {units.map((unit, idx) => (
            <div key={unit.id} className="grid grid-cols-12 gap-4">
              <div className={unitCol}>
                <p>{unit.unitName}</p>
              </div>
              <p>{unit.pointsValue}</p>
              <p>{unit.modelCount}</p>
            </div>
          ))}
        </div>
      )}
      <div className="col-span-12 flex flex-col items-start my-8">
        <h3>Units</h3>

        <div>
          <Input name="unitName" type="text" label="Unit Name" onChange={handleUnitInput} />
          <Input name="pointsValue" type="number" label="Points Value" onChange={handleUnitInput} />
          <Input name="crusadePoints" type="number" label="Crusade Points" onChange={handleUnitInput} />
          <Input name="modelCount" type="number" label="Model Count" onChange={handleUnitInput} />
          <Input name="crusadePoints" type="number" label="Crusade Points" onChange={handleUnitInput} />
          <Input name="battlesPlayed" type="number" label="Battles Played" onChange={handleUnitInput} />
          <Input name="battlesSurvived" type="number" label="Battles Survived" onChange={handleUnitInput} />
        </div>

        <button className="bg-yellow-400 px-4 py-2 hover:bg-yellow-300 hover:cursor-pointer" onClick={addUnit}>add unit</button>
      </div>
      <input type="hidden" name="units" value={JSON.stringify(units)} />
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
