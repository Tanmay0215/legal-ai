const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateContent(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error("Gemini API key is required");
    }

    try {
      // Build conversation context from history
      const contents = [];

      // Add conversation history
      conversationHistory.forEach((msg) => {
        if (msg.role === "user") {
          contents.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        } else if (msg.role === "assistant") {
          contents.push({
            role: "model",
            parts: [{ text: msg.content }],
          });
        }
      });

      // Add current message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          contents: contents,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}. ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated from Gemini");
      }

      const candidate = data.candidates[0];
      if (candidate.finishReason === "SAFETY") {
        throw new Error("Response blocked due to safety concerns");
      }

      return (
        candidate.content.parts[0]?.text || "I couldn't generate a response."
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  }
}

// Create a singleton instance that can be configured
let geminiService = null;

export function initializeGemini(apiKey) {
  geminiService = new GeminiService(apiKey);
  return geminiService;
}

export function getGeminiService() {
  if (!geminiService) {
    throw new Error(
      "Gemini service not initialized. Call initializeGemini() first."
    );
  }
  return geminiService;
}
