import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
      h="150px"
      justifyContent="center"
      flexDirection="column"
      gap={4}
    >
      <Heading zIndex={2} size="sm" textAlign="center" variant="italic">
        {currentStageText}
        {dots}
      </Heading>
      <ProgressBar progress={Math.round(progress)} />
    </Flex>
  );
};
