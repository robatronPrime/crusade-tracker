"use server";

import { ObjectId } from "mongodb";
import { Force } from "../../types/global";
import forces from "@/models/forces";

export async function createForce(formData: FormData): Promise<void> {
  const supplyLimitRaw = formData.get("supplyLimit");
  const supplyLimit = typeof supplyLimitRaw === "string" ? Number(supplyLimitRaw) : 0;

  const rawFormData = {
    _id: ObjectId,
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    supplyLimit: supplyLimit,
    supplyUsed: 0,
    battleTally: 0,
    victories: 0,
    requisitionPoints: 0,
    units: [],
    recordOfAchievement: []
  };

  const forceDoc = new forces(rawFormData);

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/forces`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      next: { revalidate: 60 },
      body: JSON.stringify(forceDoc)
    });

    if (!response.ok) {
      throw new Error("Upstream API error");
    }

    const data = await response.json();
  } catch (error) {
    console.error("Failed to create force:", error);
    throw error;
  }
}
