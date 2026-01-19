import { GraphQLClient } from "graphql-request";

const mainnetEndpoint =
  import.meta.env.VITE_GRAPHQL_URL_MAINNET || "http://localhost:8080/graphql";

const mainnetGraphQLClient = new GraphQLClient(mainnetEndpoint);

export default mainnetGraphQLClient;

