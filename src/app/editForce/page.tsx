import React from "react";
import { Forces } from "@/models/forces";
import ForceForm from "@/components/ForceForm";

export default async function EditForcePage() {
  const res = await fetch(`${process.env.API_URL}/forces`, {next: { revalidate: 60 },});

  if (!res.ok) {
    throw new Error(`Failed to fetch forces (status: ${res.status})`);
  }

  const data: Forces[] = (await res.json()) as Forces[];

  return <ForceForm />;
}

