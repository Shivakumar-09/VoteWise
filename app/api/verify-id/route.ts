
import { NextRequest, NextResponse } from "next/server";
import { extractVoterIDInfo } from "@/lib/google-services";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Call Google Cloud Vision integration
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await extractVoterIDInfo(buffer);

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: "Voter ID verified using Google Cloud Vision AI" 
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
