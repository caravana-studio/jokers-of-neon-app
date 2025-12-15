import { Flex } from "@chakra-ui/react";
import { useRef } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBox, LootBoxRef } from "../../components/LootBox";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

export const DocsBoxesRow = () => {
  const boxes = Object.keys(BOXES_RARITY).map(Number);
  const { highlightItem: highlightCard, highlightedItem: highlightedCard } =
    useCardHighlight();
  const lootBoxRef = useRef<LootBoxRef>(null);

  return (
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
  );
};
