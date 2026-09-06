"use server";

import { revalidatePath } from "next/cache";
import {
  addUnitSchema,
  forceSchema,
  forceUnitSchema,
  updateUnitSchema,
} from "./schema";

function formString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : "";
}

function parseTraitList(raw: FormDataEntryValue | null) {
  if (raw == null || raw === "") return [];
  if (typeof raw !== "string") return null;
  try {
    return normalizeTraitList(JSON.parse(raw));
  } catch {
    return null;
  }
}

function normalizeTraitList(raw: unknown): UnitWargear[] | null {
  if (!Array.isArray(raw)) return null;
  return raw
    .map((item, index) => {
      const parsedId = Number((item as { id?: number })?.id);
      return {
        id: Number.isFinite(parsedId) ? parsedId : index + 1,
        name: String((item as { name?: string })?.name ?? "").trim(),
        desc: String((item as { desc?: string })?.desc ?? ""),
      };
    })
    .filter((item) => item.name.length > 0);
}

function parseUnitsField(raw: FormDataEntryValue | null) {
  if (raw == null || raw === "") return [];
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((u) => ({
      name: String(u.name ?? u.unitName ?? ""),
      modelCount: Number(u.modelCount ?? 0),
      pointsValue: Number(u.pointsValue ?? 0),
      crusadePoints: Number(u.crusadePoints ?? 0),
      type: String(u.type ?? ""),
      xp: Number(u.xp ?? 0),
      battlesPlayed: Number(u.battlesPlayed ?? 0),
      battlesSurvived: Number(u.battlesSurvived ?? 0),
      enemyUnitsDestroyed: Number(u.enemyUnitsDestroyed ?? 0),
      wargear: normalizeTraitList(u.wargear) ?? [],
      enhancements: normalizeTraitList(u.enhancements) ?? [],
      battleHonours: normalizeTraitList(u.battleHonours) ?? [],
      battleScars: normalizeTraitList(u.battleScars) ?? [],
    }));
  } catch {
    return null;
  }
}

export async function createForce(
  prevState: CreateFormState,
  formData: FormData
): Promise<CreateFormState> {
  const unitsParsed = parseUnitsField(formData.get("units"));
  if (unitsParsed === null) {
    return { success: false, message: "Invalid units payload." };
  }

  const unitsCheck = forceUnitSchema.array().safeParse(unitsParsed);
  if (!unitsCheck.success) {
    return { success: false, message: "Validation failed." };
  }

  const validatedFields = forceSchema.safeParse({
    id: formData.get("id"),
    supplyLimit: Number(formData.get("supplyLimit")) || 0,
    name: formData.get("name"),
    units: unitsCheck.data,
    userId: formData.get("userId"),
    victories: Number(formData.get("victories")) || 0,
    battleTally: Number(formData.get("battleTally")) || 0,
    requisitionPoints: Number(formData.get("requisitionPoints")) || 0,
    recordOfAchievement: formString(formData, "recordOfAchievement"),
  });

  if (!validatedFields.success) {
    return { success: false, message: "Validation failed." };
  }

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/forces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data?.error === "Supply limit exceeded") {
        return {
          success: false,
          message: `Supply limit exceeded (${data.supplyUsed}/${data.supplyLimit}).`,
        };
      }
      return { success: false, message: data?.error ?? "Failed to create force." };
    }

    revalidatePath("/forces");
    return { success: true, message: "Force created." };
  } catch (error) {
    console.error("Failed to create force:", error);
    return { success: false, message: "Network error creating force." };
  }
}

export async function addUnit(
  prevState: CreateFormState,
  formData: FormData
): Promise<CreateFormState> {
  const wargear = parseTraitList(formData.get("wargear"));
  const enhancements = parseTraitList(formData.get("enhancements"));
  const battleHonours = parseTraitList(formData.get("battleHonours"));
  const battleScars = parseTraitList(formData.get("battleScars"));
  if (wargear === null || enhancements === null || battleHonours === null || battleScars === null) {
    return { success: false, message: "Invalid unit traits payload." };
  }

  const validated = addUnitSchema.safeParse({
    forceId: formData.get("forceId"),
    name: formData.get("name"),
    modelCount: Number(formData.get("modelCount")) || 0,
    pointsValue: Number(formData.get("pointsValue")) || 0,
    crusadePoints: Number(formData.get("crusadePoints")) || 0,
    type: formString(formData, "type"),
    xp: Number(formData.get("xp")) || 0,
    battlesPlayed: Number(formData.get("battlesPlayed")) || 0,
    battlesSurvived: Number(formData.get("battlesSurvived")) || 0,
    enemyUnitsDestroyed: Number(formData.get("enemyUnitsDestroyed")) || 0,
    wargear,
    enhancements,
    battleHonours,
    battleScars,
  });

  if (!validated.success) {
    return { success: false, message: "Validation failed." };
  }

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/units`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validated.data),
    });
    const data = await response.json();

    if (!response.ok) {
      if (data?.error === "Supply limit exceeded") {
        return {
          success: false,
          message: `Supply limit exceeded (${data.supplyUsed}/${data.supplyLimit}).`,
        };
      }
      return { success: false, message: data?.error ?? "Failed to add unit." };
    }

    revalidatePath("/forces");
    return { success: true, message: "Unit added." };
  } catch (error) {
    console.error("Failed to add unit:", error);
    return { success: false, message: "Network error adding unit." };
  }
}

export async function updateUnit(
  prevState: CreateFormState,
  formData: FormData
): Promise<CreateFormState> {
  const wargear = parseTraitList(formData.get("wargear"));
  const enhancements = parseTraitList(formData.get("enhancements"));
  const battleHonours = parseTraitList(formData.get("battleHonours"));
  const battleScars = parseTraitList(formData.get("battleScars"));
  if (wargear === null || enhancements === null || battleHonours === null || battleScars === null) {
    return { success: false, message: "Invalid unit traits payload." };
  }

  const validated = updateUnitSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    modelCount: Number(formData.get("modelCount")) || 0,
    pointsValue: Number(formData.get("pointsValue")) || 0,
    crusadePoints: Number(formData.get("crusadePoints")) || 0,
    xp: Number(formData.get("xp")) || 0,
    battlesPlayed: Number(formData.get("battlesPlayed")) || 0,
    battlesSurvived: Number(formData.get("battlesSurvived")) || 0,
    enemyUnitsDestroyed: Number(formData.get("enemyUnitsDestroyed")) || 0,
    type: formString(formData, "type"),
    wargear,
    enhancements,
    battleHonours,
    battleScars,
  });

  if (!validated.success) {
    return { success: false, message: "Validation failed." };
  }

  const { id, ...body } = validated.data;

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/units/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      if (data?.error === "Supply limit exceeded") {
        return {
          success: false,
          message: `Supply limit exceeded (${data.supplyUsed}/${data.supplyLimit}).`,
        };
      }
      return { success: false, message: data?.error ?? "Failed to update unit." };
    }

    revalidatePath("/forces");
    return { success: true, message: "Unit updated." };
  } catch (error) {
    console.error("Failed to update unit:", error);
    return { success: false, message: "Network error updating unit." };
  }
}

export async function deleteUnit(unitId: string): Promise<CreateFormState> {
  if (!unitId) {
    return { success: false, message: "Unit id is required." };
  }

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/units/${unitId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data?.error ?? "Failed to delete unit." };
    }

    revalidatePath("/forces");
    return { success: true, message: "Unit deleted." };
  } catch (error) {
    console.error("Failed to delete unit:", error);
    return { success: false, message: "Network error deleting unit." };
  }
}

export async function deleteForce(forceId: string): Promise<CreateFormState> {
  if (!forceId) {
    return { success: false, message: "Force id is required." };
  }

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/forces/${forceId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data?.error ?? "Failed to delete force." };
    }

    revalidatePath("/forces");
    return { success: true, message: "Force deleted." };
  } catch (error) {
    console.error("Failed to delete force:", error);
    return { success: false, message: "Network error deleting force." };
  }
}

export async function updateForce(
  prevState: string,
  formData: FormData
): Promise<CreateFormState> {
  const validated = forceSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    supplyLimit: Number(formData.get("supplyLimit")) || 0,
    userId: formData.get("userId"),
    victories: Number(formData.get("victories")) || 0,
    battleTally: Number(formData.get("battleTally")) || 0,
    requisitionPoints: Number(formData.get("requisitionPoints")) || 0,
    recordOfAchievement: formString(formData, "recordOfAchievement"),
  });

  if (!validated.success) {
    return { success: false, message: "Validation failed." };
  }

  const { id, name, supplyLimit, victories, battleTally, requisitionPoints, recordOfAchievement } =
    validated.data;

  try {
    const response = await fetch(`${process.env.LOCALHOST}/api/forces/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        supplyLimit,
        victories,
        battleTally,
        requisitionPoints,
        recordOfAchievement: recordOfAchievement ?? "",
      }),
    });

    const text = await response.text();
    let data: { error?: string; supplyUsed?: number; supplyLimit?: number } = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }

    if (!response.ok) {
      if (data?.error === "Supply limit exceeded") {
        return {
          success: false,
          message: `Supply limit exceeded (${data.supplyUsed}/${data.supplyLimit}).`,
        };
      }
      return { success: false, message: data?.error ?? "Failed to update force." };
    }

    revalidatePath("/forces");
    revalidatePath(`/forces/${id}/edit`);
    return { success: true, message: "Force updated." };
  } catch (error) {
    console.error("Failed to update force:", error);
    return { success: false, message: "Network error updating force." };
  }
}
