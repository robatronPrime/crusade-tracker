"use client";

import { ChangeEvent, JSX } from "react";
import Input from "./Input";

export type UnitFormMode = "create" | "quickAdd" | "fullEdit";

type UnitFormFieldsProps = {
  mode: UnitFormMode;
  values: Partial<Unit>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const UnitFormFields = ({ mode, values, onChange }: UnitFormFieldsProps): JSX.Element => {
  const showCrusadePoints = mode === "create" || mode === "fullEdit";
  const showProgression = mode === "fullEdit";

  return (
    <div className="col-span-12 grid grid-cols-12 gap-4">
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
      {showProgression && (
        <>
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
        </>
      )}
    </div>
  );
};

export default UnitFormFields;
