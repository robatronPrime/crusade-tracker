"use server";

import { forceSchema } from "./schema";

export async function createForce(prevState: CreateFormState, formData: FormData): Promise<CreateFormState> {
  const supplyLimitRaw = formData.get("supplyLimit");
  const supplyLimit = typeof supplyLimitRaw === "string" ? Number(supplyLimitRaw) : 0;

  const validatedFields = forceSchema.safeParse({
    id: formData.get("id") || null,
    supplyLimit: supplyLimit || null,
    name: formData.get("name") || null,
    units: formData.get("units") || null,
    userId: formData.get("userId") || null,
    victories: formData.get("victories") || null,
    supplyUsed: formData.get("supplyUsed") || null,
    battleTally: formData.get("battleTally") || null,
    requisitionPoints: formData.get("requisitionPoints") || null,
    recordOfAchievement: formData.get("recordOfAchievement") || null
  });

  try {
    console.log(validatedFields);
    
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
