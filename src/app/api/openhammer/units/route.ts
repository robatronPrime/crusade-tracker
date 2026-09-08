import { NextRequest, NextResponse } from "next/server";
import { callOpenHammerTool, summarizeUnit } from "@/lib/openhammer";
import { handleOpenHammerError, jsonError, parseEdition } from "@/lib/openhammerHttp";

export async function GET(req: NextRequest) {
  const edition = parseEdition(req.nextUrl.searchParams.get("edition"));
  const faction = req.nextUrl.searchParams.get("faction")?.trim() ?? "";
  const name = req.nextUrl.searchParams.get("name")?.trim() || undefined;
  if (!edition) return jsonError("edition is required", 400);
  if (!faction) return jsonError("faction is required", 400);
  try {
    const result = await callOpenHammerTool("search_units", {
      edition,
      faction,
      name: name ?? null,
      limit: 50,
    });
    const list = Array.isArray(result) ? result : [];
    const units = list.map(summarizeUnit).filter((unit): unit is NonNullable<typeof unit> => unit != null);
    return NextResponse.json({ units });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
