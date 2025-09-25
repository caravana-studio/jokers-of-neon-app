import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

interface SpecialCardsProps {
  onTutorialCardClick?: () => void;
}

export const SpecialCards = ({ onTutorialCardClick }: SpecialCardsProps) => {
  const { specialSwitcherOn } = useGameStore();
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const heightOffset = isSmallScreen ? 20 : 40;
  const cardWidth = CARD_WIDTH * cardScale;

  return (
    <CardContainerWithBorder
      maxWidth={isSmallScreen ? "95%" : "100%"}
      minWidth={`${cardWidth * 5 + (isSmallScreen ? 32 : 49)}px`}
      width={"auto"}
      height={`${CARD_HEIGHT * cardScale + heightOffset}px`}
    >
      {specialSwitcherOn ? (
        <SpecialCardsRow onTutorialCardClick={onTutorialCardClick} />
      ) : (
        <RageCards />
      )}
      <SpecialRageSwitcher />
    </CardContainerWithBorder>
  );
};
