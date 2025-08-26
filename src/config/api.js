// Configuration for API keys and endpoints
export const config = {
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  },
};

// Helper to check if API key is configured
export function isGeminiConfigured() {
  return Boolean(config.gemini.apiKey);
}
