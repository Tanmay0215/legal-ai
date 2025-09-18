// Configuration for API endpoints
export const config = {
  legalApi: {
    baseUrl: import.meta.env.VITE_LEGAL_API_URL || "http://localhost:8000",
  },
};

// Helper to check if Legal API is configured
export function isLegalApiConfigured() {
  return Boolean(config.legalApi.baseUrl);
}
