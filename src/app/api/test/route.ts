import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        console.log("working nicely");
        return NextResponse.json({success: true});
    } catch (error) {
        console.log("error while testing: ", error);
        return NextResponse.json({success: false, message:"Internal server error"});
    }
}