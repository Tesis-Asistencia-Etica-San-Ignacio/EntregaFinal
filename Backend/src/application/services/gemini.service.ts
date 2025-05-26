import { getGeminiClient } from "../../infrastructure/config/geminiClient";
import { IaOptionsDto } from "../dtos";
import { Type } from "@google/genai";
import { validateTextFormattingStrict } from "../prompts/analisis.prompt";


export async function sendGeminiCompletion(ia: IaOptionsDto) {
  const maxAttempts = 5;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const gemini = getGeminiClient();
      const response = await gemini.models.generateContent({
        model: ia.model || "gemini-2.0-flash",
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: ia.pdfBuffer?.toString('base64')
            }
          },
          { text: ia.contents }
        ],
        config: {
          temperature: Math.max(0.05, 0.1 - (attempts * 0.01)),
          maxOutputTokens: ia.maxOutputTokens ?? 4096,
          systemInstruction: ia.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          topP: Math.max(0.1, 0.2 - (attempts * 0.02)),
          topK: Math.max(5, 10 - attempts),
        }
      });

      console.log("Respuesta de Gemini:", response.text);

      try {
        // ✅ CORRECTO: Parsear el JSON primero
        const jsonResponse = JSON.parse(response.text!);

        if (validateTextFormattingStrict(jsonResponse)) {
          return response.text;
        } else {
          attempts++;
          console.log(`Intento ${attempts}: Formato incorrecto detectado, reintentando con parámetros más restrictivos`);
        }
      } catch (parseError) {
        attempts++;
        console.log(`Intento ${attempts}: Error al parsear JSON: ${parseError}`);
      }

    } catch (error) {
      attempts++;
      console.log(`Intento ${attempts}: Error en la llamada a Gemini: ${error}`);

      if (attempts >= maxAttempts) {
        throw new Error(`Error después de ${maxAttempts} intentos: ${error}`);
      }
    }
  }

  throw new Error("No se pudo obtener respuesta con formato correcto");
}



const responseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: "Pregunta del usuario, bien formateada con espacios"
          },
          codeNumber: { type: Type.STRING },
          status: { type: Type.BOOLEAN },
          justification: {
            type: Type.STRING,
            description: "Justificación clara y legible con espacios entre palabras y puntuación apropiada"
          },
          cita: {
            type: Type.STRING,
            description: "Ubicación específica en el documento"
          }
        },
        required: ["description", "codeNumber", "status", "justification", "cita"]
      }
    }
  },
  required: ["analysis"]
};
