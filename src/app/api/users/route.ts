import { ObjectId } from "mongoose";
import { NextRequest } from "next/server";

interface UserRequestBody {
  clerkID: string;
  forces: ObjectId[];
}

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${process.env.API_URL}/users`, {
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
  const { clerkID, forces }: UserRequestBody = await req.json();

  try {
    const response = await fetch(`${process.env.API_URL}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      next: { revalidate: 60 },
      body: JSON.stringify({
        clerkID: clerkID,
        forces: forces
      })
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
