import { SYSTEM_PROMPT } from "./system";
import type { PromptResponseDto } from "../dtos/prompt.dto";

export const getAnalysisPrompt = (documentContent: string, prompts: PromptResponseDto[], provider: string) => {
  const questionsText = prompts
    .map(q => `[${q.codigo}] ${q.texto}`)
    .join("\n");

  return {
    system: `
    ${SYSTEM_PROMPT}

    ${provider === 'gemini' ? '' : `
      IMPORTANTE PARA GROQ:
      
      - El texto fue extraído de un PDF, puede tener algunos problemas de formato
      - Debes reorganizar y limpiar el texto para que sea legible
      - SIEMPRE usa espacios entre palabras en tus respuestas
      - Mantén la información original pero mejora la legibilidad`}
    `,
    user: `
      DOCUMENTO A ANALIZAR:
      
      ${provider === 'gemini' ? 'ANALIZA EL DOCUMENTO PDF ADJUNTO Y RESPONDE LAS SIGUIENTES PREGUNTAS:' : documentContent}
      
      PREGUNTAS A RESPONDER:
      ${questionsText}
      
      RECORDATORIO CRÍTICO:
      - Todas las justificaciones deben tener espacios entre palabras
      - NO copies texto pegado sin reformatearlo
      - Usa puntuación apropiada en todas las respuestas
      - Cada campo "justification" debe ser una oración clara y legible
      ${provider === 'gemini' ? '' : `IMPORTANTE: Tu respuesta debe ser EXACTAMENTE este formato JSON (sin texto adicional):
        ${JSON.stringify({
        analysis: prompts.map(q => ({
          description: "",
          codeNumber: q.codigo, 
          status: "true or false",
          justification: "No puede ser un texto pegado o sin espacios a pesar de que el texto original lo sea",
          cita: ""
        })),
      }, null, 2)}
        El status debe ser un booleano. 
        No debe tener comillas
        RESPONDE ÚNICAMENTE CON EL JSON COMPLETO.`}
      
      `
  };
};

export function validateTextFormattingStrict(jsonResponse: any): boolean {
  if (!jsonResponse || typeof jsonResponse !== 'object') {
    console.log('La respuesta no es un objeto válido');
    return false;
  }

  if (!jsonResponse.analysis || !Array.isArray(jsonResponse.analysis)) {
    console.log('Respuesta no contiene "analysis" o no es un array');
    return false;
  }

  for (const item of jsonResponse.analysis) {
    if (!item || typeof item !== 'object') {
      console.log('Item del análisis no es un objeto válido');
      return false;
    }

    // Solo revisar justification si status es true
    if (item.status === true && item.justification && typeof item.justification === 'string') {
      const justification = item.justification;

      // Detectar texto pegado: 35 caracteres consecutivos sin espacios
      if (/\S{35,}/.test(justification)) {
        console.log(`Texto pegado detectado en justification: ${justification}`);
        return false;
      }
    }
  }

  return true;
}



