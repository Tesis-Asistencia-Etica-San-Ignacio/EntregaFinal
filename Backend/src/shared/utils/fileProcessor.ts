import pdf from "pdf-parse/lib/pdf-parse";

export const readPdfContent = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error("Error al leer el archivo PDF");
  }
};  