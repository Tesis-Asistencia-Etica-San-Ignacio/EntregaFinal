import { useState, useCallback, useRef, useEffect } from "react";
import { previewInvestigatorPdf } from "@/services/pdfService";
import { useNotify } from "@/hooks/useNotify";

interface UseGeneratePdfResult {
  fetchPdfInvestigator: (data: Record<string, any>) => Promise<string>;
  pdfUrl: string;
  pdfId: string;
  loading: boolean;
  clearPdf: () => void;
}

const useGeneratePdfByInvestigator = (): UseGeneratePdfResult => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfId, setPdfId] = useState("");
  const [loading, setLoading] = useState(false);
  const prevUrlRef = useRef<string>("");

  const { notifySuccess, notifyError } = useNotify();

  const fetchPdfInvestigator = useCallback(
    async (data: Record<string, any>): Promise<string> => {
      if (!data) return "";
      setLoading(true);
      try {
        const { blob, pdfId } = await previewInvestigatorPdf(data);

        // Revocar URL anterior
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
        }

        // Crear nueva URL y guardar el pdfId en estado
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
          description: err?.message ?? "No se pudo generar vista previa.",
          closeButton: true,
        });
        return "";
      } finally {
        setLoading(false);
      }
    },
    [notifySuccess, notifyError]
  );

  const clearPdf = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = "";
    }
    setPdfUrl("");
    setPdfId("");
  }, []);

  useEffect(() => {
    return () => clearPdf();
  }, [clearPdf]);

  return {
    fetchPdfInvestigator,
    pdfUrl,
    pdfId,
    loading,
    clearPdf,
  };
};

export default useGeneratePdfByInvestigator;
