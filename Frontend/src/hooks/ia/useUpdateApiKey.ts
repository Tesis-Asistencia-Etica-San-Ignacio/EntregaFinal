import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateApiKey } from '@/services/iaService'
import { useNotify } from '@/hooks/useNotify'
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants'

interface UpdateApiKeyVariables {
    provider: string
    apiKey: string
}

export default function useUpdateApiKey() {
    const qc = useQueryClient()
    const { notifySuccess, notifyError } = useNotify()

    const mutation = useMutation<void, Error, UpdateApiKeyVariables>({
        mutationFn: vars => updateApiKey(vars),
        ...DEFAULT_QUERY_OPTIONS,
        onSuccess: (_,) => {
            notifySuccess({
                title: 'API Key actualizada',
                icon: '✅',
                closeButton: true,
            })
            qc.invalidateQueries({ queryKey: QUERY_KEYS.IA_PROVIDERS })
        },
        onError: err => {
            const errorMessage = (err as any)?.response?.data?.message ?? 'No se pudo actualizar la API Key.';
            notifyError({
                title: 'Error al actualizar API Key',
                description: errorMessage,
                icon: '🚫',
                closeButton: true,
            })
        },
    })

    return {
        updateApiKey: (provider: string, apiKey: string) =>
            mutation.mutateAsync({ provider, apiKey }),
        loading: mutation.isPending,
        error: mutation.error,
    }
}
