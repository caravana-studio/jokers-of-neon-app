import { Flex, Text } from "@chakra-ui/react";
import { PlayDiscardIndicators } from "../../../Game/PlayDiscardIndicator";
import { useResponsiveValues } from "../../../../theme/responsiveSettings";

interface PlayDiscardIndicatorsProps {
  rerolls: number;
}

export const RerollIndicators: React.FC<PlayDiscardIndicatorsProps> = ({
  rerolls,
}) => {
  const { isSmallScreen } = useResponsiveValues();

  if (rerolls === 0) return;

  if (rerolls > 5)
    return (
      <Flex
        gap={isSmallScreen ? 2 : 4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <PlayDiscardIndicators
          disabled={false}
          type={"play"}
          total={1}
          active={rerolls === 0 ? 0 : 1}
        />
        <Text style={{ whiteSpace: "nowrap" }}>X {rerolls}</Text>
      </Flex>
    );
  else
    return (
      <PlayDiscardIndicators
        disabled={false}
        type={"play"}
        total={rerolls}
        active={rerolls}
      />
    );
};
