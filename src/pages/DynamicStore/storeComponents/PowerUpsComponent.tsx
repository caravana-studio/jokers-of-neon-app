import { Flex } from "@chakra-ui/react";
import useResizeObserver from "@react-hook/resize-observer";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import { useGameStore } from "../../../state/useGameStore";
import { useShopStore } from "../../../state/useShopStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";

interface PowerUpComponentProps {
  doubleRow?: boolean;
}

export const PowerUpsComponent = ({
  doubleRow = false,
}: PowerUpComponentProps) => {
  const { powerUps } = useShopStore();
  const { powerUps: playerPowerUps, maxPowerUpSlots } = useGameStore();
  const flexRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);

  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();

  // Check if all power-up slots are full
  const occupiedSlots = playerPowerUps.filter((p) => p !== null).length;
  const allSlotsFull = occupiedSlots >= maxPowerUpSlots;

  useResizeObserver(flexRef, (entry) => {
    setHeight(entry.contentRect.height);
    setWidth(entry.contentRect.width);
  });

  const powerUpWidth =
    width && height
      ? doubleRow
        ? isSmallScreen
          ? width * 0.9
          : width * 0.7
        : width / powerUps.length - 60
      : isSmallScreen
        ? 100
        : 150;

  const maxWidth = isSmallScreen ? 100 : 170;
  return (
    <Flex
      ref={flexRef}
      h="100%"
      w="100%"
      maxH="100%"
      maxW="100%"
      flexDirection={doubleRow ? "column" : "row"}
      alignContent="center"
      justifyContent="center"
      alignItems={"center"}
      gap={[2, 4, 3]}
    >
      {powerUps.map((powerUp, index) => {
        const isBlocked = allSlotsFull && !powerUp.purchased;
        return (
          <Flex key={index}>
            <RerollingAnimation>
              <PowerUpComponent
                powerUp={isBlocked ? { ...powerUp, purchased: true } : powerUp}
                width={powerUpWidth > maxWidth ? maxWidth : powerUpWidth}
                inStore
                onClick={() => {
                  if (!powerUp.purchased && !isBlocked) {
                    navigate("/preview/power-up", {
                      state: { powerUp },
                    });
                  }
                }}
              />
            </RerollingAnimation>
          </Flex>
        );
      })}
    </Flex>
  );
};
