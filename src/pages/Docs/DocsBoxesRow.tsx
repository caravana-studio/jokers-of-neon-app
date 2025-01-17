import { Flex } from "@chakra-ui/react";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { LOOT_BOXES_DATA } from "../../data/lootBoxes";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { useRef } from "react";
import { getCardData } from "../../utils/getCardData";
import { getSortedDocCardsData } from "./Utils/DocsUtils";

export const DocsBoxesRow = () => {
  const isPack = true;
  const boxes = getSortedDocCardsData(LOOT_BOXES_DATA, isPack);
  const { highlightCard, highlightedCard } = useCardHighlight();
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  return (
    <>
      {highlightedCard && (
        <MobileCardHighlight card={highlightedCard} isPack showExtraInfo />
      )}

      <Flex
        width="100%"
        height="100%"
        flexDirection="row"
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"flex-start"}
        wrap={"wrap"}
        rowGap={4}
        overflow={"scroll"}
      >
        {boxes.map((box, index) => {
          const boxData = getCardData(box, isPack);

          return (
            <Flex
              key={index}
              justifyContent={"center"}
              alignItems={"center"}
              alignContent={"center"}
              width={["50%", "25%"]}
              height={"30vh"}
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
