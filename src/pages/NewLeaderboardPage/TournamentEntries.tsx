import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getSeasonProgress } from "../../api/getSeasonProgress";
import CachedImage from "../../components/CachedImage";
import { useDojo } from "../../dojo/DojoContext";
import { useGameContext } from "../../providers/GameProvider";
import { useResponsiveValues } from "../../theme/responsiveSettings";

export const TournamentEntries = () => {
  const [entries, setEntries] = useState(0);
  const { t } = useTranslation("home", {
    keyPrefix: "home.tournament-banner",
  });
  const {
    account: { account },
  } = useDojo();
  const { prepareNewGame, executeCreateGame } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    getSeasonProgress({ userAddress: account?.address }).then((data) => {
      setEntries(data.tournamentEntries);
    });
  }, []);

  const handleCreateGame = async () => {
    prepareNewGame();
    executeCreateGame(true);
    navigate("/entering-tournament");
  };

  const { isSmallScreen } = useResponsiveValues();

  return (
    <Flex
      mt={isSmallScreen ? 2 : 6}
      w="100%"
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <CachedImage
        src="/tournament-entry.png"
        h={isSmallScreen ? "60px" : "100px"}
        mr={3}
      />
      <Flex
        flexDir="column"
        justifyContent={"flex-end"}
        textAlign={"center"}
        alignItems={"flex-end"}
        gap={3}
        lineHeight={1}
      >
        {entries === 0 && (
          <>
            <Text fontSize={isSmallScreen ? 13 : 20}>{t("no-entries")}</Text>
            <Text
              mb={2}
              lineHeight={1}
              textAlign={"center"}
              fontSize={isSmallScreen ? 10 : 20}
            >
              {t("unlock")}
            </Text>
          </>
        )}
        {entries === 1 && (
          <Text fontSize={isSmallScreen ? 11 : 20}>{t("entry")}</Text>
        )}
        {entries > 1 && (
          <Text fontSize={isSmallScreen ? 11 : 20}>
            {t("entries", { entries })}
          </Text>
        )}
        {entries > 0 && (
          <Button
            h={isSmallScreen ? 22 : 30}
            fontSize={isSmallScreen ? 12 : 16}
            onClick={handleCreateGame}
          >
            {t("play-tournament")}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
