import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CachedImage from "./CachedImage";
import { GameMenuBtn } from "./Menu/GameMenu/GameMenuBtn";

export interface BarButtonProps {
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
}

const BarButton = ({
  onClick,
  disabled,
  label,
  disabledText,
  icon,
  variant = "solid",
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
}: MobileBottomBarProps) => {
  const navigate = useNavigate();

  const uniqueButton =
    firstButton && !secondButton
      ? firstButton
      : secondButton && !firstButton
        ? secondButton
        : undefined;
  return (
    <Flex
      width="98%"
      mx={4}
      mb={8}
      mt={3}
      justifyContent={"space-between"}
      zIndex={1000}
    >
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
      {uniqueButton ? (
        <Box w="40%">
          <BarButton {...uniqueButton} />
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
    </Flex>
  );
};
