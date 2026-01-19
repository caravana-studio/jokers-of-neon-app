import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { BackgroundDecoration } from "../../../components/Background";
import { LootBox, LootBoxRef } from "../../../components/LootBox";
import { openPackSfx } from "../../../constants/sfx";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useAudio } from "../../../hooks/useAudio";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { usePageTransitions } from "../../../providers/PageTransitionsProvider";
import { useSettings } from "../../../providers/SettingsProvider";
import { useStore } from "../../../providers/StoreProvider";
import { useGameStore } from "../../../state/useGameStore";

export const OpenLootBox = () => {
  const { state: locationState } = useLocation();
  const { pack } = locationState || {};
  const [openDisabled, setOpenDisabled] = useState(false);
  const [openTextVisible, setOpenTextVisible] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const lootBoxRef = useRef<LootBoxRef>(null);
  const { sfxVolume } = useSettings();
  const { play: openPackSound } = useAudio(openPackSfx, sfxVolume);
  const { state } = useGameStore();
  const { transitionTo } = usePageTransitions();
  const { buyPack } = useStore();
  const navigate = useCustomNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "open-lootbox",
  });

  if (!pack) {
    console.error("no pack!!");
    navigate(GameStateEnum.Store);
    return <p>LootBox not found.</p>;
  }

  const openAnimationCallBack = () => {
    transitionTo("loot-box-cards-selection", {
      state: { pack: pack },
    });
  };

  useEffect(() => {
    setIsBuying(true);
    buyPack(pack)
      .then((response) => {
        if (response) {
        } else {
          navigate(GameStateEnum.Lootbox);
        }
      })
      .catch(() => {
        navigate(GameStateEnum.Store);
      })
      .finally(() => {
        setIsBuying(false);
      });
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
              if (openDisabled || isBuying) return;
              setOpenDisabled(true);
              openPackSound();
              lootBoxRef.current?.openBox();
            }}
          >
            <LootBox
              ref={lootBoxRef}
              boxId={pack.blister_pack_id}
              onOpenAnimationEnd={openAnimationCallBack}
              freezeOnLastFrame
            />
          </Flex>
          <Flex
            opacity={!openDisabled && openTextVisible && !isBuying ? 1 : 0}
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
