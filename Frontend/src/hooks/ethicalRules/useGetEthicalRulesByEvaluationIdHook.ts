import { useQuery } from '@tanstack/react-query'
import { getEthicalNormsByEvaluationId } from '@/services/ethicalNormService'
import type { EthicalNormResponseDto } from '@/types/ethicalNormTypes'
import { useNotify } from '@/hooks/useNotify'
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants'
import { useEffect } from 'react'

export default function useGetEthicalRulesByEvaluationIdHook(evaluationId: string) {
  const { notifyError } = useNotify()

  const {
    data: norms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<EthicalNormResponseDto[], Error>({
    queryKey: QUERY_KEYS.ETHICAL_NORMS(evaluationId),
    queryFn: () => getEthicalNormsByEvaluationId(evaluationId),
    enabled: !!evaluationId,
    ...DEFAULT_QUERY_OPTIONS,
  })

  // notificar en caso de error
  useEffect(() => {
    if (isError && error instanceof Error) {
      notifyError({
        title: 'Error al obtener normas éticas',
        description: error.message,
        closeButton: true,
      })
    }
  }, [isError, error, notifyError])

  return { norms, isLoading, refetch }
}
