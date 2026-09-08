import { NextRequest, NextResponse } from "next/server";
import { callOpenHammerTool } from "@/lib/openhammer";
import { handleOpenHammerError, jsonError, parseEdition } from "@/lib/openhammerHttp";

export async function GET(req: NextRequest) {
  const edition = parseEdition(req.nextUrl.searchParams.get("edition"));
  if (!edition) return jsonError("edition is required", 400);
  try {
    const result = await callOpenHammerTool("list_factions", { edition });
    const factions = Array.isArray(result) ? result : [];
    return NextResponse.json({ factions });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
