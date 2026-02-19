import { GraphQLClient } from "graphql-request";
import { graphqlUrl } from "./config/cartridgeUrls";

const endpoint = graphqlUrl;

const graphQLClient = new GraphQLClient(endpoint);

export default graphQLClient;
