import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/services/userService';
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants';
import { useNotify } from '@/hooks/useNotify';
import type { UpdateUserInput, User } from '@/types/userType';

export function useUpdateUser() {
  const qc = useQueryClient();
  const { notifySuccess, notifyError } = useNotify();

  const mutation = useMutation<User, Error, UpdateUserInput>({
    mutationFn: updateUser,
    ...DEFAULT_QUERY_OPTIONS,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      notifySuccess({
        title: 'Cuenta actualizada',
        description: 'Se guardaron los cambios de tu cuenta.',
        icon: '✅',
        closeButton: true,
      });
    },
    onError: err => {
      notifyError({
        title: 'Error al actualizar cuenta',
        description:
          (err as any)?.response?.data?.message ??
          'No se pudieron guardar los cambios.',
        icon: '🚫',
        closeButton: true,
      });
    },
  });

  return {
    updateUser: (data: UpdateUserInput) => mutation.mutateAsync(data),
    loading: mutation.isPending,
    error: mutation.error,
  };
}
