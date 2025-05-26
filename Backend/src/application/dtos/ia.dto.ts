export type IaOptionsDto = {
    model?: string;
    contents: string;
    systemInstruction: string;
    temperature?: number;
    maxOutputTokens?: number;
    responseType? : { 
        type: "text" | "json_object"; // Solo estos valores permitidos
      };
    pdfBuffer?: Buffer;
  };