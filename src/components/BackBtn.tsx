// src/components/BackBtn.tsx
import { JSX } from "react";
import Link from "next/link";

interface BackBtnProps {
  url?: string;
  onClick?: () => void;
}

const BackBtn = ({ url, onClick }: BackBtnProps): JSX.Element => {
  if (url) {
    return (
      <Link href={url} className="text-brass text-sm hover:text-brass-hover transition-colors">
        ← Back
      </Link>
    );
  } else if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-brass text-sm hover:text-brass-hover transition-colors"
      >
        ← Back
      </button>
    );
  }
  return <></>;
};

export default BackBtn;
