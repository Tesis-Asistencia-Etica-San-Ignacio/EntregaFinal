import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvaluationsByUser } from '@/services/evaluationService';
import { useNotify } from '@/hooks/useNotify';
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants';

export default function useGetEvaluationsByUserHook() {
  const { notifyError } = useNotify();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<any[], Error>({
    queryKey: QUERY_KEYS.EVALUATIONS,
    queryFn: getEvaluationsByUser,
    ...DEFAULT_QUERY_OPTIONS,
  });

  useEffect(() => {
    if (isError && error instanceof Error) {
      notifyError({
        title: 'Error cargando evaluaciones',
        description: error.message,
        closeButton: true,
      });
    }
  }, [isError, error, notifyError]);

  return { files: data, isLoading, refetch };
};

