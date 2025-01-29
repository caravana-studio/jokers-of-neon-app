import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString, encodeString } from "../dojo/utils/decodeString";
import graphQLClient from "../graphQLClient";
import { useGameContext } from "../providers/GameProvider";

export const LEADERBOARD_QUERY_KEY = "leaderboard";

export const LEADERBOARD_QUERY = gql`
  query ($modId: String!) {
    jokersOfNeonCoreGameModels(
      where: { mod_idEQ: $modId }
      first: 10000
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
  jokersOfNeonCoreGameModels: {
    edges: GameEdge[];
  };
}

const getPrize = (position: number): number => {
  if (position >= 3 && position <= 6) {
    return 100;
  } else if (position >= 7 && position <= 10) {
    return 50;
  }
  switch (position) {
    case 1:
      return 300;
    case 2:
      return 200;
    default:
      return 0;
  }
};

export const CURRENT_LEADER_NAME_KEY = "current_leader_name";

const fetchGraphQLData = async (
  modId: string
): Promise<LeaderboardResponse> => {
  console.log("modId", modId);
  console.log("modId eb", encodeString(modId));
  return await graphQLClient.request(LEADERBOARD_QUERY, {
    modId: encodeString(modId),
  });
};

export const useGetLeaderboard = (gameId?: number) => {
  const { modId } = useGameContext();
  const queryResponse = useQuery<LeaderboardResponse>(
    [LEADERBOARD_QUERY_KEY, modId, gameId],
    () => fetchGraphQLData(modId)
  );
  const { data } = queryResponse;
  console.log("data", data);

  const dojoLeaders = data?.jokersOfNeonCoreGameModels?.edges
    ?.filter((edge) => edge.node.player_score > 0)
    .sort((a, b) => {
      if (a.node.level !== b.node.level) {
        return b.node.level - a.node.level;
      }
      return b.node.player_score - a.node.player_score;
    })
    .reduce((acc, leader) => {
      const playerName = decodeString(leader.node.player_name ?? "");
      const playerScore = leader.node.player_score;
      const playerLevel = leader.node.level;

      if (leader.node.id === gameId) {
        acc.set(CURRENT_LEADER_NAME_KEY, {
          ...leader.node,
          player_name: playerName,
        });
      } else if (!acc.has(playerName)) {
        acc.set(playerName, { ...leader.node, player_name: playerName });
      } else {
        const existingLeader = acc.get(playerName)!;

        if (
          playerLevel > existingLeader.level ||
          (playerLevel === existingLeader.level &&
            playerScore > existingLeader.player_score)
        ) {
          acc.set(playerName, { ...leader.node, player_name: playerName });
        }
      }

      return acc;
    }, new Map<string, { id: number; player_name: string; player_score: number; level: number }>());

  const leaderboard = Array.from(dojoLeaders?.values() ?? []).map(
    (leader, index) => ({
      ...leader,
      position: index + 1,
      prize: getPrize(index + 1),
    })
  );

  return {
    ...queryResponse,
    data: leaderboard,
  };
};
