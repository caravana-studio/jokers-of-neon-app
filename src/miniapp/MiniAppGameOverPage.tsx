import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { GAME_ID } from "../constants/localStorage";
import { looseSfx } from "../constants/sfx";
import { getGameView } from "../dojo/queries/getGameView";
import { useDojo } from "../dojo/useDojo";
import { useAudio } from "../hooks/useAudio";
import { useGameContext } from "../providers/GameProvider";
import { useSettings } from "../providers/SettingsProvider";
import { ApiLeaderboardEntry } from "../queries/useGetApiLeaderboard";
import { useUsernameStore } from "../state/useUsernameStore";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { logEvent } from "../utils/analytics";
import { normalizeGameId } from "../utils/normalizeGameId";
import { addressKey } from "../utils/starknetAddress";
import { BackgroundDecoration } from "../components/Background";
import { MiniAppLeaderboardTable } from "./leaderboard/MiniAppLeaderboardTable";
import { useMiniAppWeeklyLeaderboard } from "./leaderboard/useMiniAppWeeklyLeaderboard";
import { useMiniAppIdentity } from "./session/useMiniAppSession";

export const MiniAppGameOverPage = () => {
  const { t } = useTranslation(["intermediate-screens", "home"]);
  const navigate = useNavigate();
  const { gameId = "" } = useParams();
  const normalizedGameId = normalizeGameId(gameId);
  const { setup: { client } } = useDojo();
  const { userAddress } = useMiniAppIdentity();
  const { sfxVolume } = useSettings();
  const { isSmallScreen } = useResponsiveValues();
  const { play: looseSound, stop: stopLooseSound } = useAudio(
    looseSfx,
    sfxVolume
  );
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const storeAddress = useUsernameStore((store) => store.address);
  const username = useUsernameStore((store) => store.username);
  const loadUsername = useUsernameStore((store) => store.loadUsername);
  const [now, setNow] = useState(() => new Date());
  const [fallbackGameEntry, setFallbackGameEntry] =
    useState<ApiLeaderboardEntry | null>(null);
  const { entries, currentUserAddress, isLoading, error } =
    useMiniAppWeeklyLeaderboard(now, 200);
  const leaderboardHasCurrentGame = entries.some(
    (entry) => normalizeGameId(entry.id) === normalizedGameId
  );

  const mergedEntries = useMemo(() => {
    const entriesWithCurrentUsername = entries.map((entry) => {
      const isCurrentGame =
        normalizeGameId(entry.id) === normalizedGameId && Boolean(username);

      if (!isCurrentGame) {
        return entry;
      }

      return {
        ...entry,
        username: username ?? entry.username,
        displayName: username ?? entry.displayName,
        playerName: username ?? entry.playerName,
      };
    });

    if (!fallbackGameEntry) {
      return entriesWithCurrentUsername;
    }

    const alreadyIncluded = entriesWithCurrentUsername.some(
      (entry) => normalizeGameId(entry.id) === normalizeGameId(fallbackGameEntry.id)
    );

    if (alreadyIncluded) {
      return entriesWithCurrentUsername;
    }

    const merged = [...entriesWithCurrentUsername, fallbackGameEntry]
      .sort((a, b) => {
        if (b.playerScore !== a.playerScore) {
          return b.playerScore - a.playerScore;
        }

        return a.id - b.id;
      })
      .map((entry, index) => ({
        ...entry,
        position: index + 1,
      }));

    return merged;
  }, [entries, fallbackGameEntry, normalizedGameId, userAddress, username]);

  const currentGameEntry = mergedEntries.find(
    (entry) => normalizeGameId(entry.id) === normalizedGameId
  );

  const congratulationsMsj =
    currentGameEntry?.position === 1
      ? t("game-over.table.gameOver-leader-msj", {
          ns: "intermediate-screens",
        })
      : currentGameEntry?.position && currentGameEntry.position <= 5
        ? t("game-over.table.gameOver-top5-msj", {
            ns: "intermediate-screens",
          })
        : "";

  useEffect(() => {
    logEvent("open_game_over_page", { player_type: "miniapp" });
    looseSound();
    localStorage.removeItem(GAME_ID);

    return () => {
      stopLooseSound();
    };
  }, [looseSound, stopLooseSound]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (addressKey(storeAddress) === addressKey(userAddress) || !userAddress) {
      return;
    }

    void loadUsername(userAddress);
  }, [loadUsername, storeAddress, userAddress]);

  useEffect(() => {
    if (!client || !normalizedGameId || leaderboardHasCurrentGame) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const gameView = await getGameView(client, Number(normalizedGameId));
      if (cancelled || !gameView.game.id || gameView.game.player_score <= 0) {
        return;
      }

      const displayName = username || gameView.game.owner;

      setFallbackGameEntry({
        position: entries.length + 1,
        id: gameView.game.id,
        owner: gameView.game.owner,
        username: username || null,
        displayName,
        playerName: displayName,
        playerScore: gameView.game.player_score,
        cash: gameView.game.cash,
        round: gameView.game.round,
        isTournament: gameView.game.is_tournament,
        level: gameView.game.level,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [
    client,
    entries.length,
    leaderboardHasCurrentGame,
    normalizedGameId,
    userAddress,
    username,
  ]);

  const handlePlayAgain = () => {
    prepareNewGame();
    const createGamePromise = executeCreateGame();
    navigate("/entering-tournament");

    void createGamePromise.then((started) => {
      if (!started) {
        navigate("/my-games", { replace: true });
      }
    });
  };

  const content = (
    <Flex
      w="100%"
      h="100%"
      px={isSmallScreen ? 0 : 16}
      flexDirection="column"
      justifyContent="space-between"
    >
      {isSmallScreen && <MobileDecoration />}
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        zIndex={1}
        pt={{ base: 10, sm: 8 }}
      >
        <Heading
          size={{ base: "sm", sm: "md" }}
          variant="italic"
          textAlign="center"
          mb={congratulationsMsj ? 3 : 0}
        >
          {t("game-over.gameOver-msj", { ns: "intermediate-screens" })}
        </Heading>
        {congratulationsMsj && (
          <Text size="md" textAlign="center" mb={10} mx={6}>
            {congratulationsMsj}
          </Text>
        )}
      </Flex>

      <Flex
        flexGrow={1}
        minH={0}
        w="100%"
        alignItems="center"
        justifyContent="center"
        pb={{ base: 6, sm: 10 }}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width={{ base: "84%", sm: "100%" }}
          maxW={{ base: "100%", md: "720px" }}
        >
          {isLoading ? (
            <Flex justifyContent="center" pt={6}>
              <Spinner />
            </Flex>
          ) : error ? (
            <Text color="white" textAlign="center">
              {error instanceof Error ? error.message : "Could not load leaderboard"}
            </Text>
          ) : (
            <MiniAppLeaderboardTable
              entries={mergedEntries}
              currentUserAddress={currentUserAddress}
              currentGameId={gameId}
              lines={4}
              isSmallScreen={Boolean(isSmallScreen)}
              t={t}
              width="100%"
              px={isSmallScreen ? 0 : 8}
            />
          )}
        </Flex>
      </Flex>

      <Flex width={{ base: "100%", sm: "80%", md: "60%" }} mx="auto">
        <MobileBottomBar
          firstButton={{
            onClick: () => navigate("/", { replace: true }),
            label: t("game-over.btn.go-home", {
              ns: "intermediate-screens",
            }).toUpperCase(),
          }}
          secondButton={{
            onClick: handlePlayAgain,
            label: t("game-over.btn.play-again", {
              ns: "intermediate-screens",
            }).toUpperCase(),
          }}
        />
      </Flex>
    </Flex>
  );

  return (
    <DelayedLoading ms={100}>
      <Flex w="100%" h="100%">
        {isSmallScreen ? (
          content
        ) : (
          <BackgroundDecoration contentHeight="80%">{content}</BackgroundDecoration>
        )}
      </Flex>
    </DelayedLoading>
  );
};
