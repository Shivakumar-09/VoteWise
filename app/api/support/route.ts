import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, state, issue, description } = body;

    if (!name || !email || !state || !issue || !description) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const support = await prisma.supportRequest.create({
      data: { name, email, phone, state, issue, description },
    });

    return NextResponse.json({ success: true, id: support.id });
  } catch (error) {
    console.error("Support request error:", error);
    return NextResponse.json(
      { error: "Failed to submit request. Please call 1950 directly." },
      { status: 500 }
    );
  }
}
