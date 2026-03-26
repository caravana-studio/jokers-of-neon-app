import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useGameContext } from "../providers/GameProvider.tsx";
import { GREY_LINE } from "../theme/colors.tsx";
import { useGameStore } from "../state/useGameStore.ts";

export const CardContainerWithBorder = ({
  width = "100%",
  minWidth = "100%",
  maxWidth = "100%",
  height = "100%",
  paddingLeft = [2.5, 5],
  paddingRight = ["20px", "30px", "40px"],
  children,
  mr
}: {
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  paddingLeft?: any;
  paddingRight?: any;
  children: ReactNode;
  mr?: number
}) => {
  return (
    <Flex
      className="special-cards-step-3"
      border="1px solid"
      borderColor="whiteAlpha.500"
      backgroundColor="blackAlpha.500"
      pl={paddingLeft}
      pr={paddingRight}
      py={[1, 2]}
      borderRadius={["8px", "12px"]}
      justifyContent="flex-start"
      alignItems="center"
      position="relative"
      minWidth={minWidth}
      maxWidth={maxWidth}
      width={width}
      height={height}
      zIndex={0}
      margin={"0 auto"}
    >
      {children}
    </Flex>
  );
};

export const CardContainerSwitcher = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  const { isRageRound, isClassic } = useGameStore();
  return (
    <Flex
      border={`1px solid ${GREY_LINE}`}
      borderRadius={["12px", "20px"]}
      height={["60px", "110px"]}
      flexDir="column"
      justifyContent="center"
      gap={2}
      alignItems="center"
      width={["28px", "50px"]}
      position="absolute"
      right={["-15px", "-25px"]}
      backgroundColor={
        isClassic ? (isRageRound ? "black" : "backgroundBlue") : "transparent"
      }
      zIndex={60}
      onClick={onClick}
      cursor={"pointer"}
    >
      {children}
    </Flex>
  );
};
