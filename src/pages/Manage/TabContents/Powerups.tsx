import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../../providers/GameProvider";
import { FullScreenCardContainer } from "../../FullScreenCardContainer";
import { PowerUpComponent } from "../../../components/PowerUpComponent";

export const Powerups = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "power-ups",
  });

  const { powerUps } = useGameContext();

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
                  isActive
                  containerSx={{
                    backgroundColor: "transparent",
                    borderColor: "white",
                    borderRadius: "16px",
                    transform: "scale(1.1)",
                    marginTop: 0,
                    marginBottom: 0,
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
