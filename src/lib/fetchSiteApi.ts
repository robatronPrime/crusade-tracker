import { cookies } from "next/headers";
import { getSiteUrl } from "./siteUrl";

export async function fetchSiteApi(path: string, init: RequestInit = {}): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const headers = new Headers(init.headers);

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  return fetch(`${getSiteUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
