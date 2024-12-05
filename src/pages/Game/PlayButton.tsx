import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGame } from "../../dojo/queries/useGame";
import { useRound } from "../../dojo/queries/useRound";
import { useGameContext } from "../../providers/GameProvider";
import { handsLeftTutorial } from "../../providers/TutorialGameProvider";
import { isTutorial } from "../../utils/isTutorial";
import { PlayDiscardIndicators } from "./PlayDiscardIndicator";

interface PlayButtonProps {
  highlight?: boolean;
  onTutorialCardClick?: () => void;
}

export const PlayButton = ({
  highlight = false,
  onTutorialCardClick,
}: PlayButtonProps) => {
  const { preSelectedCards, play, preSelectionLocked } = useGameContext();

  const round = useRound();
  const game = useGame();
  const handsLeft = !isTutorial() ? round?.hands ?? 0 : handsLeftTutorial;

  const cantPlay =
    !highlight &&
    (preSelectionLocked ||
      preSelectedCards?.length === 0 ||
      !handsLeft ||
      handsLeft === 0);
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
        total={game?.max_hands ?? 5}
        active={handsLeft}
      />
    </Flex>
  );
};
