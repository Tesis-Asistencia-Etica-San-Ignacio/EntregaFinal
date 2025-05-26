import { getGroqClient } from "../../infrastructure/config/groqClient";
import { IaOptionsDto } from "../dtos";
import { validateTextFormattingStrict } from "../prompts/analisis.prompt";

export async function createGroqChatCompletion(
  ia: IaOptionsDto,
) {
  const maxAttempts = 5;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const groq = getGroqClient();
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: ia.systemInstruction }, { role: "user", content: ia.contents }],
        model: ia.model || "deepseek-r1-distill-llama-70b",
        temperature: ia.temperature ?? 0.5,
        max_tokens: ia.maxOutputTokens ?? 4096,
        response_format: ia.responseType || { type: "text" },
      });
      const responseText = response.choices[0].message?.content;
      if (!responseText) {
        throw new Error("Respuesta vacía de Groq");
      }

      console.log("Respuesta de Groq:", responseText);

      try {
        const jsonResponse = JSON.parse(responseText);

        if (validateTextFormattingStrict(jsonResponse)) {
          return responseText;
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
      console.log(`Intento ${attempts}: Error en la llamada a Groq: ${error}`);

      if (attempts >= maxAttempts) {
        throw new Error(`Error después de ${maxAttempts} intentos: ${error}`);
      }
    }
  }
  throw new Error("No se pudo obtener respuesta con formato correcto");
}

