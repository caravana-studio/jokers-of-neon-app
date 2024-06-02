import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString } from "../dojo/utils/decodeString";
import graphQLClient from "../graphQLClient";

export const LEADERBOARD_QUERY_KEY = "leaderboard";

export const LEADERBOARD_QUERY = gql`
  query {
    gameModels(first: 1000, order: { field: "LEVEL", direction: "DESC" }) {
      edges {
        node {
          player_score
          level
          player_name
          id
        }
      }
    }
  }
`;

interface GameEdge {
  node: {
    player_score: number;
    level: number;
    player_name: string;
    id: number;
  };
}

interface LeaderboardResponse {
  gameModels: {
    edges: GameEdge[];
  };
}

const fetchGraphQLData = async (): Promise<LeaderboardResponse> => {
  return await graphQLClient.request(LEADERBOARD_QUERY);
};

export const useGetLeaderboard = () => {
  const queryResponse = useQuery<LeaderboardResponse>(
    [LEADERBOARD_QUERY_KEY],
    () => fetchGraphQLData()
  );
  const { data } = queryResponse;

  const dojoLeaders = data?.gameModels?.edges
    ?.filter((edge) => edge.node.player_score > 0)
    .sort((a, b) => {
      if (a.node.level !== b.node.level) {
        return b.node.level - a.node.level;
      }
      return b.node.player_score - a.node.player_score;
    })
    .map((leader, index) => {
      return {
        ...leader.node,
        position: index + 1,
        player_name: decodeString(leader.node.player_name ?? ""),
      };
    });

  return {
    ...queryResponse,
    data: dojoLeaders,
  };
};
