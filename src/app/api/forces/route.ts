import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}

export async function forces(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const forces = await fetch("localhost:5050/forces");
    console.log(forces);

    res.status(200).json({ message: JSON.stringify(forces) })
  } catch (error) {
    res.status(500).json({message: `Forces failed with ${error}`})
  }
}