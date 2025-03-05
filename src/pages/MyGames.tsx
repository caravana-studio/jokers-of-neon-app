import { Box, Button, Checkbox, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer.tsx";
import CachedImage from "../components/CachedImage.tsx";
import LanguageSwitcher from "../components/LanguageSwitcher.tsx";
import { MobileDecoration } from "../components/MobileDecoration.tsx";
import { useUsername } from "../dojo/utils/useUsername.tsx";
import { VIOLET } from "../theme/colors.tsx";
import { useResponsiveValues } from "../theme/responsiveSettings.tsx";

interface GameSummary {
  id: number;
  level?: number;
  status: string;
  points?: number;
}

const games: GameSummary[] = [
  {
    id: 35,
    level: 8,
    status: "FINISHED",
    points: 9503,
  },
  {
    id: 52,
    level: 12,
    status: "IN STORE",
    points: 25652,
  },
  {
    id: 85,
    level: 13,
    status: "IN GAME",
    points: 32053,
  },
  {
    id: 87,
    level: 15,
    status: "FINISHED",
    points: 32053,
  },
  {
    id: 106,
    status: "NOT STARTED",
  },
];

export const MyGames = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const loggedInUser = useUsername();
  const navigate = useNavigate();

  const { isSmallScreen } = useResponsiveValues();

  const [showFinishedGames, setShowFinishedGames] = useState(false);

  const filteredGames = games.filter((game) => {
    return showFinishedGames ? true : game.status !== "FINISHED";
  });

  return (
    <>
      <MobileDecoration />
      <LanguageSwitcher />
      <AudioPlayer />
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Heading mb={8} zIndex={2} variant="italic" size={"lg"}>
          {t("title")}
        </Heading>
        <Box
          border="2px solid #DAA1E8FF"
          boxShadow={`0px 0px 20px 15px ${VIOLET}`}
          filter="blur(0.5px)"
          backgroundColor="rgba(0, 0, 0, 1)"
          borderRadius="20px"
          display="grid"
          px={[4, 8]}
          py={4}
          width={{ base: "90%", sm: "900px" }}
          height=" 50%"
          maxHeight="500px"
          overflowY="auto"
        >
          <Flex
            flexDirection={"column"}
            justifyContent="flex-start"
            alignItems="flex-end"
            w="100%"
            gap={4}
            my={4}
          >
            <Checkbox
              color="white"
              checked={showFinishedGames}
              onChange={(e) => {
                setShowFinishedGames(e.target.checked);
              }}
            >
              {t("show-finished-games").toUpperCase()}
            </Checkbox>
            <Flex flexDirection="column" gap={4} w="100%">
              {filteredGames.map((game) => {
                return <GameBox key={game.id} game={game} />;
              })}
            </Flex>
          </Flex>
        </Box>
        <Flex
          justifyContent="space-between"
          width={{ base: "90%", sm: "600px" }}
          pt={{ base: 10, sm: 14 }}
        >
          <Button
            width="46%"
            onClick={() => {
              navigate("/");
            }}
          >
            {t("go-back")}
          </Button>
          <Button width="46%" variant="secondarySolid">
            {t("start-game")}
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

const GameBox = ({ game }: { game: GameSummary }) => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });
  return (
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
          {game.points && (
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
            <Button size="sm" width="110px" variant="secondarySolid">
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
