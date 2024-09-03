import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  GenerationConfig,
  Content,
} from "@google/generative-ai";
import IGeminiChatbot from "../../Interfaces/Utils/IGeminiChatbot";

class GeminiChatbot implements IGeminiChatbot {
  public genAI: GoogleGenerativeAI;
  public model: GenerativeModel;
  public generationConfig: GenerationConfig;
  public chatSession: ChatSession;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment variables");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    this.generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    const initialPrompt = `
    Hello, I’m DreamyBuy AI, your real estate assistant. For a quick response, here’s what I can help with:
    1. **Property Search:** Find homes, apartments, flats, or workspaces.
    2. **Details:** Get info on listings with images and descriptions.
    3. **Map View:** Explore properties on the map.
    4. **Premium Plans:** Learn about our subscription options.
    5. **Listings:** Get help with listing your property.
    
    How can I assist you today?`    
    

    const history: Content[] = [
      {
        role: "user",
        parts: [{ text: initialPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood! I'm Dream Buy AI, your real estate assistant. I'm here to help you with all things related to property search and listings. Whether you need information on available properties, assistance with premium plans, or support with scheduling viewings and contacting sellers, I'm ready to assist. What would you like to know about real estate today?",
          },
        ],
      },
    ];

    this.chatSession = this.model.startChat({
      generationConfig: this.generationConfig,
      history,
    });
  }

  public async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chatSession.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Error sending message to Zep AI:", error);
      throw error;
    }
  }
}

export default GeminiChatbot;