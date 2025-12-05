import { DailyMissionDifficulty } from "../types/DailyMissions";

const DEFAULT_API_BASE_URL = "http://localhost:3001";

const MISSION_DIFFICULTY_TO_TYPE: Record<DailyMissionDifficulty, number> = {
  [DailyMissionDifficulty.EASY]: 0,
  [DailyMissionDifficulty.MEDIUM]: 1,
  [DailyMissionDifficulty.HARD]: 2,
};

export type PostDailyMissionXPParams = {
  address: string;
  missionDifficulty: DailyMissionDifficulty;
};

type PostDailyMissionXPApiResponse = {
  success?: boolean;
  transactionHash?: string;
};

export type PostDailyMissionXPResult = {
  success: true;
  transactionHash: string;
};

export async function postDailyMissionXP({
  address,
  missionDifficulty,
}: PostDailyMissionXPParams): Promise<PostDailyMissionXPResult> {
  if (!address) {
    throw new Error("postDailyMissionXP: address is required");
  }

  const missionType = MISSION_DIFFICULTY_TO_TYPE[missionDifficulty];

  if (missionType === undefined) {
    throw new Error(
      "postDailyMissionXP: missionDifficulty must be a valid DailyMissionDifficulty"
    );
  }

  const apiKey = import.meta.env.VITE_GAME_API_KEY;
  if (!apiKey) {
    throw new Error(
      "postDailyMissionXP: Missing VITE_GAME_API_KEY environment variable"
    );
  }

  const baseUrl =
    import.meta.env.VITE_GAME_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_BASE_URL;
  const requestUrl = `${baseUrl}/api/xp/daily-mission`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      address,
      mission_type: missionType,
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(
      `postDailyMissionXP: ${response.status} ${response.statusText}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  const json: PostDailyMissionXPApiResponse = await response.json();

  if (!json.success) {
    throw new Error(
      "postDailyMissionXP: API responded without success flag set to true"
    );
  }

  if (!json.transactionHash) {
    throw new Error(
      "postDailyMissionXP: Missing transaction hash in API response"
    );
  }

  return {
    success: true,
    transactionHash: json.transactionHash,
  };
}
