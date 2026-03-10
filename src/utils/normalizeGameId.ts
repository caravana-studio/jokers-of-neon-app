export const normalizeGameId = (
  value?: string | number | bigint | null
): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      return null;
    }

    return BigInt(value).toString();
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  try {
    return BigInt(normalized).toString();
  } catch {
    return null;
  }
};
