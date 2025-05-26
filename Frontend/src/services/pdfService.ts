import { requestsApi } from "@/lib/api/requestsApi";

export interface PreviewEvaluatorResult {
  blob: Blob;
  pdfId: string;
}

export const generatePdfByEvaluationId = async (
  evaluationId: string
): Promise<PreviewEvaluatorResult> => {
  const response = await requestsApi.post(
    "/pdf/preview-evaluator",
    { evaluationId },
    { responseType: "blob" }
  );
  const pdfId = response.headers["x-pdf-id"] as string;
  return { blob: response.data as Blob, pdfId };
};


export const previewInvestigatorPdf = async (
  caseData: Record<string, any>
): Promise<{ blob: Blob; pdfId: string }> => {
  const response = await requestsApi.post(
    "/pdf/preview-investigator",
    caseData,
    { responseType: "blob" }
  );

  // axios almacena headers en response.headers, case-insensitive :contentReference[oaicite:1]{index=1}
  const pdfId = response.headers["x-pdf-id"] as string;
  const blob = response.data as Blob;

  return { blob, pdfId };
};

export const getCasePdf = async (filename: string): Promise<Blob> => {
  const response = await requestsApi.get(`/files/pdf/${filename}`, {
    responseType: "blob"
  });
  return response.data;
};