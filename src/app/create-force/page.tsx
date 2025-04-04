import { Description, Field, Input, Label } from "@headlessui/react";
import Link from "next/link";
// import { useState } from "react";

export default function Home() {
  // const [forceName, setForceName] = useState("");

  return (
    <>
      <Field>
        <Label>Crusade Force Name</Label>
        <Description>
          Type your crusade force name, then click continue to begin building.
        </Description>
        <Input className={"border border-black"} />
      </Field>
    </>
  );
}
