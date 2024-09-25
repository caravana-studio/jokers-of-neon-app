import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString } from "../dojo/utils/decodeString";
import graphQLClient from "../graphQLClient";

export const LEADERBOARD_QUERY_KEY = "leaderboard";

export const LEADERBOARD_QUERY = gql`
  query {
    jokersOfNeonGameModels(
      first: 1000
      order: { field: "LEVEL", direction: "DESC" }
    ) {
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
  jokersOfNeonGameModels: {
    edges: GameEdge[];
  };
}

const getPrize = (position: number): number => {
  if (position > 3 && position < 11) {
    return 100;
  }
  switch (position) {
    case 1:
      return 1000;
    case 2:
      return 500;
    case 3:
      return 200;
    default:
      return 0;
  }
};

const fetchGraphQLData = async (): Promise<LeaderboardResponse> => {
  return await graphQLClient.request(LEADERBOARD_QUERY);
};

export const useGetLeaderboard = () => {
  const queryResponse = useQuery<LeaderboardResponse>(
    [LEADERBOARD_QUERY_KEY],
    () => fetchGraphQLData()
  );
  const { data } = queryResponse;

  const dojoLeaders = data?.jokersOfNeonGameModels?.edges
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
        prize: getPrize(index + 1),
      };
    });

  return {
    ...queryResponse,
    data: dojoLeaders,
  };
};
