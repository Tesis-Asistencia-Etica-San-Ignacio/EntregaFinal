import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { reEvaluateEvaluation } from "@/services/iaService";
import { useNotify } from "@/hooks/useNotify";
import { QUERY_KEYS } from "@/lib/api/constants";

export default function useReEvaluateEvaluation() {
    const qc = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { notifySuccess, notifyError } = useNotify();

    const reEvaluate = useCallback(async (evaluationId: string) => {
        setLoading(true);
        setError(null);

        try {
            await reEvaluateEvaluation(evaluationId);

            qc.setQueryData<any[]>(QUERY_KEYS.EVALUATIONS, old =>
                old
                    ? old.map(ev =>
                        ev.id === evaluationId
                            ? { ...ev, updatedAt: new Date().toISOString() }
                            : ev
                    )
                    : []
            );

            notifySuccess({
                title: "Re-evaluación completada",
                description: "Se ha actualizado la fecha correctamente.",
                closeButton: true,
                icon: "🔄",
            });
            return true;
        } catch (err: any) {
            const e = err instanceof Error ? err : new Error("Error desconocido");
            setError(e);
            notifyError({
                title: "Error al re-evaluar",
                description: e.message,
                closeButton: true,
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [notifySuccess, notifyError, qc]);

    return { reEvaluate, loading, error };
}
