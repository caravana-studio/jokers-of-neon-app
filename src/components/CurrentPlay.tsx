import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PLAYS_DATA } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useCurrentHandStore } from "../state/useCurrentHandStore";
import { useGameStore } from "../state/useGameStore";
import { checkHand } from "../utils/checkHand";

export const CurrentPlay = () => {
  const { preSelectedPlay, setPreSelectedPlay, playIsNeon, preSelectedCards, hand, preSelectedModifiers } = useCurrentHandStore();
  const { setMulti, setPoints,  specialCards, resetMultiPoints, plays} = useGameStore()
  const { t } = useTranslation(["game"]);
  const { t: tPlays } = useTranslation("plays", { keyPrefix: "playsData" });

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
    if (preSelectedCards.length > 0) {
      let play = checkHand(
        hand,
        preSelectedCards,
        specialCards,
        preSelectedModifiers
      );
      setPreSelectedPlay(play);
      if (plays?.length != 0) {
        setMultiAndPoints(play);
      }
    } else {
      setPreSelectedPlay(Plays.NONE);
      resetMultiPoints();
    }
  }, [preSelectedCards, preSelectedModifiers]);
  
  return (
    <Flex
      gap={{ base: 2, md: 4 }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? t("game.preselected-cards-section.current-play-lbl.default")
          : `${playIsNeon ? t("game.preselected-cards-section.current-play-lbl.neon-play") : ""} ${tPlays(`${PLAYS_DATA[preSelectedPlay]?.name}.name`)}`}
      </Text>
    </Flex>
  );
};
