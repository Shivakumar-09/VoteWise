import { NextRequest, NextResponse } from "next/server";
import { streamElectionResponse } from "@/lib/gemini";

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { response: "AI service is not configured." },
        { status: 200 }
      );
    }

    const stream = await streamElectionResponse(
      message.trim(),
      language,
      history.slice(-6)
    );

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (error: any) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("AI Chat error [POST /api/ai-chat]:", error.message || error);
    return NextResponse.json(
      {
        error: "Failed to get AI response.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
