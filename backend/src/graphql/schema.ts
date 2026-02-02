import type { AuthUser } from "../auth/types.js";
import { authResolvers } from "../auth/resolvers.js";

export const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, context: { user: AuthUser | null }) => context.user,
  },
  Mutation: {
    register: authResolvers.register,
    login: authResolvers.login,
    refresh: authResolvers.refresh,
    logout: authResolvers.logout,
  },
};
