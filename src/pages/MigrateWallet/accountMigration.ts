import {
  GAME_API_KEY,
  getApiUrl,
} from "../../marketplace/config/contracts";

type AccountMigration = {
  id: string;
  controller_address: string;
  cavos_address: string;
  xp: number;
  created_at: string;
  updated_at: string;
};

type AccountMigrationResponse = {
  success: true;
  created: boolean;
  data: AccountMigration;
};

type AccountMigrationErrorResponse = {
  success?: false;
  code?: string;
  error?: string;
};

export const trackAccountMigration = async ({
  controllerAddress,
  cavosAddress,
}: {
  controllerAddress: string;
  cavosAddress: string;
}): Promise<AccountMigrationResponse> => {
  if (!GAME_API_KEY) {
    throw new Error("Account migration API key is not configured");
  }

  const response = await fetch(
    `${getApiUrl().replace(/\/$/, "")}/v1/user/account-migrations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": GAME_API_KEY,
      },
      body: JSON.stringify({
        controller_address: controllerAddress,
        cavos_address: cavosAddress,
      }),
    },
  );
  const result = (await response.json()) as
    | AccountMigrationResponse
    | AccountMigrationErrorResponse;

  if (!response.ok || result.success !== true) {
    throw new Error(
      "error" in result && result.error
        ? result.error
        : "Failed to track account migration",
    );
  }

  return result;
};
