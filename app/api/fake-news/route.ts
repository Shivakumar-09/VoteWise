import { NextRequest, NextResponse } from "next/server";
import { analyzeFakeNews } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide at least 20 characters of content to analyze." },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Content too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          verdict: "UNVERIFIED",
          confidence: 50,
          explanation:
            "AI service not configured. Please verify this information manually at eci.gov.in or pib.gov.in.",
          redFlags: [],
          officialSources: [
            "https://www.eci.gov.in",
            "https://pib.gov.in",
            "https://factcheck.afp.com",
          ],
        },
        { status: 200 }
      );
    }

    const result = await analyzeFakeNews(content.trim());
    return NextResponse.json(result);
  } catch (error) {
    console.error("Fake news analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze content. Please try again." },
      { status: 500 }
    );
  }
}
