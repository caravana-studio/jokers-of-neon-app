import { Flex } from "@chakra-ui/react";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { LOOT_BOXES_DATA } from "../../data/lootBoxes";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useRef } from "react";
import { Card } from "../../types/Card";
import { getCardData } from "../../utils/getCardData";

export const DocsBoxesRow = () => {
  const boxes = LOOT_BOXES_DATA;
  const { highlightCard, highlightedCard } = useCardHighlight();
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  return (
    <>
      {highlightedCard && <MobileCardHighlight card={highlightedCard} isPack />}

      <Flex
        width="100%"
        height="100%"
        flexDirection="row"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        wrap={"wrap"}
        gap={2}
        overflow={"scroll"}
      >
        {Object.keys(boxes).map((boxKey, index) => {
          const cardId = Number(boxKey);
          const box: Card = {
            id: boxKey,
            img: "",
            idx: Number(boxKey),
            card_id: cardId,
          };
          const boxData = getCardData(box, true);

          return (
            <Flex
              key={index}
              justifyContent={"center"}
              alignItems={"center"}
              onClick={() => {
                highlightCard(box);
              }}
            >
              {boxData.animation && (
                <SpineAnimation
                  ref={spineAnimationRef}
                  jsonUrl={boxData.animation.jsonUrl}
                  atlasUrl={boxData.animation.atlasUrl}
                  initialAnimation={animationsData.loopAnimation}
                  loopAnimation={animationsData.loopAnimation}
                  openBoxAnimation={animationsData.openBoxAnimation}
                  width={1200}
                  height={1500}
                  xOffset={-650}
                  scale={1}
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </>
  );
};
