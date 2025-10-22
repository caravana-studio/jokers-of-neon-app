import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { VIOLET } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { STEP_HEIGHT } from "./Step";
import { IStep } from "./types";

interface IProgressBarProps {
  progress: number;
  color?: string;
  steps: IStep[];
  currentXp: number;
}

export const VerticalProgressBar = ({
  progress,
  color = VIOLET,
  steps,
  currentXp,
}: IProgressBarProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "season-progression",
  });
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Box position="relative" h="100%" py={1}>
      <Box
        w="12px"
        h="100%"
        borderRadius="full"
        border="1px solid white"
        position="relative"
        zIndex={2}
      ></Box>

      <Box
        w="100%"
        my={1}
        bg={color}
        boxShadow={progress && `0px 0px 6px 3px ${color}`}
        height={`${progress}px`}
        borderRadius="full"
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        transition="height 1s ease"
      />
      <Flex
        flexDir="column"
        right={6}
        textAlign={"right"}
        position="absolute"
        top={`${progress - 20}px`}
      >
        <Text lineHeight={1} fontSize={isSmallScreen ? 8 : 10}>
          {t("my-xp")}
        </Text>
        <Heading lineHeight={1.2} fontSize={isSmallScreen ? 15 : 20} variant="italic">
          {currentXp}
        </Heading>
      </Flex>
      {steps.map((step, index) => (
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          position="absolute"
          top={`${index * STEP_HEIGHT + STEP_HEIGHT / 2}px`}
          height={isSmallScreen ? "25px" : "35px"}
          mt={isSmallScreen ? "-12px" : "-15px"}
          ml={isSmallScreen ? "-7px" : "-12px"}
          zIndex={3}
          w={isSmallScreen ? "25px" : "35px"}
          bgColor={currentXp >= step.xp ? VIOLET : "black"}
          borderRadius={"5px"}
          boxShadow={
            currentXp >= step.xp ? `0px 0px 6px 3px ${VIOLET}` : "none"
          }
          border="1px solid white"
          transform="rotate(45deg)"
          transition="all 0.2s ease-in-out"
        >
          <Heading
            color="white"
            fontSize={isSmallScreen ? 8 : 10}
            variant="italic"
            transform="rotate(-45deg)"
          >
            {step.xp}
          </Heading>
        </Flex>
      ))}
    </Box>
  );
};
