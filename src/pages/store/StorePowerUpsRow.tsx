import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { CARD_WIDTH } from "../../constants/visualProps";
import { useStore } from "../../providers/StoreProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const StorePowerUpsRow = () => {
  const { powerUps } = useStore();

  const { t } = useTranslation(["store"]);
  const navigate = useNavigate();

  const { cardScale, isSmallScreen } = useResponsiveValues();

  const adjustedScale = isSmallScreen
    ? cardScale
    : cardScale - (cardScale * 25) / 100;

  const width = CARD_WIDTH * adjustedScale;

  return (
    <Box mb={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading
          size={{ base: "s", sm: "xs" }}
          mb={[1, 1, 1, 2, 2]}
          fontWeight={"400"}
        >
          {t("store.titles.powerups")}
        </Heading>
      </Flex>

      <Flex
        flexDirection="column"
        alignContent="flex-start"
        justifyContent="flex-start"
        gap={[2, 4, 6]}
      >
        {powerUps.map((powerUp, index) => {
          return (
            <PowerUpComponent
              powerUp={powerUp}
              width={width}
              key={index}
              inStore
              onClick={() => {
                if (!powerUp.purchased) {
                  navigate("/preview/power-up", {
                    state: { powerUp },
                  });
                }
              }}
            />
          );
        })}
      </Flex>
    </Box>
  );
};
