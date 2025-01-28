import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { FullScreenCardContainer } from "../FullScreenCardContainer";
import { PowerUpComponent } from "../../components/PowerUpComponent";

export const Powerups = () => {
  const navigate = useNavigate();

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "power-ups",
  });

  const { powerUps, maxPowerUpSlots } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();

  const freeUnlockedSlots = maxPowerUpSlots - powerUps.length;

  return (
    <>
      <Flex
        height={"100%"}
        justifyContent="center"
        flexDirection="column"
        gap={4}
        px={6}
      >
        <Flex gap={4} flexDirection="column">
          <Text mx={2} size="l">
            {t("title")}
          </Text>
          <FullScreenCardContainer>
            {powerUps.map((powerUp, index) => {
              return (
                <PowerUpComponent
                  powerUp={powerUp}
                  width={120}
                  key={index}
                  inStore
                  onClick={() => {
                    if (powerUp && !powerUp.purchased) {
                      navigate("/preview/power-up", {
                        state: { powerUp },
                      });
                    }
                  }}
                />
              );
            })}
            {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
              <Box mx={1.5} p={1}>
                <PowerUpComponent
                  powerUp={null}
                  width={120}
                  bgColor="transparent"
                  borderColor="white"
                />
              </Box>
            ))}
          </FullScreenCardContainer>
          <Flex
            flexDirection={"row"}
            justifyContent="space-between"
            gap={4}
            mx={4}
            my={4}
          >
            <Button
              fontSize={12}
              onClick={() => {
                navigate(-1);
              }}
              width={isSmallScreen ? "50%" : "unset"}
            >
              {t("go-back")}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
