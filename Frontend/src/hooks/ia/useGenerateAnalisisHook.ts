import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generateEvaluation } from "@/services/iaService";
import { useNotify } from "@/hooks/useNotify";
import { QUERY_KEYS } from "@/lib/api/constants";

function useGenerateEvaluation() {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { notifySuccess, notifyError } = useNotify();

  const generate = useCallback(async (evaluationId: string) => {
    setLoading(true);
    setError(null);

    try {
      await generateEvaluation(evaluationId);

      qc.setQueryData<any[]>(QUERY_KEYS.EVALUATIONS, old =>
        old
          ? old.map(ev =>
            ev.id === evaluationId
              ? { ...ev, estado: "EN CURSO", updatedAt: new Date().toISOString() }
              : ev
          )
          : []
      );

      // resto idéntico
      notifySuccess({
        title: "Evaluación generada correctamente",
        closeButton: true,
        icon: "✅",
      });
      return true;
    } catch (err: any) {
      const e = err instanceof Error ? err : new Error("Error desconocido");
      setError(e);
      notifyError({
        title: "Error al generar la evaluación",
        description: e.message,
        closeButton: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [notifySuccess, notifyError, qc]);

  return { generate, loading, error };
}

export default useGenerateEvaluation;
