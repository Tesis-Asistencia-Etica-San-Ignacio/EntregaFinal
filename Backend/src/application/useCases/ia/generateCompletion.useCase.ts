import { createGroqChatCompletion, sendGeminiCompletion } from "../../services";
import { IaOptionsDto } from "../../dtos";

export class GenerateCompletionUseCase {
  async execute(IaMessage: IaOptionsDto, ia: string) {
    switch (ia) {
      case "groq":
        return createGroqChatCompletion(IaMessage);
      case "gemini":
        return sendGeminiCompletion(IaMessage);
    }
  }
}