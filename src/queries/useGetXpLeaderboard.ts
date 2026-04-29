import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { resolveUsernameMap } from "../api/usernames";
import { decodeString } from "../dojo/utils/decodeString";
import mainnetGraphQLClient from "../mainnetGraphQLClient";
import { addressKey } from "../utils/starknetAddress";

export const XP_LEADERBOARD_QUERY_KEY = "xp-leaderboard";
const MAX_XP_LEADERBOARD_PLAYERS = 50;

const XP_LEADERBOARD_QUERY = gql`
  query ($seasonId: u32!) {
    jokersOfNeonProfile20SeasonProgressModels(
      first: 10000
      where: { season_idEQ: $seasonId }
    ) {
      edges {
        node {
          level
          season_xp
          address
          has_season_pass
          season_id
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

const normalizeSeasonId = (seasonId: number) => {
  if (!Number.isFinite(seasonId) || seasonId < 1) {
    return 1;
  }

  return Math.floor(seasonId);
};

const fetchXpLeaderboard = async (seasonId: number) => {
  const normalizedSeasonId = normalizeSeasonId(seasonId);
  const rawData: XpLeaderboardResponse = await mainnetGraphQLClient.request(
    XP_LEADERBOARD_QUERY,
    {
      seasonId: normalizedSeasonId,
    }
  );

  const edges =
    rawData?.jokersOfNeonProfile20SeasonProgressModels?.edges ?? [];
  const gameDataEdges =
    rawData?.jokersOfNeonProfile20GameDataModels?.edges ?? [];

  const blockedUsernames = new Set(["test111"]);
  const excludedNamePattern = /^(joker_guest_\d+|guest_?[a-z0-9]+|chichilo\d+|burner\d+)$/i;

  const ownerToPlayerName = new Map<string, string>();
  gameDataEdges.forEach((edge) => {
    const owner = addressKey(edge.node.owner);
    const decodedName = decodeString(edge.node.player_name ?? "");
    if (owner && decodedName) {
      ownerToPlayerName.set(owner, decodedName);
    }
  });

  const usernameMap = await resolveUsernameMap(
    edges.map((edge) => edge.node.address).filter(Boolean)
  ).catch(() => new Map<string, string>());

  const processed = edges
    .map((edge) => ({
      address: edge.node.address,
      level: Number(edge.node.level ?? 0),
      seasonXp: Number(edge.node.season_xp ?? 0),
      playerName:
        usernameMap.get(addressKey(edge.node.address)) ??
        ownerToPlayerName.get(addressKey(edge.node.address)) ??
        "",
      hasSeasonPass: Boolean(edge.node.has_season_pass),
    }))
    .filter((entry) => {
      const normalizedName = entry.playerName?.trim().toLowerCase();
      const normalizedAddress = entry.address?.toLowerCase?.();
      const isBlocked =
        blockedUsernames.has(normalizedName ?? "") ||
        blockedUsernames.has(normalizedAddress ?? "");
      const isExcludedByPattern = Boolean(
        normalizedName && excludedNamePattern.test(normalizedName)
      );
      return entry.address && !isBlocked && !isExcludedByPattern;
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

  return sorted.slice(0, MAX_XP_LEADERBOARD_PLAYERS).map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
};

export const useGetXpLeaderboard = (seasonId: number) => {
  const normalizedSeasonId = normalizeSeasonId(seasonId);

  const queryResponse = useQuery([XP_LEADERBOARD_QUERY_KEY, normalizedSeasonId], () =>
    fetchXpLeaderboard(normalizedSeasonId)
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? [],
  };
};
