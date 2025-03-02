import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { cardScale } = useResponsiveValues();
  const { specialSwitcherOn } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  const cardWidth = CARD_WIDTH * cardScale;
  const cardHeight = CARD_HEIGHT * cardScale;
  return (
    <CardContainerWithBorder
      minWidth={`${cardWidth * 5 + (isSmallScreen ? 32 : 49)}px`}
      maxWidth={"95%"}
      height={`100%`}
    >
      {specialSwitcherOn ? <SpecialCardsRow /> : <RageCards />}
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
