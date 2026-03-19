import { useEffect, useState } from "react";
import { truncateAddress } from "../marketplace/utils/formatPrice";

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

async function fetchUsername(address: string): Promise<string> {
  try {
    const res = await fetch("https://api.cartridge.gg/accounts/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: [address] }),
    });
    if (!res.ok) return truncateAddress(address, 6);
    const data = await res.json();
    const result = data?.results?.[0];
    return result?.username ?? truncateAddress(address, 6);
  } catch {
    return truncateAddress(address, 6);
  }
}

function resolveUsername(address: string): Promise<string> {
  const key = address.toLowerCase();
  if (cache.has(key)) return Promise.resolve(cache.get(key)!);
  if (pending.has(key)) return pending.get(key)!;
  const p = fetchUsername(address).then((name) => {
    cache.set(key, name);
    pending.delete(key);
    return name;
  });
  pending.set(key, p);
  return p;
}

export function useAddressUsername(address?: string): string {
  const [display, setDisplay] = useState<string>(() =>
    address ? (cache.get(address.toLowerCase()) ?? truncateAddress(address, 6)) : ""
  );

  useEffect(() => {
    if (!address) return;
    let cancelled = false;
    resolveUsername(address).then((name) => {
      if (!cancelled) setDisplay(name);
    });
    return () => { cancelled = true; };
  }, [address]);

  return display;
}
