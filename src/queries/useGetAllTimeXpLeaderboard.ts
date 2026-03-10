import { gql } from "graphql-tag";
import { useQuery } from "react-query";
import { decodeString } from "../dojo/utils/decodeString";
import mainnetGraphQLClient from "../mainnetGraphQLClient";

export const ALL_TIME_XP_LEADERBOARD_QUERY_KEY = "all-time-xp-leaderboard";

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
  const excludedNamePattern = /^(joker_guest_\d+|chichilo\d+|burner\d+)$/i;

  const processed = edges
    .map((edge) => ({
      address: edge.node.address,
      level: Number(edge.node.level ?? 0),
      totalXp: Number(edge.node.total_xp ?? 0),
      playerName: parseUsername(edge.node.username),
    }))
    .filter((entry) => {
      const normalizedName = entry.playerName?.toLowerCase?.();
      const normalizedAddress = entry.address?.toLowerCase?.();
      const isBlocked =
        blockedUsernames.has(normalizedName ?? "") ||
        blockedUsernames.has(normalizedAddress ?? "");
      const hasValidName = Boolean(entry.playerName);
      const isExcludedByPattern = Boolean(
        normalizedName && excludedNamePattern.test(normalizedName)
      );

      return entry.address && hasValidName && !isBlocked && !isExcludedByPattern;
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

  return sorted.map((entry, index) => ({
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
