// src/components/InkButton.tsx
"use client";
import { JSX } from "react";
import Link from "next/link";

type InkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

export default function InkButton({ href, children, className = "", ...props }: InkButtonProps): JSX.Element {
  const base =
    "inline-block text-ink underline text-sm hover:text-ink/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
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
