import { useAuthStore } from '@entities/auth';
import { useRegisterMutation } from '@shared/api/graphql';
import { useCallback } from 'react';

type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export function useRegisterStore() {
  const { setUser } = useAuthStore();
  const [registerMutation] = useRegisterMutation();

  const register = useCallback(
    async ({ email, password, name }: RegisterPayload) => {
      const result = await registerMutation({
        variables: { email, password, name },
        fetchPolicy: 'no-cache',
      });

      const nextUser = result.data?.register?.user ?? null;
      if (!nextUser) {
        throw new Error('Registration failed');
      }

      setUser(nextUser);
    },
    [registerMutation, setUser],
  );

  return { register };
}
