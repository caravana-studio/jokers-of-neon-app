import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialCardScale } = useResponsiveValues();
  const { specialSwitcherOn } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  const cardWidth = CARD_WIDTH * specialCardScale;
  const cardHeight = CARD_HEIGHT * specialCardScale;
  return (
    <CardContainerWithBorder
      width={`${cardWidth * 5 + (isSmallScreen ? 32 : 49)}px`}
      height={`${cardHeight + (isSmallScreen ? 10 : 30)}px`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
