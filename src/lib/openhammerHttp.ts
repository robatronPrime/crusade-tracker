import { NextResponse } from "next/server";
import { OpenHammerError } from "@/lib/openhammer";

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function handleOpenHammerError(error: unknown): NextResponse {
  if (error instanceof OpenHammerError) {
    return jsonError("Datasheet service unavailable", error.status);
  }
  return jsonError("Datasheet service unavailable", 502);
}

export function parseEdition(value: string | null): string | null {
  if (value === "10e" || value === "11e") return value;
  return null;
}
