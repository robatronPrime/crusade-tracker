// import Force from "@/app/models/forces";
// import dbConnect from "@/lib/dbConnect";
// import { NextResponse } from "next/server";


// export async function GET(request: Request) {
//     await dbConnect();

//     console.log(request);
    

//     try {
//         const forces = await Force.find({});

//         NextResponse.json(JSON.stringify(forces), {status: 200});
//     } catch (error: any) {
//         NextResponse.json({ error: error.message });
//     }
    
// }

import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}