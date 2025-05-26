import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvaluation } from '@/services/evaluationService';
import { QUERY_KEYS } from '@/lib/api/constants';
import { useNotify } from '@/hooks/useNotify';

const useDeleteEvaluationHook = () => {
  const qc = useQueryClient();
  const { notifySuccess, notifyError } = useNotify();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteEvaluation(id),
    onSuccess: () => {
      notifySuccess({
        title: 'Evaluación eliminada',
        description: 'Se eliminó correctamente.',
        closeButton: true,
        icon: '✅',
      });
    },
    onError: (error: any) => {
      notifyError({
        title: 'Error eliminando evaluación',
        description: error?.message,
        closeButton: true,
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.EVALUATIONS });
    },
  });

  return {
    deleteEvaluation: (id: string) => mutation.mutateAsync(id),
    loading: mutation.isPending,
  };
};

export default useDeleteEvaluationHook;
