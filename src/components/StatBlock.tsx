// src/components/StatBlock.tsx
import { JSX } from "react";

type StatBlockProps = {
  label: string;
  value: string | number;
};

export default function StatBlock({ label, value }: StatBlockProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs uppercase tracking-widest text-ink/60 text-center">{label}</span>
      <span className="text-lg font-bold text-ink text-center">{value}</span>
    </div>
  );
}
