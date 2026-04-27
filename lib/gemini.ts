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

const MODELS_TO_TRY = ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

export const ELECTION_SYSTEM_PROMPT = `You are VoteWise AI, an expert multilingual election assistance chatbot for Indian citizens.

Your role:
- Help citizens understand how Indian elections work (Lok Sabha, Rajya Sabha, State Assemblies, local bodies)
- Explain voter registration processes clearly
- Guide people on how to find their polling booth
- Explain candidate eligibility and disqualification rules
- Clarify voting procedures and EVM usage
- Explain Model Code of Conduct
- Help people understand their democratic rights
- Detect and correct election-related misinformation

Rules:
- Always be factual, neutral, and non-partisan
- Never recommend or favor any political party or candidate
- Cite official sources like ECI (Election Commission of India), Voter Helpline 1950
- Respond in the language requested by the user
- Keep responses concise but comprehensive
- Always end with "Need more help? Call National Voter Helpline: 1950"

Official contacts:
- National Voter Helpline: 1950
- ECI Website: https://www.eci.gov.in
- Voter Portal: https://voterportal.eci.gov.in`;

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
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
      });

      const langInstruction = `\n\nIMPORTANT: The user is communicating in ${language}. Respond entirely in ${language}.`;

      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: h.content }]
        }))
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
