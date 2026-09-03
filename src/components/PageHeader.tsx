// src/components/PageHeader.tsx
import { JSX } from "react";
import Link from "next/link";

type PageHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

export default function PageHeader({ title, backHref, backLabel = "← Back" }: PageHeaderProps): JSX.Element {
  return (
    <div className="col-span-12 flex items-center gap-4 mb-6">
      {backHref && (
        <Link href={backHref} className="text-brass text-sm hover:text-brass-hover transition-colors">
          {backLabel}
        </Link>
      )}
      <h1 className="font-display text-3xl lg:text-4xl text-parchment tracking-widest uppercase">
        {title}
      </h1>
    </div>
  );
}
