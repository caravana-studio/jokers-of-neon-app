import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps.ts";
import { useGameContext } from "../providers/GameProvider.tsx";
import { GREY_LINE } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";

export const CardContainerWithBorder = ({
    width = '100%',
    height = '100%',
  children,

}: {
    width?: string;
    height?: string;
  children: ReactNode;
}) => {

  return (
    <Flex
      className="special-cards-step-3"
      border={`1px solid ${GREY_LINE}`}
      pl={[2.5, 5]}
      pr={["12px", "25px"]}
      py={[1, 2]}
      pb={[0, "25px"]}
      borderRadius={["12px", "20px"]}
      justifyContent="flex-start"
      alignItems="center"
      position="relative"
      width={width}
      height={height}
      zIndex={0}
    >
      {children}
    </Flex>
  );
};

export const CardContainerSwitcher = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isRageRound } = useGameContext();
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
      backgroundColor={isRageRound ? "black" : "backgroundBlue"}
      zIndex={10}
    >
      {children}
    </Flex>
  );
};
