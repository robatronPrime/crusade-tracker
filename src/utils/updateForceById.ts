import { revalidatePath } from "next/cache";
import { getSiteUrl } from "@/lib/siteUrl";

export async function updateForceById(
  forceId: string,
  forceName: string
): Promise<CreateFormState> {
  try {
    const response = await fetch(
      `${getSiteUrl()}/api/forces/${forceId}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: forceName,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data?.error ?? "Failed to update force.",
      };
    }

    revalidatePath("/forces");
    revalidatePath(`/forces/${forceId}/edit`);

    return {
      success: true,
      message: "Force updated.",
    };
  } catch (error) {
    console.error("Failed to update force:", error);

    return {
      success: false,
      message: "Network error updating force.",
    };
  }
}
