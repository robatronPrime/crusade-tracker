// src/components/ParchmentCard.tsx
import { JSX } from "react";

type ParchmentCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ParchmentCard({ children, className = "" }: ParchmentCardProps): JSX.Element {
  return (
    <div
      className={`bg-parchment text-ink border-2 border-brass rounded-2xl shadow-inner p-6 ${className}`}
    >
      {children}
    </div>
  );
}
