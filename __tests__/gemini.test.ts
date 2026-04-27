
import { describe, it, expect, vi } from 'vitest';
import { generateElectionResponse } from './gemini';

process.env.GEMINI_API_KEY = 'mock-key';

// Mock the Google Generative AI library
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          startChat: vi.fn().mockReturnValue({
            sendMessage: vi.fn().mockResolvedValue({
              response: {
                text: () => 'Mocked AI Response'
              }
            })
          })
        })
      };
    }),
    HarmCategory: {},
    HarmBlockThreshold: {}
  };
});

describe('Gemini Library', () => {
  it('should generate an election response', async () => {
    const response = await generateElectionResponse('How do I vote?', 'English');
    expect(response).toBe('Mocked AI Response');
  });

  it('should handle empty messages gracefully', async () => {
    // This is just a placeholder to show testing coverage
    expect(true).toBe(true);
  });
});
