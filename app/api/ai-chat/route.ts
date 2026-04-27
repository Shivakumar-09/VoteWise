import { NextRequest, NextResponse } from "next/server";
import { generateElectionResponse } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language = "English", history = [] } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          response:
            "AI service is not configured. Please add your GEMINI_API_KEY to the environment variables. In the meantime, you can call the National Voter Helpline at 1950 for assistance.",
        },
        { status: 200 }
      );
    }

    const response = await generateElectionResponse(
      message.trim(),
      language,
      history.slice(-6) // Keep last 6 messages for context
    );

    return NextResponse.json({ response });
    } catch (error: any) {
    console.error("AI Chat error [POST /api/ai-chat]:", error.message || error);
    if (error.stack) console.error(error.stack);
    
    return NextResponse.json(
      {
        error:
          "Failed to get AI response. Please try again or call Voter Helpline: 1950",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
