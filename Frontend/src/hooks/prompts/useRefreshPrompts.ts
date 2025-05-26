import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resetMyPrompts } from '@/services/promptService'
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants'
import { useNotify } from '@/hooks/useNotify'

export default function useRefreshPrompts() {
  const qc = useQueryClient()
  const { notifySuccess, notifyError } = useNotify()

  const mutation = useMutation<void, Error>({
    mutationFn: resetMyPrompts,
    ...DEFAULT_QUERY_OPTIONS,
    onSuccess: () => {
      notifySuccess({
        title: 'Prompts reiniciados',
        description: 'Se restauraron al estado base.',
        icon: '✅',
        closeButton: true,
      })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROMPTS })
    },
    onError: err => {
      notifyError({
        title: 'Error al reiniciar prompts',
        description: err.message ?? 'No se pudieron reiniciar los prompts.',
        closeButton: true,
      })
    },
  })

  return { refreshPrompts: () => mutation.mutateAsync(), loading: mutation.isPending }
}
