import { useState, useCallback } from "react";
import { getCasePdf } from "@/services/pdfService";
import { useNotify } from "@/hooks/useNotify";

export default function useFetchCasePdf() {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { notifyError } = useNotify();

  const fetchCasePdf = useCallback(async (filename: string) => {
    setLoading(true);
    try {
      const blob = await getCasePdf(filename);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return url;
    } catch (err: any) {
      console.error("Error fetching case PDF:", err);
      notifyError({
        title: "Error cargando PDF",
        description: "No se pudo cargar el consentimiento informado.",
        closeButton: true,
      });
      return "";
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  return { pdfUrl, fetchCasePdf, loading };
}
