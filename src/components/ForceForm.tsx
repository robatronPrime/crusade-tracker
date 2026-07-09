"use client";

import Input from "./Input";
import { createForce } from "@/app/actions";
import Image from "next/image";
import { useActionState, useState } from "react";

type ForceFormProps = {
  userId: string;
}

const ForceForm: React.FC<ForceFormProps> = ({ userId }) => {
  const initialState: CreateFormState = {message:"", success: false}
  const [id, setId] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const [state, formAction, pending] = useActionState(createForce, initialState)

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

  // const units: Unit[] = [];
  // const addUnit = (): void => {}

  console.log(state, pending);
  

  return (
    <form action={formAction} className="grid grid-cols-12 gap-4 border-2 border-yellow-500 bg-grey-100 rounded-2xl lg:gap-x-8 lg:gap-y-1 my-8 p-4">
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
      {/* <div className="col-span-12">
        <h3>Units</h3>

        <div>
          <Input name="unitName" type="text" label="Unit Name" />
          <Input name="pointsValue" type="number" label="Points Value" />
          <Input name="crusadePoints" type="number" label="Crusade Points" />
        </div>

        <button onClick={addUnit}>
          <div className="flex justify-end bg-yellow-400 text-white p-4 rounded-full">
            <Image src="/images/outline/plus.svg" alt="plus" width="20" height="20" />
          </div>
        </button>
      </div> */}
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
