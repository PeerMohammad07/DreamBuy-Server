import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  GenerationConfig,
} from "@google/generative-ai";

// Interface for GeminiChat bot
interface IGeminiChatbot {
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;
  generationConfig: GenerationConfig;
  chatSession: ChatSession;

  sendMessage(message: string): Promise<string>;
}

export default IGeminiChatbot;