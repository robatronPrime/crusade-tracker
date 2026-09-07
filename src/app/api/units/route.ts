import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxyToApi";

export async function POST(req: NextRequest) {
  const body = await req.text();
  return proxyToApi("/units", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}
