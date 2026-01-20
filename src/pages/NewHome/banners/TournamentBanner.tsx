import { Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Clock } from "../../../components/Clock";
import { useDojo } from "../../../dojo/useDojo";
import { useSeasonProgressStore } from "../../../state/useSeasonProgressStore";
import { PodiumBannerCard } from "./PodiumBannerCard";
import { usePodiumLeaders } from "./usePodiumLeaders";

export const TournamentBanner = () => {
  const { t } = useTranslation("home", {
    keyPrefix: "home.tournament-banner",
  });
  const navigate = useNavigate();
  const { leaders, tournament } = usePodiumLeaders();

  const {
    account: { account },
  } = useDojo();

  const entries = useSeasonProgressStore((store) => store.tournamentEntries);
  const lastUserAddress = useSeasonProgressStore(
    (store) => store.lastUserAddress
  );
  const refetchSeasonProgress = useSeasonProgressStore(
    (store) => store.refetch
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
