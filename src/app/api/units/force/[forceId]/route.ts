import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ forceId: string }> }
) {
  const { forceId } = await params;

  try {
    const response = await fetch(
      `${process.env.API_URL}/units/force/${forceId}`,
      { cache: "no-store" }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
}
