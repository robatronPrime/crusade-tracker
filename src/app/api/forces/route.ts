import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${process.env.API_URL}/forces`, { next: { revalidate: 60 } });

    if (!response.ok) {
      throw new Error(`Failed to fetch forces (status: ${response.status})`);
    }

    const data = await response.json();

    res.status(200).send(JSON.parse(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
