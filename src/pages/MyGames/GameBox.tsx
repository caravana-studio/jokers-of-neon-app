import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../components/CachedImage.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useResponsiveValues } from "../../theme/responsiveSettings.tsx";
import { GameSummary } from "./MyGames.tsx";

export const GameBox = ({ game }: { game: GameSummary }) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const { syncCall } = useDojo();

  const { executeCreateGame, setGameId } = useGameContext();

  const { isSmallScreen } = useResponsiveValues();

  const navigate = useNavigate();

  const handleButtonClick = async () => {
    if (game.status === "NOT STARTED") {
      executeCreateGame(game.id);
    } else {
      setGameId(game.id);
      await syncCall();
      navigate(`/redirect/state`);
    }
  };

  return isSmallScreen ? (<Flex
    alignItems="center"
    border="1px solid white"
    borderRadius="15px"
    color="white"
    p={2}
    width="100%"
    height="60px"
    opacity={game.status === "FINISHED" ? 0.6 : 1}
    >
    <Flex
      fontWeight="bold"
      flexDirection="row"
      flex={1}
      justifyContent={"space-between"}
      alignItems="center"
      px={1}
      flexWrap={"wrap"}
    >
      <Flex w="35%" alignItems="center" gap={1.5}>
        <CachedImage src="/logos/jn.png" height="15px" />
        <Text fontFamily="Orbitron" fontSize="13px" fontWeight="bold">
          {" "}
          · {game.id}
        </Text>
      </Flex>
      <Flex w="35%" flexDirection="column" mt={1}>
        <Flex gap={1}>
          <Text color="lightViolet">{game.status}</Text>
        </Flex>
        {game.level && (
          <Flex gap={1}>
            <Text>{t("level-lbl")}:</Text>
            <Text color="lightViolet">{game.level}</Text>
          </Flex>
        )}
        {game.points !== undefined && (
          <Flex gap={1}>
            <Text  color="lightViolet">
              {game.points?.toLocaleString()}
            </Text>
            <Text >points</Text>
          </Flex>
        )}
      </Flex>
      <Flex w="30%" justifyContent="flex-end">
        {game.status !== "FINISHED" && (
          <Button
            size="sm"
            width="60px"
            h="25px"
            variant="secondarySolid"
            onClick={handleButtonClick}
          >
            {t(
              game.status === "NOT STARTED" ? "start-btn" : "continue-btn"
            ).toUpperCase()}
          </Button>
        )}
      </Flex>
    </Flex>
  </Flex>) :
   (
    <Flex
      alignItems="center"
      border="1px solid white"
      borderRadius="15px"
      color="white"
      p={2}
      width="100%"
      height="70px"
      opacity={game.status === "FINISHED" ? 0.6 : 1}
    >
      <Flex
        fontWeight="bold"
        flexDirection="row"
        flex={1}
        justifyContent={"space-between"}
        alignItems="center"
        px={3}
      >
        <Flex w="30%" alignItems="center" gap={1.5}>
          <CachedImage src="/logos/jn.png" height="25px" />
          <Text fontFamily="Orbitron" fontSize="23px" fontWeight="bold">
            {" "}
            · {game.id}
          </Text>
        </Flex>
        <Flex w="30%" flexDirection="column" mt={1}>
          {game.level && (
            <Flex gap={1}>
              <Text>{t("level-lbl")}:</Text>
              <Text color="lightViolet">{game.level}</Text>
            </Flex>
          )}
          <Flex gap={1}>
            <Text>{t("status-lbl")}:</Text>
            <Text color="lightViolet">{game.status}</Text>
          </Flex>
        </Flex>
        <Flex w="20%">
          {game.points !== undefined && (
            <Flex gap={1}>
              <Text fontSize="lg" color="lightViolet">
                {game.points?.toLocaleString()}
              </Text>
              <Text fontSize="lg">points</Text>
            </Flex>
          )}
        </Flex>
        <Flex w="20%" justifyContent="flex-end">
          {game.status !== "FINISHED" && (
            <Button
              size="sm"
              width="110px"
              variant="secondarySolid"
              onClick={handleButtonClick}
            >
              {t(
                game.status === "NOT STARTED" ? "start-btn" : "continue-btn"
              ).toUpperCase()}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
