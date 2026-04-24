import { useEffect, useState } from "react";

export interface SeasonLoadingAssets {
  backgroundSrc: string;
  bossSrc: string;
  bottomSrc: string;
}

const availabilityCache = new Map<number, boolean>();
const pendingChecks = new Map<number, Promise<boolean>>();

const getSeasonAssets = (seasonNumber: number): SeasonLoadingAssets => {
  const basePath = `/loading-screen/s${seasonNumber}`;
  return {
    backgroundSrc: `${basePath}/bg.jpg`,
    bossSrc: `${basePath}/boss.png`,
    bottomSrc: `${basePath}/bottom.png`,
  };
};

const verifyUrlExists = async (url: string): Promise<boolean> => {
  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
    });

    if (headResponse.ok) {
      return true;
    }
  } catch {
    // Ignore HEAD errors and fall back to GET below.
  }

  try {
    const getResponse = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    return getResponse.ok;
  } catch {
    return false;
  }
};

const checkSeasonAssets = async (seasonNumber: number): Promise<boolean> => {
  const seasonAssets = getSeasonAssets(seasonNumber);
  const checks = await Promise.all([
    verifyUrlExists(seasonAssets.backgroundSrc),
    verifyUrlExists(seasonAssets.bossSrc),
    verifyUrlExists(seasonAssets.bottomSrc),
  ]);

  return checks.every(Boolean);
};

const resolveSeasonAssetsAvailability = (seasonNumber: number): Promise<boolean> => {
  const cachedAvailability = availabilityCache.get(seasonNumber);
  if (cachedAvailability !== undefined) {
    return Promise.resolve(cachedAvailability);
  }

  const pendingCheck = pendingChecks.get(seasonNumber);
  if (pendingCheck) {
    return pendingCheck;
  }

  const nextCheck = checkSeasonAssets(seasonNumber)
    .then((isAvailable) => {
      availabilityCache.set(seasonNumber, isAvailable);
      pendingChecks.delete(seasonNumber);
      return isAvailable;
    })
    .catch(() => {
      availabilityCache.set(seasonNumber, false);
      pendingChecks.delete(seasonNumber);
      return false;
    });

  pendingChecks.set(seasonNumber, nextCheck);
  return nextCheck;
};

export const useSeasonLoadingAssets = (seasonNumber: number) => {
  const [hasSeasonAssets, setHasSeasonAssets] = useState<boolean | null>(() => {
    const cachedAvailability = availabilityCache.get(seasonNumber);
    return cachedAvailability === undefined ? null : cachedAvailability;
  });

  useEffect(() => {
    let isMounted = true;
    const cachedAvailability = availabilityCache.get(seasonNumber);

    if (cachedAvailability !== undefined) {
      setHasSeasonAssets(cachedAvailability);
      return;
    }

    setHasSeasonAssets(null);
    void resolveSeasonAssetsAvailability(seasonNumber).then((isAvailable) => {
      if (!isMounted) return;
      setHasSeasonAssets(isAvailable);
    });

    return () => {
      isMounted = false;
    };
  }, [seasonNumber]);

  return {
    hasSeasonAssets,
    isSeasonPresentation: hasSeasonAssets === true,
    seasonAssets: getSeasonAssets(seasonNumber),
  };
};
