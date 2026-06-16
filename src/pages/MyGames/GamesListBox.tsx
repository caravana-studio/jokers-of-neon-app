import { Box, Checkbox, Flex, Text } from "@chakra-ui/react";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/Loading";
import { useGameContext } from "../../providers/GameProvider";
import { useGetMyGames } from "../../queries/useGetMyGames";
import { useGameStore } from "../../state/useGameStore";
import { BLUE, BLUE_LIGHT, VIOLET, VIOLET_LIGHT } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { getInProgressGames } from "../../utils/inProgressGames";
import { GameBox } from "./GameBox";

interface GamesListBoxProps {
  isTournament: boolean;
  width?: ComponentProps<typeof Box>["width"];
}

export const GamesListBox = ({
  isTournament,
  width = { base: "90%", sm: "70%", md: "900px" },
}: GamesListBoxProps) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });
  const { data: games, isLoading, refetch } = useGetMyGames();
  const { isSmallScreen } = useResponsiveValues();
  const [showFinishedGames, setShowFinishedGames] = useState(false);
  const [surrenderedIds, setSurrenderedIds] = useState<number[]>([]);

  const { resetLevel } = useGameContext();
  const { removeGameId } = useGameStore();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    refetch();
    resetLevel();
    removeGameId();
  }, [refetch, resetLevel, removeGameId]);

  const filteredGames = useMemo(() => {
    const visibleGames = showFinishedGames ? games : getInProgressGames(games);

    return visibleGames.filter((game) => {
      if (isTournament && !Boolean(game.isTournament)) return false;
      return !surrenderedIds.includes(game.id);
    });
  }, [games, isTournament, showFinishedGames, surrenderedIds]);

  const handleSurrendered = (gameId: number) => {
    const storedGameId = localStorage.getItem("GAME_ID");

    if (storedGameId && Number(storedGameId) === gameId) {
      localStorage.removeItem("GAME_ID");
    }

    setSurrenderedIds((prev) => [...prev, gameId]);
  };

  const borderColor = isTournament ? BLUE_LIGHT : VIOLET_LIGHT;
  const shadowColor = isTournament ? BLUE : VIOLET;
  const shouldScroll = isLoading || filteredGames.length > 0;

  return (
    <Box
      border={`2px solid ${borderColor}`}
      boxShadow={`0px 0px 20px 15px ${shadowColor}`}
      backgroundColor="rgba(0, 0, 0, 1)"
      borderRadius="20px"
      display="flex"
      px={[4, 8]}
      py={isSmallScreen ? 0 : 4}
      width={width}
      flexGrow={1}
      minH={0}
      maxHeight="500px"
      overflowY={shouldScroll ? "auto" : "hidden"}
    >
      <Flex
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-end"
        w="100%"
        gap={4}
        h="100%"
        pt={shouldScroll ? 4 : 0}
        pb={shouldScroll ? 4 : 0}
      >
        {!isSmallScreen && (
          <Checkbox
            color="white"
            checked={showFinishedGames}
            onChange={(e) => {
              setShowFinishedGames(e.target.checked);
            }}
          >
            {t("show-finished-games").toUpperCase()}
          </Checkbox>
        )}
        {filteredGames.length === 0 && !isLoading ? (
          <Flex flexGrow={1} w="100%" justifyContent="center" alignItems="center">
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Text size="lg">{t("no-games")}</Text>
            </Flex>
          </Flex>
        ) : (
          <Flex flexDirection="column" gap={3} w="100%">
            {isLoading && <Loading />}
            {filteredGames.map((game) => (
              <GameBox
                key={game.id}
                game={game}
                onSurrendered={() => handleSurrendered(game.id)}
                hideTournamentBadge={isTournament}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
