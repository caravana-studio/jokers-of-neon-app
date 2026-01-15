import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useLoadingHints } from "../../hooks/useLoadingHints";
import { ProgressBar } from "../CompactRoundData/ProgressBar";

export interface BaseLoadingBarProps {
  progress: number;
  currentStageText: string;
}

export const BaseLoadingBar = ({
  progress,
  currentStageText,
}: BaseLoadingBarProps) => {
  const [dots, setDots] = useState("...");
  const hint = useLoadingHints();

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "." : prev === "." ? ".." : "..."));
    }, 500);
    return () => clearInterval(dotsInterval);
  }, []);

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
        h="45px"
        justifyContent={"center"}
        alignContent={"flex-end"}
        w="100%"
      >
        <Heading
          zIndex={2}
          fontSize={isMobile ? "sm" : "md"}
          textAlign="center"
          letterSpacing={1.2}
        >
          {currentStageText}
          {dots}
        </Heading>
      </Flex>
      <ProgressBar progress={Math.round(progress)} />
      <Text
        fontSize={isMobile ? "xs" : "sm"}
        textAlign="center"
        color="gray.400"
        mt={4}
        px={4}
        minH="40px"
      >
        {hint}
      </Text>
    </Flex>
  );
};
