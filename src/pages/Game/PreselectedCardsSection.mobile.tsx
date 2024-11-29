import { Box } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { AnimatedCard } from "../../components/AnimatedCard.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { ModifiableCard } from "../../components/ModifiableCard.tsx";
import { TiltCard } from "../../components/TiltCard.tsx";
import { PRESELECTED_CARD_SECTION_ID } from "../../constants/general.ts";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps.ts";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { Card } from "../../types/Card.ts";

export const MobilePreselectedCardsSection = () => {
  const {
    preSelectedCards,
    hand,
    getModifiers,
    togglePreselected,
    discardAnimation,
    playAnimation,
  } = useGameContext();

  const { setNodeRef } = useDroppable({
    id: PRESELECTED_CARD_SECTION_ID,
  });

  const [boxWidth, setBoxWidth] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (boxRef.current) {
        setBoxWidth(boxRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardWidth = (boxWidth - 100) / 5;
  const cardScale = cardWidth / CARD_WIDTH;
  const cardHeight = cardScale * CARD_HEIGHT;

  return (
    <>
      <Box
        gap={1}
        py={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: `${cardHeight + 70}px`,
          width: "100%",
        }}
        mb={1}
        ref={setNodeRef}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "no-wrap",
            width: "95%",
            height: '100%',
          }}
          background={"url(grid.png)"}
          backgroundSize={"contain"}
          ref={boxRef}
        >
          {preSelectedCards.map((idx) => {
            const card = hand.find((c) => c.idx === idx);
            const modifiers = getModifiers(idx);
            const modifiedCard: Card = { ...card!, modifiers };
            return (
              card && (
                <Box key={card.id} mx={3} width={`${cardWidth}px`}>
                  <ModifiableCard id={card.id}>
                    <AnimatedCard
                      idx={card.idx}
                      discarded={discardAnimation}
                      played={playAnimation}
                      scale={cardScale}
                    >
                      <TiltCard
                        cursor="pointer"
                        scale={cardScale}
                        card={modifiedCard}
                        onClick={() => {
                          togglePreselected(idx);
                        }}
                      />
                    </AnimatedCard>
                  </ModifiableCard>
                </Box>
              )
            );
          })}
        </Box>
        <CurrentPlay />
      </Box>
    </>
  );
};
