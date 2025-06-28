import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { BackgroundDecoration } from "../../components/Background";
import { Leaderboard } from "../../components/Leaderboard";
import { MobileBottomBar } from "../../components/MobileBottomBar";
import { MobileDecoration } from "../../components/MobileDecoration";
import { GAME_ID } from "../../constants/localStorage";
import { looseSfx } from "../../constants/sfx";
import { useAudio } from "../../hooks/useAudio";
import { useGameContext } from "../../providers/GameProvider";
import { useGetLeaderboard } from "../../queries/useGetLeaderboard";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { runConfettiAnimation } from "../../utils/runConfettiAnimation";
import { signedHexToNumber } from "../../utils/signedHexToNumber";

const GAME_URL = "https://jokersofneon.com";

export const GameOverLoggedIn = () => {
  const params = useParams();

  const gameId = Number(params.gameId);

  const { restartGame, setIsRageRound, executeCreateGame } = useGameContext();

  const { play: looseSound, stop: stopLooseSound } = useAudio(looseSfx);
  const { data: fullLeaderboard } = useGetLeaderboard(gameId);

  const actualPlayer = fullLeaderboard?.find(
    (player) => signedHexToNumber(player.id.toString()) === gameId
  );

  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation(["intermediate-screens"]);

  const [isLoading, setIsLoading] = useState(false);

  let congratulationsMsj = "";

  if (actualPlayer?.position != undefined) {
    congratulationsMsj =
      actualPlayer?.position === 1
        ? t("game-over.table.gameOver-leader-msj")
        : actualPlayer?.position > 1 && actualPlayer?.position <= 5
          ? t("game-over.table.gameOver-top5-msj")
          : "";
  }

  const position = actualPlayer?.position ?? 100;

  useEffect(() => {
    looseSound();
    localStorage.removeItem(GAME_ID);
    setIsRageRound(false);
  }, []);

  useEffect(() => {
    if (position <= 10) {
      runConfettiAnimation(position <= 3 ? 300 : 100);
    }
  }, [position]);

  const onStartGameClick = () => {
    setIsLoading(true);
    localStorage.removeItem(GAME_ID);
    restartGame();
    stopLooseSound();
    executeCreateGame();
  };

  const onShareClick = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=%F0%9F%83%8F%20I%20just%20finished%20a%20game%20in%20%40jokers_of_neon%20%E2%80%94%20check%20out%20my%20results%3A%0A%F0%9F%8F%85%20Rank%3A%20${actualPlayer?.position ?? 0}%0A%F0%9F%94%A5%20Level%3A%20${actualPlayer?.level ?? 0}%0A%0AJoin%20me%20and%20test%20the%20early%20access%20version%0A${GAME_URL}%2F%20%F0%9F%83%8F%E2%9C%A8
`,
      "_blank"
    );
  };

  return (
    <BackgroundDecoration>
      {isSmallScreen && <MobileDecoration />}
      <Flex
        height="100%"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={4}
        zIndex={1}
      >
        <Flex flexDirection="column" width="100%">
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
          <Leaderboard gameId={gameId} lines={4} filterLoggedInPlayers />
          {isSmallScreen ? (
            <Flex h="70px" />
          ) : (
            <Flex mt={16} justifyContent={"space-between"} gap={4}>
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
        </Flex>
        {isSmallScreen && (
          <Flex position="absolute" bottom={0} w="100%" zIndex={1000}>
            <MobileBottomBar
              firstButton={{
                onClick: onShareClick,
                label: t("game-over.btn.gameOver-share-btn"),
                icon: <FontAwesomeIcon fontSize={10} icon={faXTwitter} />,
              }}
              secondButton={{
                onClick: onStartGameClick,
                label: t("game-over.btn.gameOver-newGame-btn"),
                disabled: isLoading,
              }}
              hideDeckButton
            />
          </Flex>
        )}
      </Flex>
    </BackgroundDecoration>
  );
};
