// src/components/StatBlock.tsx
import { JSX } from "react";

type StatBlockProps = {
  label: string;
  value: string | number;
};

export default function StatBlock({ label, value }: StatBlockProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
      <span className="text-xs uppercase tracking-widest text-ink/60">{label}</span>
      <span className="text-lg font-bold text-ink">{value}</span>
    </div>
  );
}
