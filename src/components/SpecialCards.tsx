import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialSwitcherOn, maxSpecialCards } = useGameStore();
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const heightOffset = isSmallScreen ? 20 : 40;
  const cardWidth = CARD_WIDTH * cardScale;
  const legacyMinSlots = 5;
  const minSlots = Math.max(1, maxSpecialCards);
  const containerMinSlots = Math.max(legacyMinSlots, minSlots);

  return (
    <CardContainerWithBorder
      maxWidth={isSmallScreen ? "95%" : "100%"}
      minWidth={`${cardWidth * containerMinSlots + (isSmallScreen ? 32 : 49)}px`}
      width={"auto"}
      height={`${CARD_HEIGHT * cardScale + heightOffset}px`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
