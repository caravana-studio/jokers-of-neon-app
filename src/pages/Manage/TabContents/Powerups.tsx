import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import { useGameContext } from "../../../providers/GameProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { PowerUp } from "../../../types/Powerup/PowerUp";
import { FullScreenCardContainer } from "../../FullScreenCardContainer";
import { useGameStore } from "../../../state/useGameStore";

export const Powerups = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "power-ups",
  });

  const { isSmallScreen } = useResponsiveValues();

  const { maxPowerUpSlots, powerUps } = useGameStore();
  const [totalPowerUps, setTotalPowerups] = useState<(PowerUp | null)[]>([]);

  useEffect(() => {
    const nonEmptyPowerupsSlots: (PowerUp | null)[] = powerUps.filter(
      (p) => p != null
    );
    const totalPowerupSlots = [...nonEmptyPowerupsSlots];

    for (let i = nonEmptyPowerupsSlots.length; i < maxPowerUpSlots; i++) {
      totalPowerupSlots.push(null);
    }

    setTotalPowerups(totalPowerupSlots);
  }, [powerUps, maxPowerUpSlots]);

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
          {!isSmallScreen && (
            <Text mx={2} size="l" zIndex={2}>
              {t("title")}
            </Text>
          )}
          <FullScreenCardContainer>
            {totalPowerUps.map((powerUp, index) => {
              return (
                <PowerUpComponent
                  powerUp={powerUp}
                  width={120}
                  key={index}
                  containerSx={{
                    backgroundColor: "transparent",
                    borderColor: "white",
                    borderRadius: "20px",
                    transform: "scale(1.1)",
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                />
              );
            })}
          </FullScreenCardContainer>
        </Flex>
      </Flex>
    </>
  );
};
