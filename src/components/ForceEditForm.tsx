"use client";

import { ChangeEvent, JSX, useActionState, useMemo, useState } from "react";
import { updateForce } from "@/app/actions";
import ParchmentCard from "./ParchmentCard";
import BackBtn from "./BackBtn";
import Input from "./Input";

type ForceEditFormProps = {
  userId: string;
  units: Unit[];
  forceId: string;
  forceName: string;
  supplyLimit: number;
  victories: number;
  battleTally: number;
  requisitionPoints: number;
  recordOfAchievement?: string | string[];
  lore?: string;
};

const toRecordText = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value.join("\n") : (value ?? "");

const ForceEditForm = ({ forceId, forceName, userId, units, supplyLimit, victories, battleTally, requisitionPoints, recordOfAchievement, lore }: ForceEditFormProps): JSX.Element => {
  const [values, setValues] = useState({
    name: forceName ?? "",
    supplyLimit: supplyLimit,
    userId: userId,
    victories: victories,
    battleTally: battleTally,
    requisitionPoints: requisitionPoints,
    recordOfAchievement: toRecordText(recordOfAchievement),
    lore: lore ?? "",
  });
  const initialState: CreateFormState = { message: "", success: false };
  const [state, formAction, pending] = useActionState(updateForce, initialState);


  const supplyUsed = useMemo(
    () => units.reduce((sum: number, u: Unit) => sum + Number(u.pointsValue || 0), 0),
    [units]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <ParchmentCard className="my-8">
        <form action={formAction}>
            <div className="mb-6">
                <BackBtn url="/forces" />
            </div>
            {!pending && state.message !== "" && (
                <div className={`rounded px-4 py-2 mb-6 text-sm ${state.success ? "bg-success-bg text-success-text" : "bg-danger/20 text-danger border border-danger"}`}>
                    {state.message}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <h3 className="font-display text-2xl lg:text-3xl text-ink tracking-widest uppercase col-span-2">{forceName}</h3>
                <div className="col-span-full md:col-span-1">
                  <Input name="name" label="Name" type="text" value={values.name} onChange={handleInputChange} />
                </div>
                <div className="col-span-full">
                  <Input name="lore" type="textarea" label="Lore" value={values.lore} onChange={handleInputChange} />
                </div>
                <div className="col-span-full md:col-span-1">
                    <Input
                        name="supplyLimit"
                        type="number"
                        label="Supply Limit"
                        value={values.supplyLimit}
                        onChange={handleInputChange}
                    />
                    <p className="text-ink/60 text-sm">
                        Supply used: <span className="font-bold text-ink">{supplyUsed}</span> / {supplyLimit || "—"}
                    </p>
                </div>

                <div className="col-span-full md:col-span-1">
                  <Input name="victories" type="number" label="Victories" value={values.victories} onChange={handleInputChange} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Input name="battleTally" type="number" label="Battle Tally" value={values.battleTally} onChange={handleInputChange} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Input name="requisitionPoints" type="number" label="Requisition Points" value={values.requisitionPoints} onChange={handleInputChange} />
                </div>
                <div className="col-span-full md:col-span-1">
                  <Input name="recordOfAchievement" type="textarea" label="Record of Achievements" value={values.recordOfAchievement} onChange={handleInputChange} />
                </div>
                <input type="hidden" name="id" value={forceId} />
                <input type="hidden" name="userId" value={userId} />
            </div>
            <button type="submit" disabled={pending} className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">{pending ? "Updating..." : "Update"}</button>
        </form>
    </ParchmentCard>
  );
};

export default ForceEditForm; 