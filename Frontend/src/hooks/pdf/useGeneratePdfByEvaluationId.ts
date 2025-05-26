import { useState, useCallback, useRef, useEffect } from "react";
import { generatePdfByEvaluationId } from "@/services/pdfService";
import { useNotify } from "@/hooks/useNotify";

export interface UseEvaluatorPdf {
  pdfUrl: string;
  pdfId: string;
  loading: boolean;
  fetchPdf: (evaluationId: string) => Promise<string>;
  clear: () => void;
}

export default function useGeneratePdfByEvaluationId(): UseEvaluatorPdf {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfId, setPdfId] = useState("");
  const [loading, setLoading] = useState(false);
  const prevUrlRef = useRef("");

  const { notifySuccess, notifyError } = useNotify();

  const fetchPdf = useCallback(async (evaluationId: string) => {
    if (!evaluationId) return "";
    setLoading(true);
    try {
      const { blob, pdfId } = await generatePdfByEvaluationId(evaluationId);

      // revocar anterior
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);

      const objectUrl = URL.createObjectURL(blob);
      prevUrlRef.current = objectUrl;
      setPdfUrl(objectUrl);
      setPdfId(pdfId);

      notifySuccess({
        title: "PDF generado",
        description: "Vista previa disponible.",
        icon: "✅",
        closeButton: true,
      });

      return objectUrl;
    } catch (err: any) {
      console.error("Error al generar PDF:", err);
      notifyError({
        title: "Error PDF",
        description: err?.message ?? "No se pudo generar la vista previa.",
        closeButton: true,
      });
      return "";
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError]);

  const clear = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = "";
    }
    setPdfUrl("");
    setPdfId("");
  }, []);

  // limpia al desmontar
  useEffect(() => () => clear(), [clear]);

  return { pdfUrl, pdfId, loading, fetchPdf, clear };
}
