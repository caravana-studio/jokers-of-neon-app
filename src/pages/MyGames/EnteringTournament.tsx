import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { MobileDecoration } from "../../components/MobileDecoration";
import { useUsername } from "../../dojo/utils/useUsername";
import CreatingGameProgressBar from "./CreatingGameProgressBar";

const stringTournamentId = import.meta.env.VITE_TOURNAMENT_ID;
const tournamentId = stringTournamentId && Number(stringTournamentId);
const TIMEOUT_DURATION = tournamentId ? 30000 : 10000;

export const EnteringTournament = () => {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "my-games",
  });

  const navigate = useNavigate();

  // Auto-navigation logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("default navigation to my-games");
      navigate("/my-games");
    }, TIMEOUT_DURATION);

    return () => {
      clearTimeout(timeout); // Cancel timeout if component unmounts (navigation happened)
    };
  }, [navigate]);

  const username = useUsername();

  const headingStages = tournamentId
    ? [
        {
          text: t("create-game.stage-1", { tournamentId }),
          showAt: 0,
        },
        {
          text: t("create-game.stage-2", { username }),
          showAt: 2000,
        },
        {
          text: t("create-game.stage-3"),
          showAt: 4000,
        },
        {
          text: t("create-game.stage-4"),
          showAt: 8000,
        },
        {
          text: t("create-game.stage-5"),
          showAt: 9500,
        },
      ]
    : [
        {
          text: t("create-game.stage-3"),
          showAt: 0,
        },
        {
          text: t("create-game.stage-4"),
          showAt: 1000,
        },
        {
          text: t("create-game.stage-5"),
          showAt: 1500,
        },
      ];
  return (
    <>
      <MobileDecoration />
      <LanguageSwitcher />
      <AudioPlayer />
      <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
        <Flex
          w={{ base: "90%", sm: "80%", md: "70%" }}
          h="100%"
          justifyContent="center"
          alignItems="center"
          zIndex={2}
        >
          <CreatingGameProgressBar
            headingStages={headingStages}
            duration={tournamentId ? 10000 : 1000}
          />
        </Flex>
      </Flex>
    </>
  );
};
