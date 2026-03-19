import { Card } from "../../types/Card";

export const CARD_LAYOUT_TRANSITION = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.72,
};

export const CARD_DEAL_TRANSITION = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.82,
};

export const getCardDealFromDeckInitial = (isSmallScreen: boolean) => ({
  opacity: 0,
  scale: isSmallScreen ? 0.88 : 0.84,
  rotate: isSmallScreen ? 6 : 8,
});

export const getCardLayoutId = (card: Pick<Card, "idx" | "img" | "isModifier">) =>
  `game-card-${card.idx}-${card.img}-${card.isModifier ? "modifier" : "standard"}`;
