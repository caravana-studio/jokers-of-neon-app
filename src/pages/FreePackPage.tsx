import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { claimFreePack } from "../api/claimFreePack";
import { getUserCards } from "../api/getUserCards";
import { DelayedLoading } from "../components/DelayedLoading";
import { SimulatedLoadingBar } from "../components/LoadingProgressBar/SimulatedLoadingProgressBar";
import { MobileDecoration } from "../components/MobileDecoration";
import { useDojo } from "../dojo/useDojo";
import { LoadingProgress } from "../types/LoadingProgress";
import { ExternalPack, SimplifiedCard } from "./ExternalPack/ExternalPack";

export const FreePackPage = () => {
  const {
    account: { account },
  } = useDojo();

  const { t } = useTranslation("home", {
    keyPrefix: "packs",
  });
  const navigate = useNavigate();

  const [mintedCards, setMintedCards] = useState<SimplifiedCard[]>([]);
  const [ownedCardIds, setOwnedCardIds] = useState<string[]>([]);
  const hasClaimedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!account?.address || hasClaimedRef.current) return;
    hasClaimedRef.current = true;

    // First get owned cards, then claim the free pack
    getUserCards(account.address)
      .then((data) => {
        setOwnedCardIds(data.ownedCardIds ?? []);
        return claimFreePack(account.address);
      })
      .then((mintedCards) => {
        setMintedCards(mintedCards);
      })
      .catch((e) => {
        console.error("Error claiming free pack:", e);
        navigate("/");
      });
  }, [account?.address, navigate]);

  const headingStages: LoadingProgress[] = [
    {
      text: t("open-pack-stages.stage-1"),
      showAt: 0,
    },
    {
      text: t("open-pack-stages.stage-2"),
      showAt: 3000,
    },
    {
      text: t("open-pack-stages.stage-3"),
      showAt: 5000,
    },
  ];

  return mintedCards?.length > 0 ? (
    <ExternalPack initialCards={mintedCards} ownedCardIds={ownedCardIds} />
  ) : (
    <DelayedLoading ms={0}>
      <MobileDecoration />
      <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
        <Flex
          w={{ base: "90%", sm: "80%", md: "70%" }}
          h="100%"
          justifyContent="center"
          alignItems="center"
          zIndex={2}
        >
          <SimulatedLoadingBar headingStages={headingStages} duration={3000} />
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
