import { Flex } from "@chakra-ui/react";
import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { BackgroundDecoration } from "../../../components/Background";
import { LootBox, LootBoxRef } from "../../../components/LootBox";
import { openPackSfx } from "../../../constants/sfx";
import { GameStateEnum } from "../../../dojo/typescript/custom";
import { useAudio } from "../../../hooks/useAudio";
import { useCustomNavigate } from "../../../hooks/useCustomNavigate";
import { triggerHaptic } from "../../../haptics";
import { usePageTransitions } from "../../../providers/PageTransitionsProvider";
import { useSettings } from "../../../providers/SettingsProvider";
import { useStore } from "../../../providers/StoreProvider";

export const OpenLootBox = () => {
  const { state: locationState } = useLocation();
  const { pack } = locationState || {};
  const [openDisabled, setOpenDisabled] = useState(false);
  const [openTextVisible, setOpenTextVisible] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const lootBoxRef = useRef<LootBoxRef>(null);
  const pointerDragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
  });
  const didStartPurchaseRef = useRef(false);
  const { sfxVolume } = useSettings();
  const { play: openPackSound } = useAudio(openPackSfx, sfxVolume);
  const { transitionTo } = usePageTransitions();
  const { buyPack } = useStore();
  const navigate = useCustomNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "open-lootbox",
  });

  const openAnimationCallBack = () => {
    if (!pack) {
      return;
    }

    transitionTo("loot-box-cards-selection", {
      state: { pack: pack },
    });
  };

  useEffect(() => {
    if (!pack) {
      console.error("no pack!!");
      navigate(GameStateEnum.Store);
      return;
    }
  }, [pack, navigate]);

  useEffect(() => {
    if (!pack || didStartPurchaseRef.current) {
      return;
    }
    didStartPurchaseRef.current = true;

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
  }, [pack]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenTextVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!pack) {
    return <p>LootBox not found.</p>;
  }

  const clearPointerDrag = () => {
    pointerDragRef.current.active = false;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerDragRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerDragRef.current.active || openDisabled || isBuying) {
      return;
    }

    const deltaX = event.clientX - pointerDragRef.current.lastX;
    const deltaY = event.clientY - pointerDragRef.current.lastY;
    const movedEnough = Math.hypot(deltaX, deltaY) >= 12;

    if (!movedEnough) {
      return;
    }

    pointerDragRef.current.lastX = event.clientX;
    pointerDragRef.current.lastY = event.clientY;
    triggerHaptic("open-pack-drag-step");
  };

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
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={clearPointerDrag}
            onPointerCancel={clearPointerDrag}
            onPointerLeave={clearPointerDrag}
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
              onOpenAnimationStart={() => {
                triggerHaptic("open-pack-opened");
              }}
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
