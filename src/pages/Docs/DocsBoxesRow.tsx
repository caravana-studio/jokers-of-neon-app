import { Flex } from "@chakra-ui/react";
import { useRef } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import SpineAnimation, {
  SpineAnimationRef,
} from "../../components/SpineAnimation";
import { animationsData } from "../../constants/spineAnimations";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { useCardData } from "../../providers/CardDataProvider";
import { useCardHighlight } from "../../providers/CardHighlightProvider";

export const DocsBoxesRow = () => {
  const boxes = Object.keys(BOXES_RARITY).map(Number);
  const { highlightCard, highlightedCard } = useCardHighlight();
  const spineAnimationRef = useRef<SpineAnimationRef>(null);

  const { getLootBoxData } = useCardData();

  return (
    <>
      {highlightedCard && (
        <MobileCardHighlight card={highlightedCard} isPack showExtraInfo />
      )}

      <DelayedLoading>
        <Flex
          width="100%"
          height="100%"
          flexDirection="row"
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"flex-start"}
          wrap={"wrap"}
          rowGap={4}
          overflow={"auto"}
        >
          {boxes.map((box, index) => {
            const boxData = getLootBoxData(box);

            return (
              <Flex
                key={index}
                justifyContent={"center"}
                alignItems={"center"}
                alignContent={"center"}
                width={["50%", "25%"]}
                height={"30vh"}
                onClick={() => {
                  highlightCard({ card_id: box, id: "", idx: 0, img: "" });
                }}
                cursor="pointer"
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
      </DelayedLoading>
    </>
  );
};
