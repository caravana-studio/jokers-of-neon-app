import { SEASON_NUMBER } from "../constants/season";

export type GetPlayerLivesParams = {
  playerAddress: string;
  seasonId?: number;
};

export type PlayerLivesApiResponse = {
  success: boolean;
  data?: {
    player: string;
    season_id: string;
    available_lives: number;
    max_lives: number;
    next_live_timestamp?: Date;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function getPlayerLives(
  client: any,
  { playerAddress, seasonId = SEASON_NUMBER }: GetPlayerLivesParams
): Promise<PlayerLivesApiResponse> {
  if (!playerAddress) {
    throw new Error("getPlayerLives: playerAddress is required");
  }

  if (!Number.isFinite(seasonId)) {
    throw new Error("getPlayerLives: seasonId must be a finite number");
  }

  if (!client?.lives_system?.getPlayerLives) {
    throw new Error(
      "getPlayerLives: client.lives_system.getPlayerLives is not available"
    );
  }

  try {
    const result: any = await client.lives_system.getPlayerLives(
      playerAddress,
      seasonId
    );

    if (!result) {
      return { success: false };
    }

    const timestampNumber = Number(result?.next_live_timestamp ?? 0);
    const parsedTimestamp =
      Number.isFinite(timestampNumber) && timestampNumber > 0
        ? new Date(timestampNumber * 1000)
        : undefined;

    return {
      success: true,
      data: {
        player: result?.player?.toString?.() ?? playerAddress,
        season_id: (result?.season_id ?? seasonId).toString(),
        available_lives: Number(result?.available_lives ?? 0),
        max_lives: Number(result?.max_lives ?? 0),
        next_live_timestamp: parsedTimestamp,
      },
    };
  } catch (error) {
    console.error("getPlayerLives: failed to fetch from client", error);
    return { success: false };
  }
}
