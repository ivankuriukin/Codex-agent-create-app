import { ApolloClient, ApolloProvider as ApolloRootProvider, HttpLink, InMemoryCache } from "@apollo/client";
import type { ReactNode } from "react";
import { apiBaseUrl } from "@config/env";

type ApolloProviderProps = {
  children: ReactNode;
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${apiBaseUrl}/graphql`,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloRootProvider client={client}>{children}</ApolloRootProvider>;
}
