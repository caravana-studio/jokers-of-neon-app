import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { isMockGameApiMode } from "../config/gameMode.ts";
import { useProgressStore } from "../state/roguelike/useProgressStore.ts";
import { useGameStore } from "../state/useGameStore.ts";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";
import { CardContainerWithBorder } from "./CardContainerWithBorder.tsx";
import { RageCards } from "./RageCards.tsx";
import { SpecialCardsRow } from "./SpecialCardsRow.tsx";
import { SpecialRageSwitcher } from "./SpecialRageSwitcher.tsx";

export const SpecialCards = () => {
  const { specialSwitcherOn, isRageRound } = useGameStore();
  const unlockedSystems = useProgressStore(
    (state) => state.profile?.unlockedSystems ?? []
  );
  const { isSmallScreen, cardScale } = useResponsiveValues();
  const heightOffset = isSmallScreen ? 20 : 40;
  const cardWidth = CARD_WIDTH * cardScale;
  const specialsUnlocked =
    !isMockGameApiMode ||
    unlockedSystems.some((system) => system.startsWith("SPECIALS_"));

  if (!isRageRound && !specialsUnlocked) {
    return null;
  }

  return (
    <CardContainerWithBorder
      maxWidth={isSmallScreen ? "95%" : "100%"}
      minWidth={`${cardWidth * 5 + (isSmallScreen ? 32 : 49)}px`}
      width={"auto"}
      height={`${CARD_HEIGHT * cardScale + heightOffset}px`}
    >
      {isRageRound ? (
        <RageCards />
      ) : specialSwitcherOn ? (
        <SpecialCardsRow />
      ) : (
        <RageCards />
      )}
      {!isRageRound && <SpecialRageSwitcher />}
    </CardContainerWithBorder>
  );
};
