"use client";

import { createForce } from "@/app/actions";
import { Force } from "../../types/global";
import { useState } from "react";

const ForceForm: React.FC = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setId(slugify(value));
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  return (
    <form action={createForce} className="grid gap-4">
      <label className="block">
        Name
        <input name="name" className="input" value={name} onChange={handleOnChange} />
      </label>
      <label className="block">
        Supply Limit
        <input name="supplyLimit" type="number" className="input" />
      </label>
      <input type="hidden" name="id" value={id} />

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

export default ForceForm;
