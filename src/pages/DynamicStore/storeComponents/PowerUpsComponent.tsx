import { Flex } from "@chakra-ui/react";
import useResizeObserver from "@react-hook/resize-observer";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import { useStore } from "../../../providers/StoreProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";

interface PowerUpComponentProps {
  doubleRow?: boolean;
}

export const PowerUpsComponent = ({
  doubleRow = false,
}: PowerUpComponentProps) => {
  const { powerUps } = useStore();
  const flexRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);

  const { isSmallScreen } = useResponsiveValues();
  const navigate = useNavigate();

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
        return (
          <Flex key={index}>
            <RerollingAnimation>
              <PowerUpComponent
                powerUp={powerUp}
                width={powerUpWidth > maxWidth ? maxWidth : powerUpWidth}
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
          </Flex>
        );
      })}
    </Flex>
  );
};
