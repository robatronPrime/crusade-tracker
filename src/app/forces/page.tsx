import React from "react";
import Force from "@/components/Force";
import { Forces } from "@/models/forces";

export default async function ForcesPage() {
  const res = await fetch(`${process.env.API_URL}/forces`, {next: { revalidate: 60 },});

  if (!res.ok) {
    throw new Error(`Failed to fetch forces (status: ${res.status})`);
  }

  const data: Forces[] = (await res.json()) as Forces[];

  return <Force data={data} />;
}

