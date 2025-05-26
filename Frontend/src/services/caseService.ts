import { requestsApi } from "@/lib/api/requestsApi";
import type { FileItem } from "@/types/fileType";

/**
 * Guarda el PDF previamente cacheado.
 *    Envía el mismo body + el header X-Pdf-Id.
 */
export const createCase = async (caseData: Record<string, any>, pdfId: string): Promise<void> => {
  await requestsApi.post("/cases", caseData,
    {
      headers: { "Content-Type": "application/json", "X-Pdf-Id": pdfId },
    }
  );
};

/**
 * • getCasesByUser y deleteCase permanecen igual.
 * • Ya no necesitas generatePdfInvestigator por separado.
 */
export const getCasesByUser = async (): Promise<FileItem[]> => {
  const response = await requestsApi.get("/cases/my");
  return response.data;
};

export const deleteCase = async (caseId: string): Promise<void> => {
  await requestsApi.delete(`/cases/${caseId}`);
};

