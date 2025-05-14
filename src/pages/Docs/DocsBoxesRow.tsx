import { Flex } from "@chakra-ui/react";
import { useRef } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileCardHighlight } from "../../components/MobileCardHighlight";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { useCardHighlight } from "../../providers/CardHighlightProvider";
import { LootBox, LootBoxRef } from "../../components/LootBox";

export const DocsBoxesRow = () => {
  const boxes = Object.keys(BOXES_RARITY).map(Number);
  const { highlightCard, highlightedCard } = useCardHighlight();
  const lootBoxRef = useRef<LootBoxRef>(null);

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
                <LootBox ref={lootBoxRef} boxId={box} />
              </Flex>
            );
          })}
        </Flex>
      </DelayedLoading>
    </>
  );
};
