"use client";

import { JSX } from "react";
import InkButton from "./InkButton";

type TraitListEditorProps = {
  label: string;
  name: string;
  items: UnitWargear[];
  onChange: (items: UnitWargear[]) => void;
};

const nextId = (items: UnitWargear[]): number =>
  items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

const TraitListEditor = ({ label, name, items, onChange }: TraitListEditorProps): JSX.Element => {
  const updateItem = (index: number, field: "name" | "desc", value: string): void => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = (): void => {
    onChange([...items, { id: nextId(items), name: "", desc: "" }]);
  };

  const removeItem = (index: number): void => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-12 flex flex-col gap-2 mt-2">
      <div className="flex items-center justify-between border-b border-brass/40 pb-1">
        <span className="text-xs uppercase tracking-widest text-ink/60">{label}</span>
        <InkButton onClick={addItem}>+ Add</InkButton>
      </div>
      {items.length === 0 && <p className="text-ink/50 text-sm">None yet.</p>}
      {items.map((item, index) => (
        <div key={`${name}-${item.id}`} className="grid grid-cols-12 gap-3 items-start">
          <div className="col-span-12 sm:col-span-4">
            <input
              type="text"
              aria-label={`${label} name`}
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="w-full bg-parchment border border-brass text-ink px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <input
              type="text"
              aria-label={`${label} description`}
              placeholder="Description"
              value={item.desc}
              onChange={(e) => updateItem(index, "desc", e.target.value)}
              className="w-full bg-parchment border border-brass text-ink px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </div>
          <div className="col-span-12 sm:col-span-2 flex sm:justify-end">
            <InkButton className="text-danger hover:text-danger-hover" onClick={() => removeItem(index)}>
              Remove
            </InkButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TraitListEditor;
