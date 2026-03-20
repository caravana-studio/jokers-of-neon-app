import { Card } from "../../types/Card";
import { Speed } from "../../enums/settings";

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

const CARD_DEAL_STAGGER_SECONDS: Record<Speed, number> = {
  [Speed.NORMAL]: 0.22,
  [Speed.FAST]: 0.18,
  [Speed.FASTEST]: 0.12,
};

export const getCardDealStaggerSeconds = (speed: Speed): number =>
  CARD_DEAL_STAGGER_SECONDS[speed] ?? CARD_DEAL_STAGGER_SECONDS[Speed.NORMAL];

export const getCardDealFromDeckInitial = (isSmallScreen: boolean) => ({
  opacity: 0,
  scale: isSmallScreen ? 0.88 : 0.84,
  rotate: isSmallScreen ? 6 : 8,
});

export const getCardLayoutId = (card: Pick<Card, "idx" | "img" | "isModifier">) =>
  `game-card-${card.idx}-${card.img}-${card.isModifier ? "modifier" : "standard"}`;
