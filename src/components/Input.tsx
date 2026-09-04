// src/components/Input.tsx
import { JSX } from "react";

type InputProps = {
  name: string;
  type: string;
  label: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = ({ name, type, label, value, onChange }: InputProps): JSX.Element => {
  return (
    <label htmlFor={name} className="flex flex-col gap-1 text-ink">
      <span className="text-xs uppercase tracking-widest text-ink/60">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-parchment border border-brass text-ink px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brass"
      />
    </label>
  );
};

export default Input;
