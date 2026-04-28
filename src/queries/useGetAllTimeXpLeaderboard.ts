import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { resolveUsernameMap } from "../api/usernames";
import { decodeString } from "../dojo/utils/decodeString";
import mainnetGraphQLClient from "../mainnetGraphQLClient";
import { addressKey } from "../utils/starknetAddress";

export const ALL_TIME_XP_LEADERBOARD_QUERY_KEY = "all-time-xp-leaderboard";
const MAX_ALL_TIME_XP_LEADERBOARD_PLAYERS = 50;

const ALL_TIME_XP_LEADERBOARD_QUERY = gql`
  query {
    jokersOfNeonProfile20ProfileModels(first: 10000) {
      edges {
        node {
          address
          username
          total_xp
          level
        }
      }
    }
  }
`;

interface AllTimeXpEdge {
  node: {
    address: string;
    username?: string;
    total_xp: number | string;
    level?: number;
  };
}

type AllTimeXpLeaderboardResponse = {
  jokersOfNeonProfile20ProfileModels?: {
    edges?: AllTimeXpEdge[];
  };
};

const parseUsername = (value?: string) => {
  if (!value) {
    return "";
  }

  try {
    return decodeString(value);
  } catch (_error) {
    return value;
  }
};

const fetchAllTimeXpLeaderboard = async () => {
  const rawData: AllTimeXpLeaderboardResponse = await mainnetGraphQLClient.request(
    ALL_TIME_XP_LEADERBOARD_QUERY
  );

  const edges = rawData?.jokersOfNeonProfile20ProfileModels?.edges ?? [];
  const blockedUsernames = new Set(["test111"]);
  const excludedNamePattern = /^(joker_guest_\d+|guest_[a-z0-9]+|chichilo\d+|burner\d+)$/i;
  const usernameMap = await resolveUsernameMap(
    edges.map((edge) => edge.node.address).filter(Boolean)
  ).catch(() => new Map<string, string>());

  const processed = edges
    .map((edge) => ({
      address: edge.node.address,
      level: Number(edge.node.level ?? 0),
      totalXp: Number(edge.node.total_xp ?? 0),
      playerName:
        usernameMap.get(addressKey(edge.node.address)) ??
        parseUsername(edge.node.username),
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
    if (a.totalXp !== b.totalXp) {
      return b.totalXp - a.totalXp;
    }

    if (a.level !== b.level) {
      return b.level - a.level;
    }

    return (
      (a.playerName || a.address).localeCompare(b.playerName || b.address)
    );
  });

  return sorted
    .slice(0, MAX_ALL_TIME_XP_LEADERBOARD_PLAYERS)
    .map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));
};

export const useGetAllTimeXpLeaderboard = () => {
  const queryResponse = useQuery([ALL_TIME_XP_LEADERBOARD_QUERY_KEY], () =>
    fetchAllTimeXpLeaderboard()
  );

  return {
    ...queryResponse,
    data: queryResponse.data ?? [],
  };
};
