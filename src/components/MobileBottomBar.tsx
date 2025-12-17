import { Box, Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../theme/responsiveSettings";
import CachedImage from "./CachedImage";

export interface BarButtonProps extends ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label: ReactNode;
  disabledText?: string;
  icon?: ReactNode;
  variant?: string;
}

interface MobileBottomBarProps {
  firstButton?: BarButtonProps;
  secondButton?: BarButtonProps;
  firstButtonReactNode?: ReactNode;
  secondButtonReactNode?: ReactNode;
  setRun?: (run: boolean) => void;
  navigateState?: {};
}

export const BarButton = ({
  onClick,
  disabled,
  label,
  disabledText,
  icon,
  variant = "solid",
  ...buttonProps
}: BarButtonProps) => {
  const { isSmallScreen } = useResponsiveValues();
  return disabled && disabledText ? (
    <Text fontSize={10}>{disabledText}</Text>
  ) : (
    <Button
      variant={variant}
      w={"100%"}
      h={isSmallScreen ? "28px" : "40px"}
      fontSize={isSmallScreen ? "10px" : "15px"}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {label}
      {icon && <Flex sx={{ ml: 1.5 }}>{icon}</Flex>}
    </Button>
  );
};

export const MobileBottomBar = ({
  firstButton,
  firstButtonReactNode,
  secondButton,
  secondButtonReactNode,
  setRun,
  navigateState,
}: MobileBottomBarProps) => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();

  const uniqueFirstButton = firstButton ?? firstButtonReactNode;
  const uniqueSecondButton = secondButton ?? secondButtonReactNode;

  const uniqueButton =
    (firstButton || firstButtonReactNode) &&
    !secondButton &&
    !secondButtonReactNode
      ? uniqueFirstButton
      : (secondButton || secondButtonReactNode) &&
          !firstButton &&
          !firstButtonReactNode
        ? uniqueSecondButton
        : undefined;

  return (
    <Flex
      width="98%"
      mx={4}
      mb={8}
      mt={3}
      justifyContent={isSmallScreen ? "space-between" : "center "}
      gap={isSmallScreen ? 0 : 8}
      alignItems={"center"}
      zIndex={900}
    >
      <Box w="30px" />

      {uniqueButton ? (
        <Box w="40%">
          {React.isValidElement(uniqueButton) ? (
            uniqueButton
          ) : (
            <BarButton {...(uniqueButton as BarButtonProps)} />
          )}
        </Box>
      ) : (
        <>
          <Box w="30%">
            {firstButton ? (
              <BarButton {...firstButton} />
            ) : (
              firstButtonReactNode
            )}
          </Box>
          <Box w="30%">
            {secondButton ? (
              <BarButton  variant="secondarySolid" {...secondButton} />
            ) : (
              secondButtonReactNode
            )}
          </Box>
        </>
      )}
      {isSmallScreen && (
        <Box w="30px" />
      )}
    </Flex>
  );
};
