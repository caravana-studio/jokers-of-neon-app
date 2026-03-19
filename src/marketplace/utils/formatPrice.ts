const DECIMALS_18 = 10n ** 18n;

export function formatTokenAmount(
  weiAmount: string | bigint,
  decimals: number = 18,
  maxDecimals: number = 4
): string {
  const amount = BigInt(weiAmount);
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;

  if (remainder === 0n) {
    return whole.toString();
  }

  const remainderStr = remainder.toString().padStart(decimals, "0");
  const trimmed = remainderStr.slice(0, maxDecimals).replace(/0+$/, "");

  if (!trimmed) {
    return whole.toString();
  }

  return `${whole}.${trimmed}`;
}

export function parseTokenAmount(
  displayAmount: string,
  decimals: number = 18
): string {
  const parts = displayAmount.split(".");
  const wholePart = parts[0] || "0";
  let fractionalPart = parts[1] || "";

  if (fractionalPart.length > decimals) {
    fractionalPart = fractionalPart.slice(0, decimals);
  }

  fractionalPart = fractionalPart.padEnd(decimals, "0");

  const wei = BigInt(wholePart) * 10n ** BigInt(decimals) + BigInt(fractionalPart);
  return wei.toString();
}

export function cardImageUrl(cardId: number, skinId?: number): string {
  if (skinId && skinId > 0) {
    return `https://jokersofneon.com/cards/${cardId}_sk${skinId}.png`;
  }
  return `https://jokersofneon.com/cards/${cardId}.png`;
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
