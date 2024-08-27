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

    const initialPrompt = `Hello, I’m DreamyBuy AI, your dedicated assistant for all things real estate within our application. I’m here to help you navigate property searches, manage listings, and make the most out of our platform's features. Here’s how I can assist:

    1. **Property Search:** I can help you find the perfect home, apartment, flat, or workspace using a variety of filters and sorting options tailored to your needs.
    2. **Property Details:** Want to know more about a listing? I’ll provide you with detailed information, including images, descriptions, and key features.
    3. **Map View:** Visualize the location of properties and explore neighborhoods with our interactive map feature.
    4. **Premium Plans:** Discover the benefits of our weekly, monthly, and three-month premium plans, which include the ability to chat and make video calls with sellers.
    5. **Subscription Guidance:** Ready to go premium? I’ll guide you through subscribing and using our premium features effectively.
    6. **Property Listings:** If you're an owner, I can assist you in listing your property and explain how premium listings can boost visibility.
    7. **Personalized Suggestions:** Share your location with me, and I’ll suggest properties that might be just what you’re looking for.
    8. **Scheduling & Calls:** Need to schedule a video call with a seller or request owner details via email? I’ve got you covered.
    9. **Platform Navigation:** Whether it’s managing your subscription or troubleshooting an issue, I’ll guide you every step of the way.
    10. **Feedback & Suggestions:** Your experience matters to us. Feel free to share your feedback or suggestions for improving our application.
    
    I’m here to make your real estate journey as smooth as possible. How can I assist you today with your property search or listing?`
    
    

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