import { useState, useEffect } from "react";

export interface TokenPrices {
  STRK: number | null;
  ETH: number | null;
}

const REFRESH_MS = 60_000;

// ─── Module-level singleton so all components share one fetch ─────────────────
let cache: TokenPrices = { STRK: null, ETH: null };
let intervalId: ReturnType<typeof setInterval> | null = null;
const subscribers = new Set<(p: TokenPrices) => void>();

async function loadPrices() {
  try {
    const [strkRes, ethRes] = await Promise.all([
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=STRKUSDT"),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"),
    ]);
    const [strk, eth] = await Promise.all([strkRes.json(), ethRes.json()]);
    cache = {
      STRK: strk?.price ? parseFloat(strk.price) : null,
      ETH: eth?.price ? parseFloat(eth.price) : null,
    };
    subscribers.forEach((cb) => cb(cache));
  } catch {}
}

function subscribe(cb: (p: TokenPrices) => void) {
  subscribers.add(cb);
  if (subscribers.size === 1) {
    loadPrices();
    intervalId = setInterval(loadPrices, REFRESH_MS);
  } else {
    // New subscriber gets the cached value immediately
    cb(cache);
  }
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

export function usePrices(): TokenPrices {
  const [prices, setPrices] = useState<TokenPrices>(cache);
  useEffect(() => subscribe(setPrices), []);
  return prices;
}

export function toUsd(
  amount: number | string,
  symbol: string,
  prices: TokenPrices
): number | null {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!n || isNaN(n) || n <= 0) return null;
  const price = prices[symbol as keyof TokenPrices];
  if (!price) return null;
  return n * price;
}

export function formatUsd(usd: number | null): string | null {
  if (usd === null) return null;
  if (usd < 0.01) return "< $0.01";
  return `~$${usd.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
