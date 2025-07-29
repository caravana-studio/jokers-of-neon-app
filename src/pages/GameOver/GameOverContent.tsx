import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { BackgroundDecoration } from "../../components/Background";
import { Leaderboard } from "../../components/Leaderboard";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useResponsiveValues } from "../../theme/responsiveSettings";

interface GameOverContentProps {
  gameId: number;
  congratulationsMsj: string;
  actualPlayerPosition?: number;
  t: (key: string, options?: Record<string, any>) => string;
  onShareClick: () => void;
  onStartGameClick: () => void;
  isLoading: boolean;
  leaderboardFilterLoggedInPlayers?: boolean;
  bottomContent?: React.ReactNode;
  mainActionButtons?: React.ReactNode;
  loggedIn?: boolean;
}

export const GameOverContent: React.FC<GameOverContentProps> = ({
  gameId,
  congratulationsMsj,
  actualPlayerPosition,
  t,
  onShareClick,
  onStartGameClick,
  isLoading,
  leaderboardFilterLoggedInPlayers = false,
  bottomContent,
  mainActionButtons,
  loggedIn,
}) => {
  const { isSmallScreen } = useResponsiveValues();

  return (
    <BackgroundDecoration>
      {isSmallScreen && <MobileDecoration />}
      <Flex
        height="100%"
        flexDirection={{ base: "column", sm: loggedIn ? "column" : "row" }}
        justifyContent={{ base: "center", sm: "space-around" }}
        alignItems="center"
        flexWrap={"wrap"}
        zIndex={1}
        w={loggedIn ? "70%" : { base: "70%", sm: "100%" }}
      >
        <Flex
          flexDirection="column"
          width={{ base: "100%", sm: loggedIn ? "70%" : "50%" }}
        >
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

          {mainActionButtons || (
            <Flex gap={4}>
              <Button
                width={"50%"}
                variant="solid"
                onClick={onShareClick}
                data-size="large"
              >
                {t("game-over.btn.gameOver-share-btn")}
                <Flex sx={{ ml: 2.5 }}>
                  <FontAwesomeIcon fontSize={22} icon={faXTwitter} />
                </Flex>
              </Button>
              <Button
                width={"50%"}
                variant="secondarySolid"
                isDisabled={isLoading}
                onClick={onStartGameClick}
              >
                {t("game-over.btn.gameOver-newGame-btn")}
              </Button>
            </Flex>
          )}
          {bottomContent}
        </Flex>
      </Flex>
    </BackgroundDecoration>
  );
};
