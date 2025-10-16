import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../providers/GameProvider";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { useGameStore } from "../../state/useGameStore";
import { isTutorial } from "../../utils/isTutorial";
import { PlayDiscardIndicators } from "./PlayDiscardIndicator";

interface PlayButtonProps {
  inTutorial?: boolean;
  highlight?: boolean;
  onTutorialCardClick?: () => void;
}

export const PlayButton = ({
  inTutorial = false,
  highlight = false,
  onTutorialCardClick,
}: PlayButtonProps) => {
  const { play, remainingPlaysTutorial } = useGameContext();

  const { preSelectedCards, preSelectionLocked } = useCurrentHandStore();

  const { totalPlays, remainingPlays } = useGameStore();
  const handsLeft = !isTutorial()
    ? remainingPlays
    : remainingPlaysTutorial ?? 0;

  const cantPlay = inTutorial
    ? !highlight
    : preSelectionLocked ||
      preSelectedCards?.length === 0 ||
      !handsLeft ||
      handsLeft === 0;
  const { t } = useTranslation(["game"]);

  return (
    <Flex flexDir="column" w="100%" gap={[3, 4]}>
      <Button
        width={"100%"}
        onClick={(e) => {
          e.stopPropagation();
          if (onTutorialCardClick) onTutorialCardClick();
          play();
        }}
        sx={{
          _disabled: {
            opacity: 1,
          },
        }}
        variant={cantPlay ? "defaultOutline" : "secondarySolid"}
        isDisabled={cantPlay}
        className="game-tutorial-step-4"
        height={["30px", "32px"]}
        borderRadius="12px"
      >
        <Text fontFamily="Orbitron" fontSize={[14, 16]}>
          {t("game.preselected-cards-section.play-btn-lbl.play-mobile")}
        </Text>
      </Button>
      <PlayDiscardIndicators
        disabled={cantPlay}
        type="play"
        total={totalPlays ?? 5}
        active={handsLeft}
      />
    </Flex>
  );
};
