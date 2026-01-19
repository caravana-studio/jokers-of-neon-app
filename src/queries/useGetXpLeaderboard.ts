import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString } from "../dojo/utils/decodeString";
import mainnetGraphQLClient from "../mainnetGraphQLClient";

export const XP_LEADERBOARD_QUERY_KEY = "xp-leaderboard";

const XP_LEADERBOARD_QUERY = gql`
  query {
    jokersOfNeonProfile20SeasonProgressModels(first: 10000) {
      edges {
        node {
          level
          season_xp
          address
          has_season_pass
        }
      }
    }
    jokersOfNeonProfile20GameDataModels(first: 10000) {
      edges {
        node {
          player_name
          owner
        }
      }
    }
  }
`;

interface XpEdge {
  node: {
    level: number;
    season_xp: number;
    address: string;
    has_season_pass?: number | boolean;
  };
}

type XpLeaderboardResponse = {
  jokersOfNeonProfile20SeasonProgressModels?: {
    edges?: XpEdge[];
  };
  jokersOfNeonProfile20GameDataModels?: {
    edges?: {
      node: {
        player_name: string;
        owner: string;
      };
    }[];
  };
};

const fetchXpLeaderboard = async () => {
  const rawData: XpLeaderboardResponse = await mainnetGraphQLClient.request(
    XP_LEADERBOARD_QUERY
  );

  const edges =
    rawData?.jokersOfNeonProfile20SeasonProgressModels?.edges ?? [];
  const gameDataEdges =
    rawData?.jokersOfNeonProfile20GameDataModels?.edges ?? [];

  const blockedUsernames = new Set(["test111"]);

  const ownerToPlayerName = new Map<string, string>();
  gameDataEdges.forEach((edge) => {
    const owner = edge.node.owner?.toLowerCase?.();
    const decodedName = decodeString(edge.node.player_name ?? "");
    if (owner && decodedName) {
      ownerToPlayerName.set(owner, decodedName);
    }
  });

  const processed = edges
    .map((edge) => ({
      address: edge.node.address,
      level: Number(edge.node.level ?? 0),
      seasonXp: Number(edge.node.season_xp ?? 0),
      playerName:
        ownerToPlayerName.get(edge.node.address?.toLowerCase?.() ?? "") ?? "",
      hasSeasonPass: Boolean(edge.node.has_season_pass),
    }))
    .filter((entry) => {
      const normalizedName = entry.playerName?.toLowerCase?.();
      const normalizedAddress = entry.address?.toLowerCase?.();
      const isBlocked =
        blockedUsernames.has(normalizedName ?? "") ||
        blockedUsernames.has(normalizedAddress ?? "");
      const hasValidName = Boolean(entry.playerName);
      return entry.address && hasValidName && !isBlocked;
    });

  const sorted = processed.sort((a, b) => {
    if (a.level !== b.level) {
      return b.level - a.level;
    }
    if (a.seasonXp !== b.seasonXp) {
      return b.seasonXp - a.seasonXp;
    }
    return (
      (a.playerName || a.address).localeCompare(b.playerName || b.address)
    );
  });

  return sorted.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
};

export const useGetXpLeaderboard = () => {
  const queryResponse = useQuery([XP_LEADERBOARD_QUERY_KEY], () =>
    fetchXpLeaderboard()
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? [],
  };
};
