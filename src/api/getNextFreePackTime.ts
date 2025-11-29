interface FreePackResponse {
  nextTime?: Date;
  canClaim: boolean;
}

export async function getNextFreePackTime(
  client: any,
  userAddress: string
): Promise<FreePackResponse> {
  if (!userAddress) {
    throw new Error("getNextFreePackTime: userAddress is required");
  }

  if (!client?.pack_system?.getNextFreePackTimestamp) {
    throw new Error(
      "getNextFreePackTime: client.pack_system.getNextFreePackTimestamp is not available"
    );
  }

  try {
    const rawTimestamp: BigInt = await client.pack_system.getNextFreePackTimestamp(
      userAddress
    );

    const epochSeconds =
      typeof rawTimestamp === "bigint"
        ? Number(rawTimestamp)
        : Number(rawTimestamp ?? 0);

    if (!Number.isFinite(epochSeconds)) {
      throw new Error(
        "getNextFreePackTime: Invalid timestamp value returned by contract"
      );
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const canClaim = epochSeconds === 0 || epochSeconds <= nowSeconds;

    return {
      canClaim,
      nextTime:
        !canClaim && epochSeconds > 0
          ? new Date(epochSeconds * 1000)
          : undefined,
    };
  } catch (error) {
    console.error("getNextFreePackTime: failed to fetch from client", error);
    return { canClaim: false };
  }
}
