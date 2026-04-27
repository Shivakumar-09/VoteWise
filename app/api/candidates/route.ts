import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get("electionId");
    const state = searchParams.get("state");

    const where: Record<string, unknown> = {};
    if (electionId) where.electionId = electionId;
    if (state) where.state = { contains: state, mode: "insensitive" };

    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        election: {
          select: { title: true, type: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("Candidates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
