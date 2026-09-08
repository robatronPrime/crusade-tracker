import { NextResponse } from "next/server";
import { callOpenHammerTool } from "@/lib/openhammer";
import { handleOpenHammerError } from "@/lib/openhammerHttp";

export async function GET() {
  try {
    const result = await callOpenHammerTool("list_editions", {});
    const editions = Array.isArray(result) ? result.map(String) : [];
    return NextResponse.json({ editions });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
