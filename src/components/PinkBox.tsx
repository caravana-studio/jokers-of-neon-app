import { Box, Button, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { VIOLET, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface PinkBoxProps extends PropsWithChildren {
  title: React.ReactNode;
  button?: string;
  onClick?: () => void;
  actionHidden?: boolean;
  glowIntensity?: number;
}

export const PinkBox = ({
  children,
  title,
  button,
  onClick,
  actionHidden = false,
  glowIntensity = 0,
}: PinkBoxProps) => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      w="80%"
      maxW="550px"
      fontFamily="Orbitron"
    >
      <Box
        w="100%"
        px={[1, 2, 4]}
        py={2}
        border="2px solid #DAA1E8FF"
        boxShadow={glowIntensity > 0.5 ? `0px 0px 25px 17px ${VIOLET}` : `0px 0px 15px 7px ${VIOLET}`}
        filter="blur(0.5px)"
        backgroundColor="rgba(0, 0, 0, 1)"
        borderRadius="10px"
        display="grid"
        justifyItems="center"
      >
{title}
        {children}
      </Box>
      {button && (
        <Button
          className="game-tutorial-step-4"
          mt={isSmallScreen ? 10 : 14}
          w="100%"
          size="md"
          variant="secondarySolid"
          onClick={onClick}
          opacity={actionHidden ? 0 : 1}
          transition={"opacity 0.3s ease-in-out"}
          pointerEvents={actionHidden ? "none" : "auto"}
        >
          {button}
        </Button>
      )}
    </Box>
  );
};
