import {
  ApolloClient,
  ApolloProvider as ApolloRootProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import type { ReactNode } from "react";
import { apiBaseUrl } from "@config/env";
import { AUTH_UNAUTHORIZED_EVENT } from "@shared/lib/auth-events";

type ApolloProviderProps = {
  children: ReactNode;
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const hasUnauthorized =
    graphQLErrors?.some((error) => error.message === "Unauthorized") ?? false;

  const statusCode =
    typeof (networkError as { statusCode?: number } | undefined)?.statusCode === "number"
      ? (networkError as { statusCode: number }).statusCode
      : undefined;

  if (hasUnauthorized || statusCode === 401 || statusCode === 403) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
  }
});

const httpLink = new HttpLink({
  uri: `${apiBaseUrl}/graphql`,
  credentials: "include",
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloRootProvider client={client}>{children}</ApolloRootProvider>;
}
