import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExternalPack, SimplifiedCard } from "./ExternalPack";

const DEFAULT_PACK_ID = 1;

const MOCK_PACKS: Record<number, SimplifiedCard[]> = {
  1: [
    { card_id: 0, skin_id: 0 },
    { card_id: 12, skin_id: 0 },
    { card_id: 25, skin_id: 0 },
  ],
  2: [
    { card_id: 200, skin_id: 0 },
    { card_id: 219, skin_id: 0 },
    { card_id: 243, skin_id: 0 },
  ],
  3: [
    { card_id: 52, skin_id: 0 },
    { card_id: 53, skin_id: 0 },
    { card_id: 51, skin_id: 0 },
  ],
  4: [
    { card_id: 10014, skin_id: 0 },
    { card_id: 10023, skin_id: 0 },
    { card_id: 10031, skin_id: 0 },
  ],
  5: [
    { card_id: 53, skin_id: 0 },
    { card_id: 52, skin_id: 0 },
    { card_id: 51, skin_id: 0 },
    { card_id: 10101, skin_id: 0 },
    { card_id: 10102, skin_id: 0 },
    { card_id: 10103, skin_id: 0 },
    { card_id: 10109, skin_id: 0 },
    { card_id: 10111, skin_id: 0 },
    { card_id: 10107, skin_id: 101 },
    { card_id: 10114, skin_id: 2 },
  ],
  6: [
    { card_id: 608, skin_id: 0 },
    { card_id: 609, skin_id: 0 },
    { card_id: 613, skin_id: 0 },
  ],
};

const MOCK_OWNED_CARDS: Record<number, SimplifiedCard[]> = {
  5: [
    { card_id: 53, skin_id: 0 },
    { card_id: 52, skin_id: 0 },
    { card_id: 51, skin_id: 0 },
    { card_id: 10101, skin_id: 0 },
    { card_id: 10107, skin_id: 0 },
  ],
};

const buildOwnedCardIds = (packId: number, cards: SimplifiedCard[]) => {
  const ownedCards = MOCK_OWNED_CARDS[packId];
  const source = ownedCards ?? cards.slice(1);
  return source.map(({ card_id, skin_id }) => `${card_id}_${skin_id ?? 0}`);
};

const parsePackId = (packId?: string) => {
  const parsed = Number(packId);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PACK_ID;
};

export const ExternalPackTestPage = () => {
  const { packId } = useParams();
  const resolvedPackId = parsePackId(packId);

  const { initialCards, ownedCardIds } = useMemo(() => {
    const cards = MOCK_PACKS[resolvedPackId] ?? MOCK_PACKS[DEFAULT_PACK_ID];
    return {
      initialCards: cards,
      ownedCardIds: buildOwnedCardIds(resolvedPackId, cards),
    };
  }, [resolvedPackId]);

  return (
    <ExternalPack
      packId={resolvedPackId}
      initialCards={initialCards}
      ownedCardIds={ownedCardIds}
      returnTo="/test"
    />
  );
};
