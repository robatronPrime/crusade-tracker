"use server";

import { forceSchema } from "./schema";

export async function createForce(prevState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const supplyLimitRaw = formData.get("supplyLimit");
  const supplyLimit = typeof supplyLimitRaw === "string" ? Number(supplyLimitRaw) : 0;

  const validatedFields = forceSchema.safeParse({
    id: formData.get("id"),
    supplyLimit: supplyLimit,
    name: formData.get("name"),
    units: formData.get("units") || undefined,
    userId: formData.get("userId"),
    victories: Number(formData.get("victories")) || 0,
    supplyUsed: Number(formData.get("supplyUsed")) || 0,
    battleTally: Number(formData.get("battleTally")) || 0,
    requisitionPoints: Number(formData.get("requisitionPoints")) || 0,
    recordOfAchievement: formData.get("recordOfAchievement") || undefined
  });

  try {
    if (!validatedFields.success) return {success: false, message: `Validation failed. `}

    const response = await fetch(`${process.env.LOCALHOST}/api/forces`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      next: { revalidate: 60 },
      body: JSON.stringify(validatedFields.data)
    });

    if (!response.ok) {
      throw new Error("Upstream API error");
    }

    const data = await response.json();
    
    return {success: true, message: "Force created."}
  } catch (error) {
    console.error("Failed to create force:", error);
    throw error;
  }
}
