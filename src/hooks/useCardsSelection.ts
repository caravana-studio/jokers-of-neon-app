import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlisterPackResult } from "../dojo/queries/useBlisterPackResult";
import { useCurrentSpecialCards } from "../dojo/queries/useCurrentSpecialCards";
import { useStore } from "../providers/StoreProvider";
import { useGameStore } from "../state/useGameStore";
import { Card } from "../types/Card";

export const useCardsSelection = () => {
  const navigate = useNavigate();
  const { specialSlots } = useGameStore();
  const maxSpecialCards = specialSlots ?? 0;
  const blisterPackResult = useBlisterPackResult();
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsToKeep, setCardsToKeep] = useState<Card[]>([]);
  const currentSpecialCards = useCurrentSpecialCards();
  const currentSpecialCardsLength = currentSpecialCards?.length ?? 0;
  const specialCardsToKeep = cardsToKeep.filter((c) => c.isSpecial).length;
  const chooseDisabled =
    specialCardsToKeep > maxSpecialCards - currentSpecialCardsLength;
  const allSelected = cardsToKeep.length === cards.length;

  const { selectCardsFromPack } = useStore();

  useEffect(() => {
    if (blisterPackResult?.cardsPicked) {
      setCards([]);
    } else {
      const newCards = blisterPackResult?.cards ?? [];
      setCards(newCards);
      setCardsToKeep(newCards);
    }
  }, [blisterPackResult]);

  const onCardToggle = (card: Card) => {
    const exists = cardsToKeep.some((c) => c.idx === card.idx);
    setCardsToKeep(
      exists
        ? cardsToKeep.filter((c) => c.idx !== card.idx)
        : [...cardsToKeep, card]
    );
  };

  const confirmSelectCards = () => {
    selectCardsFromPack(cardsToKeep.map((c) => c.idx));
    setCards([]);
    navigate("/store", { state: { lastTabIndex: 1 } });
  };

  return {
    cards,
    cardsToKeep,
    setCardsToKeep,
    onCardToggle,
    confirmSelectCards,
    maxSpecialCards,
    chooseDisabled,
    currentSpecialCardsLength,
    allSelected,
  };
};
