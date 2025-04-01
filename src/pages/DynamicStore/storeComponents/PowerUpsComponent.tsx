import { Box, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import useResizeObserver from "@react-hook/resize-observer";
import { useStore } from "../../../providers/StoreProvider";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";
import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";

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

  const navigate = useNavigate();

  useResizeObserver(flexRef, (entry) => {
    setHeight(entry.contentRect.height);
    setWidth(entry.contentRect.width);
  });

  console.log(width);

  return (
    <Box h={"100%"}>
      <Flex
        ref={flexRef}
        h="100%"
        w="100%"
        flexDirection={doubleRow ? "row" : "column"}
        alignContent="center"
        justifyContent="center"
        alignItems={"center"}
        gap={[2, 4, 6]}
      >
        {powerUps.map((powerUp, index) => {
          return (
            <Flex width={"100%"}>
              <RerollingAnimation key={index}>
                <PowerUpComponent
                  powerUp={powerUp}
                  width={
                    doubleRow
                      ? height
                        ? isMobile
                          ? height * 0.7
                          : height
                        : 0
                      : width
                        ? width / 2
                        : 0
                  }
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
    </Box>
  );
};
