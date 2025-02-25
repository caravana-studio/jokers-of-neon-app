import { Box, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DefaultInfo } from "../../components/Info/DefaultInfo";
import { PowerUpComponent } from "../../components/PowerUpComponent";
import { CARD_WIDTH } from "../../constants/visualProps";
import { useStore } from "../../providers/StoreProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { RerollingAnimation } from "./StoreElements/RerollingAnimation";

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
      <Flex gap={2} mb={1} justifyContent="center" alignItems="center">
        <Heading size={{ base: "s", sm: "xs" }} fontWeight={"400"}>
          {t("store.titles.powerups")}
        </Heading>
        <DefaultInfo title={"power-ups"} />
      </Flex>

      <Flex
        flexDirection="column"
        alignContent="flex-start"
        justifyContent="flex-start"
        gap={[2, 4, 6]}
      >
        {powerUps.map((powerUp, index) => {
          return (
            <RerollingAnimation key={index}>
              <PowerUpComponent
                powerUp={powerUp}
                width={width}
                inStore
                onClick={() => {
                  if (!powerUp.purchased) {
                    navigate("/preview/power-up", {
                      state: { powerUp },
                    });
                  }
                }}
              />
            </RerollingAnimation>
          );
        })}
      </Flex>
    </Box>
  );
};
