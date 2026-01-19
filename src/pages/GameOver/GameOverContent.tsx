import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { BackgroundDecoration } from "../../components/Background";
import { DelayedLoading } from "../../components/DelayedLoading";
import { Leaderboard } from "../../components/Leaderboard";
import {
  BarButtonProps,
  MobileBottomBar,
} from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface GameOverContentProps {
  gameId: number;
  congratulationsMsj: string;
  actualPlayerPosition?: number;
  t: (key: string, options?: Record<string, any>) => string;
  onShareClick: () => void;
  onSecondButtonClick: () => void;
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

  const content = (
    <Flex
      w={"100%"}
      h={"100%"}
      px={isSmallScreen ? 0 : 16}
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      {isSmallScreen && <MobileDecoration />}
      <Flex
        flexGrow={1}
        minH={0}
        flexDirection={"column"}
        justifyContent={{ base: "space-between", sm: "space-around" }}
        alignItems="center"
        zIndex={1}
        w={"100%"}
        my={'15px'}
      >
        {isSmallScreen && <Box h="70px" />}
        <Flex flexDirection="column" alignItems={"center"} width={{ base: "80%", sm: "100%" }}>
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
          pt={{ base: loggedIn ? 0 : 28, sm: 0 }}
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
      <Flex width={{ base: "100%", sm: "80%", md: "60%" }} mx={"auto"}>
        <MobileBottomBar
          firstButton={firstButton}
          secondButton={secondButton}
        />
      </Flex>
    </Flex>
  );

  return (
    <DelayedLoading ms={100}>
      <Flex w={"100%"} h={"100%"}>
        {isSmallScreen ? (
          content
        ) : (
          <BackgroundDecoration contentHeight={"80%"}>
            {content}
          </BackgroundDecoration>
        )}
      </Flex>
    </DelayedLoading>
  );
};
