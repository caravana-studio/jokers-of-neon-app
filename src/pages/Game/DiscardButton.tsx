import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { PlayDiscardIndicators } from "./PlayDiscardIndicator";
import { useGame } from "../../dojo/queries/useGame";

interface DiscardButtonProps {
  highlight?: boolean;
  onTutorialCardClick?: () => void;
}

export const DiscardButton = ({
  highlight = false,
  onTutorialCardClick,
}: DiscardButtonProps) => {
  const { preSelectedCards, discard, preSelectionLocked, discards } =
    useGameContext();

  const cantDiscard =
    !highlight &&
    (preSelectionLocked ||
      preSelectedCards?.length === 0 ||
      !discards ||
      discards === 0);

  const { t } = useTranslation(["game"]);
  const game = useGame();

  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex flexDir="column" w="100%" gap={[3, 4]}>
      <PlayDiscardIndicators
        disabled={cantDiscard}
        type="discard"
        total={game?.max_discard ?? 5}
        active={discards}
      />
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
        <Text fontFamily="Orbitron" fontSize={[14,16]}>
          {t("game.preselected-cards-section.discard-btn-lbl.discard")}
        </Text>
      </Button>
    </Flex>
  );
};
