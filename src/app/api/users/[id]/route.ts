import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  try {
    const response = await fetch(`${process.env.API_URL}/users/${id}`, {
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
