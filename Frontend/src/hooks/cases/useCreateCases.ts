import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCase, getCasesByUser } from "@/services/caseService";
import { QUERY_KEYS } from "@/lib/api/constants";
import { useNotify } from "@/hooks/useNotify";
import { FileItem } from "@/types/fileType";

export default function useCreateCaseHook() {
  const qc = useQueryClient();
  const { notifySuccess, notifyError } = useNotify();

  const mutation = useMutation<void, Error, { caseData: Record<string, any>; pdfId: string }>({
    mutationFn: ({ caseData, pdfId }) => createCase(caseData, pdfId),
    onSuccess: async () => {
      const updatedList = await getCasesByUser();
      qc.setQueryData<FileItem[]>(QUERY_KEYS.CASES, updatedList);
      notifySuccess({
        title: "Caso guardado",
        description: "Se añadió al historial correctamente.",
        icon: "✅",
        closeButton: true,
      });
    },
    onError: err =>
      notifyError({
        title: "Error guardando caso",
        description: err.message,
        closeButton: true,
      }),
  });

  return {
    createCase: (caseData: Record<string, any>, pdfId: string) =>
      mutation.mutateAsync({ caseData, pdfId }),
  };
}
