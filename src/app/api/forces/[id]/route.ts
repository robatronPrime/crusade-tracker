import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxyToApi";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(`/forces/${id}`);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.text();
  return proxyToApi(`/forces/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body,
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyToApi(`/forces/${id}`, { method: "DELETE" });
}
