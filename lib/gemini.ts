import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

const MODELS_TO_TRY = ['gemini-1.5-flash-8b', 'gemini-1.5-flash', 'gemini-flash-latest'];

export const ELECTION_SYSTEM_PROMPT = `You are VoteWise AI, a fast multilingual election assistant for India.
Help with registration, booth finding, and candidate info neutrally.
Cite ECI (1950, voterportal.eci.gov.in) always.
Keep responses very short and direct.`;

/**
 * Generates a neutral, factual response to an election-related query.
 * Uses a list of available Gemini models with automatic fallback.
 * 
 * @param userMessage - The citizen's question or message.
 * @param language - The preferred language for the response.
 * @param history - Previous chat context to maintain conversation flow.
 * @returns A promise that resolves to the AI-generated response string.
 * @throws Error if all attempts to contact the AI models fail.
 */
export async function generateElectionResponse(
  userMessage: string,
  language: string = 'English',
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = getGenAI().getGenerativeModel({
        model: modelName,
        systemInstruction: ELECTION_SYSTEM_PROMPT,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.1,
        },
      });

      const langInstruction = `\n\nIMPORTANT: The user is communicating in ${language}. Respond entirely in ${language}.`;

      // Ensure history starts with a 'user' message and alternates roles correctly
      let processedHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: h.content }]
      }));

      // Find the first user message
      const firstUserIndex = processedHistory.findIndex(h => h.role === 'user');
      if (firstUserIndex !== -1) {
        processedHistory = processedHistory.slice(firstUserIndex);
      } else {
        processedHistory = [];
      }

      const chat = model.startChat({
        history: processedHistory
      });

      const result = await chat.sendMessage(`${userMessage}${langInstruction}`);
      return result.response.text();
    } catch (err: any) {
      console.error(`Gemini Chat attempt with ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  console.error("All AI models failed. Final error:", lastError?.message || lastError);
  throw lastError || new Error("All AI models failed to respond.");
}

/**
 * Streams a response for real-time interaction using the Gemini Flash models.
 * Implements a generator-based approach for immediate feedback in the UI.
 * 
 * @param userMessage - The citizen's question.
 * @param language - The target language.
 * @param history - Conversation history for context.
 * @returns A stream of response chunks.
 */
export async function streamElectionResponse(
  userMessage: string,
  language: string = 'English',
  history: Array<{ role: string; content: string }> = []
) {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = getGenAI().getGenerativeModel({
        model: modelName,
        systemInstruction: ELECTION_SYSTEM_PROMPT,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.1,
        },
      });

      const langInstruction = `\n\nIMPORTANT: The user is communicating in ${language}. Respond entirely in ${language}.`;

      let processedHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: h.content }]
      }));

      const firstUserIndex = processedHistory.findIndex(h => h.role === 'user');
      if (firstUserIndex !== -1) {
        processedHistory = processedHistory.slice(firstUserIndex);
      } else {
        processedHistory = [];
      }

      const chat = model.startChat({
        history: processedHistory
      });

      const result = await chat.sendMessageStream(`${userMessage}${langInstruction}`);
      return result.stream;
    } catch (err: any) {
      console.error(`Gemini Streaming attempt with ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI models failed to respond.");
}


export async function analyzeFakeNews(content: string): Promise<{
  verdict: 'LIKELY_TRUE' | 'UNVERIFIED' | 'LIKELY_FALSE' | 'MISLEADING'
  confidence: number
  explanation: string
  redFlags: string[]
  officialSources: string[]
}> {
  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = getGenAI().getGenerativeModel({ model: modelName });

      const prompt = `You are a fact-checker specializing in Indian election news. Analyze the following content for misinformation.

Content to analyze:
"${content}"

Respond ONLY with a valid JSON object in this exact format:
{
  "verdict": "LIKELY_TRUE" | "UNVERIFIED" | "LIKELY_FALSE" | "MISLEADING",
  "confidence": <number 0-100>,
  "explanation": "<2-3 sentence analysis>",
  "redFlags": ["<flag1>", "<flag2>"],
  "officialSources": ["<source1 with URL>", "<source2 with URL>"]
}

Be objective, cite official Indian government sources (ECI, PIB, etc.), and be concise.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Invalid JSON response from AI");
    } catch (err: any) {
      console.error(`Gemini Fake News attempt with ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  return {
    verdict: 'UNVERIFIED',
    confidence: 50,
    explanation: 'AI analysis service is currently under high load. Please check official ECI sources manually.',
    redFlags: ['Service high demand'],
    officialSources: ['https://www.eci.gov.in', 'https://pib.gov.in'],
  };
}
