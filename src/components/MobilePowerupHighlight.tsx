import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useGameContext } from "../providers/GameProvider";
import { colorizeText } from "../utils/getTooltip";
import { CashSymbol } from "./CashSymbol";
import { ConfirmationModal } from "./ConfirmationModal";
import { PowerUp } from "../types/Powerup/PowerUp";
import { getPowerUpData } from "../data/powerups";
import { PowerUpComponent } from "./PowerUpComponent";
import { usePowerupHighlight } from "../providers/HighlightProvider/PowerupHighlightProvider";

interface MobilePowerupHighlightProps {
  powerup: PowerUp;
  confirmationBtn?: boolean;
  customBtn?: ReactNode;
}

export const MobilePowerupHighlight = ({
  powerup,
  confirmationBtn = false,
  customBtn,
}: MobilePowerupHighlightProps) => {
  const { onClose } = usePowerupHighlight();

  const getDataFn = getPowerUpData;
  const { name, description } = getDataFn(powerup.power_up_id ?? 0);

  const { sellPowerup } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const { t } = useTranslation(["game", "docs"]);
  const { t: tIntermediateScreen } = useTranslation(["intermediate-screens"]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmationModalOpen(true);
  };

  const handleDiscard = () => {
    setLoading(true);
    sellPowerup(powerup.idx).then((response) => {
      if (response) {
        onClose();
      }
      setLoading(false);
    });
  };

  const getLabel = () => {
    return loading ? (
      t("game.card-highlight.buttons.selling")
    ) : (
      <>
        {t("game.card-highlight.buttons.sell-for")}
        <Box ml={1} />
        <CashSymbol />
        <Box ml={1} />
        {powerup.selling_price}
      </>
    );
  };

  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    setOpacity(1);
    setScale(1);
  }, []);

  return (
    <Flex
      position={"absolute"}
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      zIndex={1100}
      opacity={opacity}
      flexDirection={"column"}
      transition="opacity 0.5s ease"
      justifyContent={"center"}
      alignItems={"center"}
      backdropFilter="blur(5px)"
      backgroundColor=" rgba(0, 0, 0, 0.5)"
      gap={6}
      onClick={() => {
        onClose();
      }}
    >
      {confirmationModalOpen && (
        <ConfirmationModal
          close={() => setConfirmationModalOpen(false)}
          title={tIntermediateScreen("power-ups.confirmation-modal.title")}
          description={tIntermediateScreen(
            "power-ups.confirmation-modal.description",
            {
              price: powerup.selling_price,
            }
          )}
          onConfirm={() => {
            setConfirmationModalOpen(false);
            handleDiscard();
          }}
        />
      )}
      <Flex flexDirection="column" textAlign="center">
        <Heading
          fontWeight={500}
          size="l"
          letterSpacing={1.3}
          textTransform="unset"
        >
          {name}
        </Heading>
        <Text size="l" textTransform="lowercase" fontWeight={600}>
          - {tIntermediateScreen(`power-ups.title`)} -
        </Text>
      </Flex>
      <Flex
        width={"60%"}
        height={"auto"}
        justifyContent={"center"}
        position={"relative"}
        transform={`scale(${scale})`}
        transition="all 0.5s ease"
      >
        <PowerUpComponent isActive hideTooltip powerUp={powerup} width={240} />
      </Flex>
      <Text textAlign="center" size="xl" fontSize={"17px"} width={"65%"}>
        {colorizeText(description)}
      </Text>

      {confirmationBtn && (
        <Button
          isDisabled={loading}
          onClick={handleClick}
          width="40%"
          variant={loading ? "defaultOutline" : "secondarySolid"}
        >
          {getLabel()}
        </Button>
      )}
      <Box py={4}>{customBtn}</Box>
    </Flex>
  );
};
