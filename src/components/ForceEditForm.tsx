"use client";

import { ChangeEvent, JSX, useActionState, useEffect, useMemo, useState } from "react";
import { updateForce } from "@/app/actions";
import ParchmentCard from "./ParchmentCard";
import BackBtn from "./BackBtn";
import Input from "./Input";
import { isLinkedUnitType } from "@/lib/codex";

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
  edition: string;
  faction: string;
};

type FactionOption = {
  name: string;
  faction_type?: string;
  unit_count?: number;
};

const selectClassName =
  "bg-parchment border border-brass text-ink px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brass";

const toRecordText = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value.join("\n") : (value ?? "");

const ForceEditForm = ({ forceId, forceName, userId, units, supplyLimit, victories, battleTally, requisitionPoints, recordOfAchievement, lore, edition, faction }: ForceEditFormProps): JSX.Element => {
  const [values, setValues] = useState({
    name: forceName ?? "",
    supplyLimit: supplyLimit,
    userId: userId,
    victories: victories,
    battleTally: battleTally,
    requisitionPoints: requisitionPoints,
    recordOfAchievement: toRecordText(recordOfAchievement),
    lore: lore ?? "",
    edition: edition ?? "",
    faction: faction ?? "",
  });
  const [editions, setEditions] = useState<string[]>([]);
  const [factions, setFactions] = useState<FactionOption[]>([]);
  const initialState: CreateFormState = { message: "", success: false };
  const [state, formAction, pending] = useActionState(updateForce, initialState);

  const locked = units.some((unit) => isLinkedUnitType(unit.type));

  const supplyUsed = useMemo(
    () => units.reduce((sum: number, u: Unit) => sum + Number(u.pointsValue || 0), 0),
    [units]
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/openhammer/editions")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.editions)) {
          setEditions(data.editions.map(String));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (values.edition !== "10e" && values.edition !== "11e") {
      setFactions([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/openhammer/factions?edition=${encodeURIComponent(values.edition)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.factions)) {
          setFactions(data.factions);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [values.edition]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleEditionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextEdition = e.target.value;
    setValues({
      ...values,
      edition: nextEdition,
      faction: "",
    });
  };

  const handleFactionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, faction: e.target.value });
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
                <div className="col-span-full md:col-span-1">
                  <label htmlFor="edition" className="flex flex-col gap-1 text-ink">
                    <span className="text-xs uppercase tracking-widest text-ink/60">Edition</span>
                    <select
                      id="edition"
                      name={locked ? undefined : "edition"}
                      value={values.edition}
                      onChange={handleEditionChange}
                      disabled={locked}
                      className={selectClassName}
                    >
                      <option value=""> </option>
                      {editions.map((ed) => (
                        <option key={ed} value={ed}>
                          {ed}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="col-span-full md:col-span-1">
                  <label htmlFor="faction" className="flex flex-col gap-1 text-ink">
                    <span className="text-xs uppercase tracking-widest text-ink/60">Faction</span>
                    <select
                      id="faction"
                      name={locked ? undefined : "faction"}
                      value={values.faction}
                      onChange={handleFactionChange}
                      disabled={locked || (values.edition !== "10e" && values.edition !== "11e")}
                      className={selectClassName}
                    >
                      <option value=""> </option>
                      {factions.map((f) => (
                        <option key={f.name} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {locked && (
                  <p className="col-span-full text-sm text-ink/60">Unlink units before changing edition or faction.</p>
                )}
                {locked && (
                  <>
                    <input type="hidden" name="edition" value={values.edition} />
                    <input type="hidden" name="faction" value={values.faction} />
                  </>
                )}
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
