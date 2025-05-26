import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePromptText } from '@/services/promptService'
import type { UpdatePromptTextParams } from '@/types/promptType'
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants'
import { useNotify } from '@/hooks/useNotify'

interface Vars {
  id: string
  data: UpdatePromptTextParams
  name?: string
}

export default function useUpdatePromptText() {
  const qc = useQueryClient()
  const { notifySuccess, notifyError } = useNotify()

  const mutation = useMutation<void, Error, Vars>({
    mutationFn: ({ id, data }) => updatePromptText(id, data),
    ...DEFAULT_QUERY_OPTIONS,
    onSuccess: (_, { id, name }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.PROMPTS })
      notifySuccess({
        title: 'Prompt actualizado',
        description: `Prompt ${name ?? id} guardado correctamente.`,
        icon: '✅',
        closeButton: true,
      })
    },
    onError: (err, { id, name }) => {
      notifyError({
        title: `Error en prompt ${name ?? id}`,
        description: err.message ?? 'No se pudo actualizar el prompt.',
        closeButton: true,
      })
    },
  })

  return {
    updatePromptText: (id: string, data: UpdatePromptTextParams, name?: string) =>
      mutation.mutateAsync({ id, data, name }),
    loading: mutation.isPending,
  }
}
