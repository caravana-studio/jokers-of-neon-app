import { Box, Flex } from "@chakra-ui/react";
import { BLUE, VIOLET } from "../../theme/colors";

interface PlayDiscardIndicatorProps {
  disabled: boolean;
  on: boolean;
  color: string;
}
const PlayDiscardIndicator = ({
  disabled,
  on,
  color,
}: PlayDiscardIndicatorProps) => {
  return (
    <Box
      width={["9px", "11px"]}
      height={["9px", "11px"]}
      borderRadius="full"
      backgroundColor={on ? color : "transparent"}
      border="1px solid white"
      boxShadow={on && !disabled ? `0px 0px 10px 6px ${color}` : "none"}
    />
  );
};

interface PlayDiscardIndicatorsProps {
  disabled: boolean;
  type: "play" | "discard";
  total: number;
  active: number;
  justifyContent?: string;
}

export const PlayDiscardIndicators = ({
  disabled,
  type,
  total,
  active,
  justifyContent,
}: PlayDiscardIndicatorsProps) => {
  const color = type === "play" ? VIOLET : BLUE;
  return (
    <Flex
      w="100%"
      justifyContent={justifyContent ?? "space-around"}
      alignItems="center"
      gap={{ base: 2, sm: 4 }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <PlayDiscardIndicator
          key={index}
          disabled={disabled}
          on={index < active}
          color={color}
        />
      ))}
    </Flex>
  );
};
