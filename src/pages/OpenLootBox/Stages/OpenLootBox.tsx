import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { BackgroundDecoration } from "../../../components/Background";
import { Flex } from "@chakra-ui/react";
import { LootBox, LootBoxRef } from "../../../components/LootBox";
import { usePageTransitions } from "../../../providers/PageTransitionsProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useRedirectByGameState } from "../../../hooks/useRedirectByGameState";
import { isMobile } from "react-device-detect";
import { useGame } from "../../../dojo/queries/useGame";

export const OpenLootBox = () => {
  const { state } = useLocation();
  const { pack } = state || {};
  const [openDisabled, setOpenDisabled] = useState(false);
  const [openTextVisible, setOpenTextVisible] = useState(false);
  const lootBoxRef = useRef<LootBoxRef>(null);
  const game = useGame();
  const { transitionTo } = usePageTransitions();
  const { buyPack } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "open-lootbox",
  });
  useRedirectByGameState();

  if (!pack) {
    return <p>LootBox not found.</p>;
  }

  const openAnimationCallBack = () => {
    setTimeout(() => {
      transitionTo("/loot-box-cards-selection", {
        state: { pack: pack },
      });
    }, 150);
  };

  useEffect(() => {
    if (game && game?.state !== "OPEN_BLISTER_PACK") {
      buyPack(pack)
        .then((response) => {
          if (response) {
            // setLockRedirection(true);
            navigate("/open-loot-box", {
              state: { pack: pack },
            });
          } else {
            navigate(-1);
          }
        })
        .catch(() => {
          navigate(-1);
        });
    }

    return () => {};
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenTextVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex
      flexDirection={"column"}
      width={"100%"}
      height={"100%"}
      backgroundColor={"rgba(0,0,0,0.6)"}
    >
      <BackgroundDecoration contentHeight={"80%"}>
        <Flex
          flexDirection={"column"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
          p={4}
          height={"100%"}
          width={"100%"}
        >
          <Flex
            height={"90%"}
            width={"100%"}
            onClick={() => {
              if (openDisabled) return;
              setOpenDisabled(true);
              lootBoxRef.current?.openBox();
            }}
          >
            <LootBox
              ref={lootBoxRef}
              boxId={pack.blister_pack_id}
              onOpenAnimationStart={openAnimationCallBack}
            />
          </Flex>
          <Flex
            opacity={!openDisabled && openTextVisible ? 1 : 0}
            color={"white"}
            transition={"all ease 0.5s"}
          >
            {isMobile ? t("tap-open") : t("click-open")}
          </Flex>
        </Flex>
      </BackgroundDecoration>
    </Flex>
  );
};
