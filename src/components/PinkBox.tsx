import { Box, Button, Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { BarButton, BarButtonProps } from "./MobileBottomBar";
import { BLUE, BLUE_LIGHT, VIOLET, VIOLET_LIGHT } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";

interface PinkBoxProps extends PropsWithChildren {
  title: React.ReactNode;
  button?: string;
  onClick?: () => void;
  actionHidden?: boolean;
  glowIntensity?: number;
  color?: "violet" | "blue";
  buttonIsLoading?: boolean;
  buttonIsDisabled?: boolean;
  firstButton?: BarButtonProps;
  secondButton?: BarButtonProps;
}

export const PinkBox = ({
  children,
  title,
  button,
  onClick,
  actionHidden = false,
  glowIntensity = 0,
  color = "violet",
  buttonIsLoading = false,
  buttonIsDisabled = false,
  firstButton,
  secondButton,
}: PinkBoxProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const hasButtonBar = Boolean(firstButton || secondButton);

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
        border={`2px solid ${color === "violet" ? VIOLET_LIGHT : BLUE_LIGHT}`}
        boxShadow={
          glowIntensity > 0.5
            ? `0px 0px 25px 17px ${color === "violet" ? VIOLET : BLUE}`
            : `0px 0px 15px 7px ${color === "violet" ? VIOLET : BLUE}`
        }
        backgroundColor="rgba(0, 0, 0, 1)"
        borderRadius="10px"
        display="grid"
        justifyItems="center"
      >
        {title}
        {children}
      </Box>
      {hasButtonBar ? (
        <Flex
          mt={isSmallScreen ? 10 : 14}
          w="100%"
          gap={isSmallScreen ? 3 : 4}
          opacity={actionHidden ? 0 : 1}
          transition={"opacity 0.3s ease-in-out"}
          pointerEvents={actionHidden ? "none" : "auto"}
        >
          {firstButton && (
            <Box flex={1}>
              <BarButton {...firstButton} />
            </Box>
          )}
          {secondButton && (
            <Box flex={1}>
              <BarButton variant="secondarySolid" {...secondButton} />
            </Box>
          )}
        </Flex>
      ) : (
        button && (
          <Button
            className="game-tutorial-step-4"
            mt={isSmallScreen ? 10 : 14}
            w="100%"
            size="md"
            variant={color === "violet" ? "secondarySolid" : undefined}
            onClick={onClick}
            isLoading={buttonIsLoading}
            isDisabled={buttonIsDisabled}
            opacity={actionHidden ? 0 : 1}
            transition={"opacity 0.3s ease-in-out"}
            pointerEvents={actionHidden ? "none" : "auto"}
          >
            {button}
          </Button>
        )
      )}
    </Box>
  );
};
