import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PLAYS_DATA } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { checkHand } from "../utils/checkHand";

interface CurrentPlayProps {
  showEmptyText?: boolean;
  fontFamily?: string;
  desktopFontSize?: number;
  mobileFontSize?: number;
}

export const CurrentPlay = ({
  showEmptyText = true,
  fontFamily,
  desktopFontSize = 20,
  mobileFontSize = 18,
}: CurrentPlayProps = {}) => {
  const {
    preSelectedPlay,
    setPreSelectedPlay,
    playIsNeon,
    setPlayIsNeon,
    preSelectedCards,
    preSelectionLocked,
    hand,
    preSelectedModifiers,
  } = useCurrentHandStore();
  const {
    setMulti,
    setPoints,
    specialCards,
    resetMultiPoints,
    plays,
    debuffedPlayerHands,
  } = useGameStore();
  const { t } = useTranslation(["game"]);
  const { t: tPlays } = useTranslation("plays", { keyPrefix: "playsData" });

  const { isSmallScreen } = useResponsiveValues();

  const isDebuffedPlay = debuffedPlayerHands.includes(preSelectedPlay);
  const isEmptyPlay = preSelectedPlay === Plays.NONE;
  const currentPlayLabel = isEmptyPlay
    ? t("game.preselected-cards-section.current-play-lbl.default")
    : `${playIsNeon ? t("game.preselected-cards-section.current-play-lbl.neon-play") : ""} ${tPlays(`${PLAYS_DATA[preSelectedPlay]?.name}.name`)}`;

  const setMultiAndPoints = (play: Plays) => {
    const playerPokerHand = plays[play - 1];
    const multi =
      typeof playerPokerHand.multi === "number" ? playerPokerHand.multi : 0;
    const points =
      typeof playerPokerHand.points === "number" ? playerPokerHand.points : 0;
    setMulti(multi);
    setPoints(points);
  };

  useEffect(() => {
    if (preSelectionLocked) {
      return;
    }

    if (preSelectedCards.length > 0) {
      const result = checkHand(
        hand,
        preSelectedCards,
        specialCards,
        preSelectedModifiers
      );
      const isDebuffedResult = debuffedPlayerHands.includes(result.play);
      setPreSelectedPlay(result.play);
      setPlayIsNeon(result.isNeon);
      if (plays?.length != 0) {
        isDebuffedResult ? resetMultiPoints() : setMultiAndPoints(result.play);
      }
    } else {
      setPreSelectedPlay(Plays.NONE);
      setPlayIsNeon(false);
      resetMultiPoints();
    }
  }, [
    preSelectedCards,
    preSelectionLocked,
    preSelectedModifiers,
    hand,
    specialCards,
    plays,
    debuffedPlayerHands,
  ]);

  return (
    <Flex
      gap={{ base: 2, md: 4 }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Text
        fontSize={isSmallScreen ? mobileFontSize : desktopFontSize}
        fontFamily={fontFamily}
        color={isDebuffedPlay ? "HEARTS" : "white"}
        textAlign="center"
      >
        {isEmptyPlay && !showEmptyText ? "" : currentPlayLabel}
      </Text>
    </Flex>
  );
};
