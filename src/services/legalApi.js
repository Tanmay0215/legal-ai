// Legal Document Assistant API Service
const API_BASE_URL = import.meta.env.VITE_LEGAL_API_URL || "http://localhost:8000";

export class LegalApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async uploadPdf(file) {
    if (!file) {
      throw new Error("File is required");
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are allowed");
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  async askQuestion(question) {
    if (!question || typeof question !== "string" || question.trim() === "") {
      throw new Error("Question is required");
    }

    const payload = {
      question: question.trim(),
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  }

  async uploadAndChat(file, question) {
    const uploadResult = await this.uploadPdf(file);

    if (!uploadResult.success) {
      throw new Error(uploadResult.message || "Upload failed");
    }

    const chatResult = await this.askQuestion(question);

    if (!chatResult.success) {
      throw new Error(chatResult.answer || "Chat failed");
    }

    return chatResult.answer;
  }
}

// Create singleton instance
const legalApiService = new LegalApiService();

export default legalApiService;

// Export individual functions for convenience
export const healthCheck = () => legalApiService.healthCheck();
export const uploadPdf = (file) => legalApiService.uploadPdf(file);
export const askQuestion = (question) => legalApiService.askQuestion(question);
export const uploadAndChat = (file, question) =>
  legalApiService.uploadAndChat(file, question);
