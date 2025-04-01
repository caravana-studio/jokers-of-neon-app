import { Box, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PowerUpComponent } from "../../../components/PowerUpComponent";
import { CARD_WIDTH } from "../../../constants/visualProps";
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

  const navigate = useNavigate();

  const { cardScale } = useResponsiveValues();

  const adjustedScale = doubleRow ? 1.8 * cardScale : cardScale;
  const width = CARD_WIDTH * adjustedScale;

  return (
    <Box>
      <Flex
        flexDirection={doubleRow ? "row" : "column"}
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
