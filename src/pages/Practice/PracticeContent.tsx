import { Box } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import CachedImage from "../../components/CachedImage";
import { Loading } from "../../components/Loading";
import { PositionedGameDeck } from "../../components/PositionedGameDeck";
import {
  HAND_SECTION_ID,
  PRESELECTED_CARD_SECTION_ID,
} from "../../constants/general";
import { useCurrentHandStore } from "../../state/useCurrentHandStore";
import { useGameStore } from "../../state/useGameStore";
import { HandSection } from "../Game/HandSection";
import { TopSection } from "../Game/TopSection";
import { PracticePreselectedCardsSection } from "./PracticePreselectedCardsSection";

export const PracticeContent = () => {
  const { isRageRound, gameLoading } = useGameStore();
  const {
    preSelectCard,
    unPreSelectCard,
    preSelectedCards,
    hand,
    addModifier,
  } = useCurrentHandStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const draggedCard = Number(event.active?.id);
    const modifiedCardId = Number(event.over?.id);
    const isModifier = hand.find((c) => c.idx === draggedCard)?.isModifier;

    if (!isNaN(modifiedCardId) && !isNaN(draggedCard) && isModifier) {
      const index = preSelectedCards.indexOf(modifiedCardId);
      if (index !== -1) {
        addModifier(modifiedCardId, draggedCard);
      }
    } else if (
      !isModifier &&
      (event.over?.id === PRESELECTED_CARD_SECTION_ID || !isNaN(modifiedCardId))
    ) {
      preSelectCard(draggedCard);
    } else if (event.over?.id === HAND_SECTION_ID) {
      unPreSelectCard(draggedCard);
    }
  };

  if (gameLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <CachedImage
            src={`/borders/top${isRageRound ? "-rage" : ""}.png`}
            height="8%"
            width="calc(100% - 48px)"
            maxHeight="70px"
            position="fixed"
            top={0}
            zIndex={0}
          />
          <Box sx={{ height: "100%", width: "100%" }} px={"40px"}>
            <Box sx={{ height: "30%", width: "100%" }} pt={"60px"}>
              <TopSection />
            </Box>
            <Box height={"70%"} width={"100%"}>
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <Box
                  sx={{
                    height: "55%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <PracticePreselectedCardsSection />
                </Box>
                <Box
                  pb={"60px"}
                  mr={{ base: 10, md: 20 }}
                  sx={{
                    display: "flex",
                    height: "45%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <HandSection />
                </Box>
              </DndContext>
            </Box>
          </Box>
          <CachedImage
            src={`/borders/bottom${isRageRound ? "-rage" : ""}.png`}
            maxHeight="70px"
            height="8%"
            width="calc(100% - 48px)"
            position="fixed"
            bottom={0}
            sx={{ pointerEvents: "none" }}
          />
        </Box>

        <PositionedGameDeck />
      </Box>
    </Box>
  );
};
