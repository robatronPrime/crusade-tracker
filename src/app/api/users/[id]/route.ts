import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxyToApi";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToApi(`/users/${id}`);
}
