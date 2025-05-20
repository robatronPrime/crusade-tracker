import { error } from "console";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.API_URL}/forces`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Upstream API error" }), {
        status: 500
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await fetch(`${process.env.API_URL}/forces`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      next: { revalidate: 60 },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Upstream API error" }), {
        status: 500
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
}
