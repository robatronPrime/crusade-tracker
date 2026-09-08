"use client";

import { ChangeEvent, JSX } from "react";
import type { OpenHammerUnitSummary } from "@/lib/openhammer";
import DatasheetPicker from "./DatasheetPicker";
import Input from "./Input";
import TraitListEditor from "./TraitListEditor";

export type UnitFormMode = "create" | "quickAdd" | "fullEdit";
export type UnitTraitKey = "wargear" | "enhancements" | "battleHonours" | "battleScars";

type UnitFormFieldsProps = {
  mode: UnitFormMode;
  values: Partial<Unit>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTraitsChange: (key: UnitTraitKey, items: UnitWargear[]) => void;
  hasCodex?: boolean;
  edition?: string;
  faction?: string;
  onDatasheetLinked?: (sheet: OpenHammerUnitSummary) => void;
  onDatasheetUnlink?: () => void;
};

const traitFields: { key: UnitTraitKey; label: string }[] = [
  { key: "wargear", label: "Wargear" },
  { key: "enhancements", label: "Enhancements" },
  { key: "battleHonours", label: "Battle Honours" },
  { key: "battleScars", label: "Battle Scars" }
];

const traitHiddenInputs = (values: Partial<Unit>) =>
  traitFields.map(({ key }) => (
    <input key={`hidden-${key}`} type="hidden" name={key} value={JSON.stringify(values[key] ?? [])} />
  ));

const UnitFormFields = ({
  mode,
  values,
  onChange,
  onTraitsChange,
  hasCodex,
  edition,
  faction,
  onDatasheetLinked,
  onDatasheetUnlink
}: UnitFormFieldsProps): JSX.Element => {
  const showCrusadePoints = mode === "create" || mode === "fullEdit";
  const typeControls = (
    <>
      {hasCodex ? (
        <div className="col-span-12">
          <DatasheetPicker
            edition={edition ?? ""}
            faction={faction ?? ""}
            typeValue={values.type ?? ""}
            onLinked={(sheet) => onDatasheetLinked?.(sheet)}
            onUnlink={() => onDatasheetUnlink?.()}
          />
        </div>
      ) : null}
      <input type="hidden" name="type" value={hasCodex ? (values.type ?? "") : ""} />
    </>
  );

  if (mode === "quickAdd") {
    return (
      <>
        {typeControls}
        <div className="col-span-12 sm:col-span-6 lg:col-span-5">
          <Input name="name" type="text" label="Unit Name" value={values.name ?? ""} onChange={onChange} />
        </div>
        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <Input name="modelCount" type="number" label="Models" value={values.modelCount ?? 0} onChange={onChange} />
        </div>
        <div className="col-span-6 sm:col-span-3 lg:col-span-2">
          <Input name="pointsValue" type="number" label="Points" value={values.pointsValue ?? 0} onChange={onChange} />
        </div>
        {traitHiddenInputs(values)}
      </>
    );
  }

  return (
    <div className="col-span-12 grid grid-cols-12 gap-4">
      {typeControls}
      <div className="col-span-12 lg:col-span-3">
        <Input
          name="name"
          type="text"
          label="Unit Name"
          value={values.name ?? ""}
          onChange={onChange}
        />
      </div>
      <div className="col-span-6 lg:col-span-2">
        <Input
          name="modelCount"
          type="number"
          label="Model Count"
          value={values.modelCount ?? 0}
          onChange={onChange}
        />
      </div>
      <div className="col-span-6 lg:col-span-2">
        <Input
          name="pointsValue"
          type="number"
          label="Points Value"
          value={values.pointsValue ?? 0}
          onChange={onChange}
        />
      </div>
      {showCrusadePoints && (
        <div className="col-span-6 lg:col-span-2">
          <Input
            name="crusadePoints"
            type="number"
            label="Crusade Points"
            value={values.crusadePoints ?? 0}
            onChange={onChange}
          />
        </div>
      )}
      <div className="col-span-6 lg:col-span-2">
        <Input name="xp" type="number" label="XP" value={values.xp ?? 0} onChange={onChange} />
      </div>
      <div className="col-span-6 lg:col-span-2">
        <Input
          name="battlesPlayed"
          type="number"
          label="Battles Played"
          value={values.battlesPlayed ?? 0}
          onChange={onChange}
        />
      </div>
      <div className="col-span-6 lg:col-span-2">
        <Input
          name="battlesSurvived"
          type="number"
          label="Battles Survived"
          value={values.battlesSurvived ?? 0}
          onChange={onChange}
        />
      </div>
      <div className="col-span-6 lg:col-span-2">
        <Input
          name="enemyUnitsDestroyed"
          type="number"
          label="Enemy Units Destroyed"
          value={values.enemyUnitsDestroyed ?? 0}
          onChange={onChange}
        />
      </div>
      {traitFields.map(({ key, label }) => (
        <TraitListEditor
          key={key}
          name={key}
          label={label}
          items={values[key] ?? []}
          onChange={(items) => onTraitsChange(key, items)}
        />
      ))}
      {traitHiddenInputs(values)}
    </div>
  );
};

export default UnitFormFields;
