import Forces from "@/app/models/forces";
import dbConnect from "../../lib/dbConnect";
import { NextResponse } from "next/server";


export async function getForces() {
    await dbConnect();

    try {
        const forces = await Forces.find({});
        console.log(forces);
        
        NextResponse.json(forces, {status: 200});
    } catch (error: any) {
        NextResponse.json({ error: error.message });
    }
}
