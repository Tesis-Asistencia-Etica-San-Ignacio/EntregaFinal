import { useQuery } from '@tanstack/react-query';
import { getIaProviders, IaProvider } from '@/services/iaService';
import { useNotify } from '@/hooks/useNotify';
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants';

interface IaProvidersResponse {
    success: boolean
    models: IaProvider[]
}

export const useIaProviders = () => {
    const { notifyError } = useNotify();

    return useQuery<IaProvider[], Error>({
        queryKey: QUERY_KEYS.IA_PROVIDERS,
        ...DEFAULT_QUERY_OPTIONS,
        queryFn: async () => {
            try {
                const response = await getIaProviders() as unknown as IaProvidersResponse
                return response.models
            } catch (err: any) {
                console.error('Error cargando proveedores IA:', err);
                notifyError({
                    title: 'No se pudieron cargar los proveedores de IA',
                    description: 'Usando lista local por defecto.',
                    icon: '🚫',
                    closeButton: true,
                });
                return [];
            }
        },
    });
};