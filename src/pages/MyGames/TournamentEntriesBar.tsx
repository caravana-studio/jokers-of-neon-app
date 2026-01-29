import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useSeasonProgressStore } from "../../state/useSeasonProgressStore.ts";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";

export const TournamentEntriesBar = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.tournament-banner",
  });
  const navigate = useNavigate();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const { isSmallScreen } = useResponsiveValues();
  const {
    account: { account },
  } = useDojo();

  const entries = useSeasonProgressStore((store) => store.tournamentEntries);

  const entryLimit = isSmallScreen ? 4 : 6;

  const lastUserAddress = useSeasonProgressStore(
    (store) => store.lastUserAddress,
  );
  const refetchSeasonProgress = useSeasonProgressStore(
    (store) => store.refetch,
  );
  const resetSeasonProgress = useSeasonProgressStore((store) => store.reset);

  useEffect(() => {
    if (!account?.address) {
      if (lastUserAddress) {
        resetSeasonProgress();
      }
      return;
    }

    if (lastUserAddress !== account.address) {
      void refetchSeasonProgress({ userAddress: account.address });
    }
  }, [
    account?.address,
    lastUserAddress,
    refetchSeasonProgress,
    resetSeasonProgress,
  ]);

  const handleCreateGame = () => {
    prepareNewGame();
    executeCreateGame(true);
    navigate("/entering-tournament");
  };

  const entrySize = isSmallScreen ? "30px" : "50px";
  const entriesText = entries === 1 ? t("entry") : t("entries", { entries });

  return (
    <Flex flexDir="column" gap={2} alignItems="center">
      {entries > 0 && (
        <Text textTransform="uppercase" textAlign="center">
          {entriesText}
        </Text>
      )}
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap={isSmallScreen ? 2 : 4}
        flexWrap="wrap"
      >
        {entries <= entryLimit &&
          Array.from({ length: entries }).map((_, index) => (
            <CachedImage
              key={`tournament-entry-${index}`}
              src="/tournament-entry.png"
              h={entrySize}
            />
          ))}
        {entries > entryLimit && (
          <Flex alignItems="center" gap={2}>
            <CachedImage src="/tournament-entry.png" h={entrySize} />
            <Text color="white" mr={2}>
              x {entries}
            </Text>
          </Flex>
        )}
        {entries === 0 && (
          <Text textTransform="uppercase" textAlign="center">
            {t("no-entries")} <br />
            {t("unlock")}
          </Text>
        )}

        <Button
          onClick={handleCreateGame}
          width={isSmallScreen ? "150px" : "200px"}
          ml={1}
          fontSize={isSmallScreen ? 10 : 15}
          h={isSmallScreen ? "30px" : "35px"}
          variant="solid"
          isDisabled={entries === 0}
        >
          {t("play-tournament")}
        </Button>
      </Flex>
      {/*       {entries === 0 && (
        <Text
          fontSize={isSmallScreen ? 9 : 15}
          textTransform="uppercase"
          textAlign="center"
        >
          {t("unlock")}
        </Text>
      )} */}
    </Flex>
  );
};
