import { Flex, Text } from "@chakra-ui/react";
import { PlayDiscardIndicators } from "../../../Game/PlayDiscardIndicator";

interface PlayDiscardIndicatorsProps {
  rerolls: number;
  rerollsActive: number;
}

export const RerollIndicators: React.FC<PlayDiscardIndicatorsProps> = ({
  rerolls,
  rerollsActive,
}) => {
  if (rerolls > 5)
    return (
      <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
        <PlayDiscardIndicators
          disabled={false}
          type={"play"}
          total={1}
          active={rerollsActive === 0 ? 0 : 1}
        />
        <Text style={{ whiteSpace: "nowrap" }}>X {rerollsActive}</Text>
      </Flex>
    );
  else
    return (
      <PlayDiscardIndicators
        disabled={false}
        type={"play"}
        total={rerolls}
        active={rerollsActive}
      />
    );
};
