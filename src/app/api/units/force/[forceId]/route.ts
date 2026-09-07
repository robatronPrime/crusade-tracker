import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxyToApi";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ forceId: string }> }) {
  const { forceId } = await params;
  return proxyToApi(`/units/force/${forceId}`);
}
