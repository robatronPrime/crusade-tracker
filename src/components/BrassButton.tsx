// src/components/BrassButton.tsx
"use client";
import { JSX } from "react";
import Link from "next/link";

type BrassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

export default function BrassButton({ href, children, className = "", ...props }: BrassButtonProps): JSX.Element {
  const base =
    "inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
