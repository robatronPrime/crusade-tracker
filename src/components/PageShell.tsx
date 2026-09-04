// src/components/PageShell.tsx
import { JSX } from "react";

export default function PageShell({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-bg grid grid-cols-12 gap-4 lg:gap-8 px-4 lg:px-8 pt-8 grid-rows-[auto_1fr]">
      {children}
    </div>
  );
}
