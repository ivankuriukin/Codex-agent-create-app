export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
  }

  type AuthPayload {
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(email: String!, password: String!, name: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    refresh: AuthPayload!
    logout: Boolean!
  }
`;
