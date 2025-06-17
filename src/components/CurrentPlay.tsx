import { Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PLAYS } from "../constants/plays";
import { Plays } from "../enums/plays";
import { useGameContext } from "../providers/GameProvider";
import { useCurrentHandStore } from "../state/useCurrentHandStore";

export const CurrentPlay = () => {
  const { playIsNeon } = useGameContext();
  const { preSelectedPlay } = useCurrentHandStore();
  const { t } = useTranslation(["game"]);

  return (
    <Flex
      gap={{ base: 2, md: 4 }}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <Text size="l">
        {preSelectedPlay === Plays.NONE
          ? t("game.preselected-cards-section.current-play-lbl.default")
          : `${playIsNeon ? t("game.preselected-cards-section.current-play-lbl.neon-play") : ""} ${PLAYS[preSelectedPlay]}`}
      </Text>
    </Flex>
  );
};
