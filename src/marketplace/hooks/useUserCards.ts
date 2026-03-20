import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { getUserCards } from "../api/userCards";
import type { UserCard } from "../types/marketplace";

export function useUserCards() {
  const { address } = useAccount();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const allCards = await getUserCards(address);
      setCards(allCards.filter((c) => c.count > 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return { cards, loading, error, refresh: fetchCards };
}
