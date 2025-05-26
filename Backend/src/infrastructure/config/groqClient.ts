import Groq from "groq-sdk";
import config from "./config";

// Clase singleton que gestiona la instancia de Groq
class GroqClientManager {
  private static instance: GroqClientManager;
  private client: Groq;
  private currentApiKey: string;

  private constructor() {
    this.currentApiKey = config.groq.apiKey;
    this.client = new Groq({
      apiKey: this.currentApiKey
    });
  }

  public static getInstance(): GroqClientManager {
    if (!GroqClientManager.instance) {
      GroqClientManager.instance = new GroqClientManager();
    }
    return GroqClientManager.instance;
  }

  // Obtener el cliente actual
  public getClient(): Groq {
    // Comprobar si la API key ha cambiado desde la última vez
    if (this.currentApiKey !== config.groq.apiKey) {
      console.log('Recreando cliente Groq con nueva API key');
      this.currentApiKey = config.groq.apiKey;
      this.client = new Groq({
        apiKey: this.currentApiKey
      });
    }
    return this.client;
  }

  // Forzar actualización del cliente con una nueva API key
  public updateClient(apiKey: string): Groq {
    console.log('Actualizando cliente Groq con API key proporcionada');
    this.currentApiKey = apiKey;
    // Actualizar también el config para mantener coherencia
    config.groq.apiKey = apiKey;
    // Crear un nuevo cliente con la nueva API key
    this.client = new Groq({
      apiKey: this.currentApiKey
    });
    return this.client;
  }
}

// Exportar una función para obtener el cliente de Groq
export const getGroqClient = (): Groq => {
  return GroqClientManager.getInstance().getClient();
};

// Exportar una función para actualizar el cliente con una nueva API key
export const updateGroqClient = (apiKey: string): Groq => {
  return GroqClientManager.getInstance().updateClient(apiKey);
};

// Para mantener compatibilidad con código existente
export const groq = GroqClientManager.getInstance().getClient();

// Esto se usa para los modelos disponibles de Groq

export interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  active: boolean;
  context_window: number;
  public_apps: any;
  max_completion_tokens: number;
}

// Interfaz para la respuesta de la API de Groq
export interface GroqApiResponse {
  object: string;
  data: GroqModel[];
}