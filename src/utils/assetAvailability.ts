const availabilityCache = new Map<string, boolean>();
const pendingChecks = new Map<string, Promise<boolean>>();

const getExpectedContentTypePrefix = (url: string): "image/" | "video/" | null => {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".gif") ||
    cleanUrl.endsWith(".svg") ||
    cleanUrl.endsWith(".avif")
  ) {
    return "image/";
  }

  if (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".ogg") ||
    cleanUrl.endsWith(".mov")
  ) {
    return "video/";
  }

  return null;
};

const isValidAssetResponse = (
  response: Response,
  url: string,
  isHeadRequest: boolean
): boolean => {
  if (!response.ok) {
    return false;
  }

  const contentType = response.headers.get("content-type")?.toLowerCase().trim() ?? "";
  if (!contentType) {
    // Some servers omit content-type on HEAD.
    // Force GET as a stronger check when this happens.
    return !isHeadRequest;
  }

  if (contentType.includes("text/html")) {
    return false;
  }

  if (contentType.includes("application/octet-stream")) {
    return true;
  }

  const expectedPrefix = getExpectedContentTypePrefix(url);
  if (!expectedPrefix) {
    return true;
  }

  return contentType.startsWith(expectedPrefix);
};

const verifyUrlExists = async (url: string): Promise<boolean> => {
  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
    });

    if (isValidAssetResponse(headResponse, url, true)) {
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

    return isValidAssetResponse(getResponse, url, false);
  } catch {
    return false;
  }
};

export const doesAssetExist = async (url: string): Promise<boolean> => {
  const cachedAvailability = availabilityCache.get(url);
  if (cachedAvailability !== undefined) {
    return cachedAvailability;
  }

  const pendingCheck = pendingChecks.get(url);
  if (pendingCheck) {
    return pendingCheck;
  }

  const nextCheck = verifyUrlExists(url)
    .then((exists) => {
      availabilityCache.set(url, exists);
      pendingChecks.delete(url);
      return exists;
    })
    .catch(() => {
      availabilityCache.set(url, false);
      pendingChecks.delete(url);
      return false;
    });

  pendingChecks.set(url, nextCheck);
  return nextCheck;
};

export const addSeasonSuffixToAssetPath = (
  assetPath: string,
  seasonNumber: number
): string => {
  if (!Number.isFinite(seasonNumber) || seasonNumber < 1) {
    return assetPath;
  }

  const match = assetPath.match(/^(.*)(\.[^./?]+)(\?.*)?$/);
  if (!match) {
    return assetPath;
  }

  const [, pathWithoutExtension, extension, queryParams = ""] = match;
  return `${pathWithoutExtension}-s${Math.floor(seasonNumber)}${extension}${queryParams}`;
};

export const resolveSeasonalAssetPath = async (
  fallbackAssetPath: string,
  seasonNumber: number
): Promise<string> => {
  const seasonalAssetPath = addSeasonSuffixToAssetPath(
    fallbackAssetPath,
    seasonNumber
  );

  if (seasonalAssetPath === fallbackAssetPath) {
    return fallbackAssetPath;
  }

  const hasSeasonalAsset = await doesAssetExist(seasonalAssetPath);
  return hasSeasonalAsset ? seasonalAssetPath : fallbackAssetPath;
};
