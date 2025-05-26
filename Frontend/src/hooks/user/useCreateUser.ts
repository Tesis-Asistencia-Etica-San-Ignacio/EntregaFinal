import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/services/userService';
import { QUERY_KEYS, DEFAULT_QUERY_OPTIONS } from '@/lib/api/constants';
import type { CreateUserInput, User } from '@/types/userType';

export function useCreateUser() {
  const qc = useQueryClient();

  const mutation = useMutation<User, Error, CreateUserInput>({
    mutationFn: createUser,
    ...DEFAULT_QUERY_OPTIONS,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });

  return {
    createUser: (data: CreateUserInput) => mutation.mutateAsync(data),
    loading: mutation.isPending,
    error: mutation.error,
  };
}
