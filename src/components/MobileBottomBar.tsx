import { Box, Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../theme/responsiveSettings";
import CachedImage from "./CachedImage";
import { GameMenuBtn } from "./Menu/GameMenu/GameMenuBtn";

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
  hideDeckButton?: boolean;
  navigateState?: {};
  hideMenuButton?: boolean;
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
  return disabled && disabledText ? (
    <Text fontSize={10}>{disabledText}</Text>
  ) : (
    <Button
      variant={variant}
      w={"100%"}
      h={"28px"}
      fontSize={"10px"}
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
  hideDeckButton,
  navigateState,
  hideMenuButton = false,
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
      zIndex={1000}
    >
      {hideMenuButton ? (
        <Box w="30px" />
      ) : (
        isSmallScreen && (
          <GameMenuBtn
            showTutorial={
              setRun
                ? () => {
                    setRun(true);
                  }
                : () => {
                    navigate("/tutorial");
                  }
            }
          />
        )
      )}
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
              <BarButton {...secondButton} variant="secondarySolid" />
            ) : (
              secondButtonReactNode
            )}
          </Box>
        </>
      )}
      {isSmallScreen && (
        <Flex
          height={["30px", "45px"]}
          justifyContent="center"
          alignItems="center"
          width={["30px", "45px"]}
          border={hideDeckButton ? "none" : "1px solid white"}
          borderRadius={["8px", "14px"]}
          className="game-tutorial-step-9"
          onClick={() => !hideDeckButton && navigate("/deck", navigateState)}
        >
          {hideDeckButton ? (
            <></>
          ) : (
            <CachedImage height="15px" src="deck-icon.png" alt="deck-icon" />
          )}
        </Flex>
      )}
    </Flex>
  );
};
