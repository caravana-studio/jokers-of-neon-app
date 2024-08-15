import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameMenu } from "../../components/GameMenu.tsx";
import { Loading } from "../../components/Loading.tsx";
import { SortBy } from "../../components/SortBy.tsx";
import { TutorialModal } from "../../components/TutorialModal.tsx";
import { SKIP_PWA_INSTALL, SKIP_TUTORIAL } from "../../constants/localStorage.ts";
import { useCurrentSpecialCards } from "../../dojo/queries/useCurrentSpecialCards.tsx";
import { useDojo } from "../../dojo/useDojo.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { useGetGame } from "../../queries/useGetGame.ts";
import { DiscardButton } from "./DiscardButton.tsx";
import { HandSection } from "./HandSection.tsx";
import { PlayButton } from "./PlayButton.tsx";
import { MobilePreselectedCardsSection } from "./PreselectedCardsSection.mobile.tsx";
import { MobileTopSection } from "./TopSection.mobile.tsx";
import InstallPWAIOS from "../../utils/installPWAIOS.tsx";

export const MobileGameContent = () => {
  const {
    preSelectedCards,
    gameLoading,
    loadingStates,
    error,
    clearPreSelection,
    executeCreateGame,
    addModifier,
    roundRewards,
    gameId,
    checkOrCreateGame,
    discardEffectCard,
    discardSpecialCard,
  } = useGameContext();

  const { data: game } = useGetGame(gameId);
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const navigate = useNavigate();
  const [isItemDragged, setIsItemDragged] = useState<boolean>(false);
  const { refetch: refetchSpecialCards } = useCurrentSpecialCards();
  const [showTutorial, setShowTutorial] = useState(
    !window.localStorage.getItem(SKIP_TUTORIAL)
  );
  const [showInstallPWA, setShowInstallPWA] = useState(
    !window.localStorage.getItem(SKIP_PWA_INSTALL)
  );

  useEffect(() => {
    // if roundRewards is true, we don't want to redirect user
    if (!roundRewards) {
      if (game?.state === "FINISHED") {
        navigate("/gameover");
      } else if (game?.state === "AT_SHOP") {
        navigate("/store");
      }
    }
  }, [game?.state, roundRewards]);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsItemDragged(false);
    const modifiedCard = Number(event.over?.id);

    // TODO: Improve this
    let isSpecial = false;
    let draggedCardId;
    const activeId = String(event.active?.id);

    if (activeId.startsWith("s")) {
      draggedCardId = Number(activeId.slice(1));
      isSpecial = true;
    } else {
      draggedCardId = Number(activeId);
    }

    if (!isNaN(modifiedCard) && !isNaN(draggedCardId)) {
      const index = preSelectedCards.indexOf(modifiedCard);
      if (index !== -1) {
        addModifier(modifiedCard, draggedCardId);
      }
    }
    if (isSpecial && event.over?.id === "play-discard") {
      discardSpecialCard(draggedCardId).then((response) => {
        if (response) {
          refetchSpecialCards();
        }
      });
    } else if (event.over?.id === "play-discard") {
      discardEffectCard(draggedCardId);
    }
  };

  useEffect(() => {
    checkOrCreateGame();
  }, []);

  if (error) {
    return (
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={8}
        sx={{ height: "100%" }}
      >
        <Heading size="xl" variant="neonGreen">
          error creating game
        </Heading>
        <Button
          variant="outline"
          sx={{ width: 300 }}
          onClick={(e) => {
            e.stopPropagation();
            executeCreateGame();
          }}
        >
          CREATE NEW GAME
        </Button>
      </Flex>
    );
  }

  if (gameLoading || loadingStates) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      {showTutorial && (
        <TutorialModal
          onClose={() => {
            setShowTutorial(false);
          }}
        />
      )}

      {showInstallPWA && (
        <InstallPWAIOS
          onClose={() => {
            setShowInstallPWA(false);
          }}
        />
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: "5px",
          right: "5px",
          zIndex: 1000,
          transform: "scale(0.7)",
        }}
      >
        <GameMenu onTutorialButtonClick={()=>{setShowTutorial(true)}} onInstallPWAButtonClick={()=>{setShowInstallPWA(true)}}/>
      </Box>
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={() => {
            setIsItemDragged(true);
          }}
          autoScroll={false}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ height: "205px", width: "100%" }}>
              <MobileTopSection />
            </Box>
            <Box
              sx={{
                width: "90%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            >
              <MobilePreselectedCardsSection />
            </Box>
            <Flex width="90%" mt={2} mx={4} justifyContent={"space-between"}>
              <DiscardButton itemDragged={isItemDragged} />
              <PlayButton />
            </Flex>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Box>
                <Box position={"absolute"} bottom={0} zIndex={6} width="115px">
                  <SortBy />
                </Box>
                <Box pb="30px" mx={6} mr={14}>
                  <HandSection />
                </Box>
              </Box>
            </Box>
          </Box>
        </DndContext>
      </Box>
    </Box>
  );
};
