import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateEthicalNorm } from '@/services/ethicalNormService'
import type { UpdateEthicalRuleParams } from '@/types/ethicalNormTypes'
import { useNotify } from '@/hooks/useNotify'
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants'

export default function useUpdateEthicalNormHook(evaluationId: string) {
  const qc = useQueryClient()
  const { notifySuccess, notifyError } = useNotify()

  const mutation = useMutation<void, Error, { normId: string; updateData: UpdateEthicalRuleParams }>({
    mutationFn: ({ normId, updateData }) => updateEthicalNorm(normId, updateData),
    ...DEFAULT_QUERY_OPTIONS,
    onSuccess: () => {
      notifySuccess({
        title: 'Norma ética actualizada',
        description: 'Se guardaron los cambios correctamente.',
        closeButton: true,
        icon: '✅',
      })
      // Invalidamos la cache de normas para este evaluationId
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ETHICAL_NORMS(evaluationId) })
    },
    onError: (err: Error) => {
      notifyError({
        title: 'Error al actualizar norma ética',
        description: err.message,
        closeButton: true,
        icon: '🚫',
      })
    },
  })

  return {
    updateEthicalNorm: (normId: string, updateData: UpdateEthicalRuleParams) =>
      mutation.mutateAsync({ normId, updateData }),
    loading: mutation.isPending,
    error: mutation.error,
  }
}
