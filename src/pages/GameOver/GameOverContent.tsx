import { Flex, Heading, Text } from "@chakra-ui/react";
import { BackgroundDecoration } from "../../components/Background";
import { Leaderboard } from "../../components/Leaderboard";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import {
  BarButtonProps,
  MobileBottomBar,
} from "../../components/MobileBottomBar";

interface GameOverContentProps {
  gameId: number;
  congratulationsMsj: string;
  actualPlayerPosition?: number;
  t: (key: string, options?: Record<string, any>) => string;
  onShareClick: () => void;
  onStartGameClick: () => void;
  isLoading: boolean;
  leaderboardFilterLoggedInPlayers?: boolean;
  firstButton?: BarButtonProps;
  secondButton?: BarButtonProps;
  loggedIn?: boolean;
}

export const GameOverContent: React.FC<GameOverContentProps> = ({
  gameId,
  congratulationsMsj,
  actualPlayerPosition,
  t,
  leaderboardFilterLoggedInPlayers = false,
  firstButton,
  secondButton,
  loggedIn,
}) => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <BackgroundDecoration contentHeight={"80%"}>
      <Flex
        w={"100%"}
        h={"100%"}
        px={isSmallScreen ? 0 : 16}
        flexDirection={"column"}
        justifyContent={"space-around"}
      >
        {isSmallScreen && <MobileDecoration />}
        <Flex
          height="100%"
          flexDirection={{ base: "column", sm: loggedIn ? "column" : "row" }}
          justifyContent={{ base: "center", sm: "space-around" }}
          alignItems="center"
          flexWrap={"wrap"}
          zIndex={1}
          // w={loggedIn ? "70%" : { base: "70%", sm: "100%" }}
          w={"100%"}
        >
          <Flex flexDirection="column" width={{ base: "80%", sm: "50%" }}>
            <Heading
              size={{ base: "sm", sm: "md" }}
              variant="italic"
              textAlign={"center"}
              mb={{ base: 0, sm: 3 }}
            >
              {t("game-over.gameOver-msj")}
            </Heading>
            <Text size={"md"} textAlign={"center"} mb={10} mx={6}>
              {congratulationsMsj}
            </Text>
            <Leaderboard
              gameId={gameId}
              lines={4}
              filterLoggedInPlayers={leaderboardFilterLoggedInPlayers}
            />
            {isSmallScreen && <Flex h="70px" />}
          </Flex>
          <Flex
            flexDirection={"column"}
            width={{ base: "100%", sm: loggedIn ? "30%" : "auto" }}
            gap={{ base: 4, sm: 8 }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {actualPlayerPosition !== undefined && !loggedIn && (
              <Text>
                {t("game-over.current-position", {
                  position: actualPlayerPosition,
                })}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex width={"100%"}>
          <MobileBottomBar
            hideDeckButton
            firstButton={firstButton}
            secondButton={secondButton}
          />
        </Flex>
      </Flex>
    </BackgroundDecoration>
  );
};
