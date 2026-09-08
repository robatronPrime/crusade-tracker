import { NextRequest, NextResponse } from "next/server";
import { callOpenHammerTool } from "@/lib/openhammer";
import { handleOpenHammerError, jsonError, parseEdition } from "@/lib/openhammerHttp";

type RouteContext = { params: Promise<{ unitId: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { unitId } = await params;
  const edition = parseEdition(req.nextUrl.searchParams.get("edition"));
  if (!edition) return jsonError("edition is required", 400);
  if (!unitId) return jsonError("unit id is required", 400);
  try {
    const result = await callOpenHammerTool("get_unit", { edition, unit_id: unitId });
    if (result == null || (typeof result === "object" && result !== null && "error" in result)) {
      return jsonError("datasheet not found", 404);
    }
    const unit = Array.isArray(result) ? result[0] : result;
    if (!unit) return jsonError("datasheet not found", 404);
    return NextResponse.json({ unit });
  } catch (error) {
    return handleOpenHammerError(error);
  }
}
