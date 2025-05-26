import config from "./config";
import { GoogleGenAI } from "@google/genai";

class GeminiClientManager {
  private static instance: GeminiClientManager;
  private client: GoogleGenAI;
  private currentApiKey: string;

  private constructor() {
    this.currentApiKey = config.gemini.apiKey;
    this.client = new GoogleGenAI({
      apiKey: this.currentApiKey
    });
  }

  public static getInstance(): GeminiClientManager {
    if (!GeminiClientManager.instance) {
      GeminiClientManager.instance = new GeminiClientManager();
    }
    return GeminiClientManager.instance;
  }

  // Obtener el cliente actual
  public getClient(): GoogleGenAI {
    // Comprobar si la API key ha cambiado desde la última vez
    if (this.currentApiKey !== config.gemini.apiKey) {
      console.log('Recreando cliente Gemini con nueva API key');
      this.currentApiKey = config.gemini.apiKey;
      this.client = new GoogleGenAI({
        apiKey: this.currentApiKey
      });
    }
    return this.client;
  }

  // Forzar actualización del cliente con una nueva API key
  public updateClient(apiKey: string): GoogleGenAI {
    console.log('Actualizando cliente Gemini con API key proporcionada');
    this.currentApiKey = apiKey;
    // Actualizar también el config para mantener coherencia
    config.gemini.apiKey = apiKey;
    // Crear un nuevo cliente con la nueva API key
    this.client = new GoogleGenAI({
      apiKey: this.currentApiKey
    });
    return this.client;
  }
}

// Exportar una función para obtener el cliente de Gemini
export const getGeminiClient = (): GoogleGenAI => {
  return GeminiClientManager.getInstance().getClient();
};

// Exportar una función para actualizar el cliente con una nueva API key
export const updateGeminiClient = (apiKey: string): GoogleGenAI => {
  return GeminiClientManager.getInstance().updateClient(apiKey);
};

// Para mantener compatibilidad con código existente, también exportamos
// una instancia del cliente que se puede usar directamente
export const gemini = GeminiClientManager.getInstance().getClient();

//--------------------- Esto es para lo que responde los modelos disponibles de Gemini

export interface GeminiModel {
  name: string;
  version: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  supportedGenerationMethods: string[];
  temperature: number;
  topP: number;
  topK: number;
  maxTemperature?: number;
}

// Interfaz para la respuesta de la API
export interface GeminiApiResponse {
  models: GeminiModel[];
}