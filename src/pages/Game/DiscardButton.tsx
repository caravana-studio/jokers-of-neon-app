import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../providers/GameProvider";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { useGameStore } from "../../state/useGameStore";
import { PlayDiscardIndicators } from "./PlayDiscardIndicator";

interface DiscardButtonProps {
  inTutorial?: boolean;
  highlight?: boolean;
  onTutorialCardClick?: () => void;
}

export const DiscardButton = ({
  inTutorial = false,
  highlight = false,
  onTutorialCardClick,
}: DiscardButtonProps) => {
  const { preSelectedCards, preSelectionLocked } = useCurrentHandStore();
  const { discard } = useGameContext();

  const { totalDiscards, remainingDiscards } = useGameStore();

  const cantDiscard = inTutorial
    ? !highlight
    : preSelectionLocked ||
      preSelectedCards?.length === 0 ||
      !remainingDiscards ||
      remainingDiscards === 0;

  const { t } = useTranslation(["game"]);

  return (
    <Flex flexDir="column" w="100%" gap={[3, 4]}>
      <Button
        width={"100%"}
        onClick={() => {
          if (onTutorialCardClick) onTutorialCardClick();
          discard();
        }}
        sx={{
          _disabled: {
            opacity: 1,
          },
        }}
        variant={cantDiscard ? "defaultOutline" : "solid"}
        isDisabled={cantDiscard}
        className="game-tutorial-step-3"
        height={["30px", "32px"]}
        borderRadius="12px"
      >
        <Text fontFamily="Orbitron" fontSize={[14, 16]}>
          {t("game.preselected-cards-section.discard-btn-lbl.discard")}
        </Text>
      </Button>
      <PlayDiscardIndicators
        disabled={cantDiscard}
        type="discard"
        total={totalDiscards ?? 5}
        active={remainingDiscards}
      />
    </Flex>
  );
};
