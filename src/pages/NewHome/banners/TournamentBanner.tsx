import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getSeasonProgress } from "../../../api/getSeasonProgress";
import { Clock } from "../../../components/Clock";
import { useDojo } from "../../../dojo/useDojo";
import { PodiumBannerCard } from "./PodiumBannerCard";
import { usePodiumLeaders } from "./usePodiumLeaders";

export const TournamentBanner = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.tournament-banner",
  });
  const navigate = useNavigate();
  const { leaders, tournament } = usePodiumLeaders();
  const [entries, setEntries] = useState(0);

  const {
    account: { account },
  } = useDojo();

  useEffect(() => {
    getSeasonProgress({ userAddress: account?.address }).then((data) => {
      setEntries(data.tournamentEntries);
    });
  }, []);

  return (
    <PodiumBannerCard
      leaders={leaders}
      title={t("title")}
      buttonLabel={t("button")}
      onButtonClick={() => navigate("/tournament")}
      headingExtras={
        <Flex flexDir={"column"} gap={3} alignItems={"flex-end"}>
          {tournament?.endDate && <Clock date={tournament.endDate} />}
          {entries === 1 && <Text>{t("entry")}</Text>}
          {entries > 1 && <Text>{t("entries", { entries })}</Text>}
        </Flex>
      }
    />
  );
};
