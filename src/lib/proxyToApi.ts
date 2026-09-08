import { auth } from "@clerk/nextjs/server";
import { getApiUrl } from "./siteUrl";

export async function proxyToApi(path: string, init: RequestInit = {}): Promise<Response> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    console.error(`proxyToApi: no Clerk session token for ${path}`);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  try {
    const upstream = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });

    const text = await upstream.text();
    let body: string;
    if (!text) {
      body = JSON.stringify({});
    } else {
      try {
        JSON.parse(text);
        body = text;
      } catch {
        body = JSON.stringify({ error: text });
      }
    }

    if (upstream.status === 401 || upstream.status === 500) {
      console.error(`proxyToApi: upstream ${upstream.status} for ${path}`);
    }

    return new Response(body, {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Bad Gateway" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
