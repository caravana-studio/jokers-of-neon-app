export function normalizeStarknetAddress(address?: string | null): string {
  const raw = String(address ?? "").trim();
  if (!raw) return "";

  try {
    let value: bigint;
    if (/^0x[0-9a-fA-F]+$/.test(raw)) {
      value = BigInt(raw);
    } else if (/^[0-9]+$/.test(raw)) {
      value = BigInt(raw);
    } else if (/^[0-9a-fA-F]+$/.test(raw)) {
      value = BigInt(`0x${raw}`);
    } else {
      return raw.toLowerCase();
    }

    return `0x${value.toString(16).padStart(64, "0")}`;
  } catch {
    return raw.toLowerCase();
  }
}

export function addressKey(address?: string | null): string {
  return normalizeStarknetAddress(address);
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
