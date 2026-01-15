import { Flex, Heading } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useLoadingHints } from "../../hooks/useLoadingHints";
import { ProgressBar } from "../CompactRoundData/ProgressBar";

export interface BaseLoadingBarProps {
  progress: number;
  currentStageText: string;
}

export const BaseLoadingBar = ({ progress }: BaseLoadingBarProps) => {
  const hint = useLoadingHints();

  return (
    <Flex
      p={6}
      w="100%"
      h="250px"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Flex
        minH="45px"
        justifyContent={"center"}
        alignItems={"center"}
        w="100%"
        mb={4}
      >
        <Heading
          zIndex={2}
          fontSize={isMobile ? "sm" : "md"}
          textAlign="center"
          letterSpacing={1.2}
        >
          {hint}
        </Heading>
      </Flex>
      <ProgressBar progress={Math.round(progress)} />
    </Flex>
  );
};
