import axios from "axios";
import config from "../../../infrastructure/config";
import { GeminiModel, GeminiApiResponse } from "../../../infrastructure/config/geminiClient";
import { GroqModel, GroqApiResponse } from "../../../infrastructure/config/groqClient";

export class ObtainModelsUseCase {
    constructor() { }
    async execute() {
        let geminiModelNames: string[] = [];
        let groqModelIds: string[] = [];

        try {
            // Intenta obtener modelos de Gemini
            try {
                const gemini = await axios.get<GeminiApiResponse>(`https://generativelanguage.googleapis.com/v1/models?key=${config.gemini.apiKey}`);

                const filteredGemini = gemini.data.models.filter((model: GeminiModel) =>
                    model.inputTokenLimit > 8192 &&
                    model.outputTokenLimit >= 8192 &&
                    !model.name.toLowerCase().includes('vision') &&
                    !model.name.toLowerCase().includes('pro') &&
                    !model.name.toLowerCase().includes('image') &&
                    !model.name.toLowerCase().includes('8b')
                );
                geminiModelNames = filteredGemini.map(model => model.name.replace('models/', ''));
            } catch (error) {
                console.error(`Error al obtener modelos de Gemini: ${error instanceof Error ? error.message : "Unknown error"}`);
                geminiModelNames = []; // Array vacío en caso de error
            }

            // Intenta obtener modelos de Groq
            try {
                const groq = await axios.get<GroqApiResponse>("https://api.groq.com/openai/v1/models", {
                    headers: {
                        'Authorization': `Bearer ${config.groq.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                const filteredGroqModels = groq.data.data.filter((model: GroqModel) =>
                    model.context_window > 8192 &&
                    model.max_completion_tokens >= 8192 &&
                    !model.id.toLowerCase().includes('vision') &&
                    !model.id.toLowerCase().includes('qwen') &&
                    !model.id.toLowerCase().includes('instant') &&
                    !model.id.toLowerCase().includes('mistral')
                );
                groqModelIds = filteredGroqModels.map(model => model.id);
            } catch (error) {
                console.error(`Error al obtener modelos de Groq: ${error instanceof Error ? error.message : "Unknown error"}`);
                groqModelIds = []; // Array vacío en caso de error
            }

            return [{ "provider": "gemini", "models": geminiModelNames }, { "provider": "groq", "models": groqModelIds }];
        } catch (error) {
            // Este bloque maneja errores generales no capturados por los try-catch específicos
            console.error(`Error general en el caso de uso: ${error instanceof Error ? error.message : "Unknown error"}`);
            return [{ "provider": "gemini", "models": [] }, { "provider": "groq", "models": [] }];
        }
    }
}