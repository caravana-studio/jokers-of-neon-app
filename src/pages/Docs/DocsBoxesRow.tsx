import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBox } from "../../components/LootBox";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

const LOAD_GUARD_TIMEOUT_MS = 4000;

const DocsBoxCard = ({
  boxId,
  shouldMountSpine,
  isLoaded,
  onSelect,
  onLoadResolved,
}: {
  boxId: number;
  shouldMountSpine: boolean;
  isLoaded: boolean;
  onSelect: (boxId: number) => void;
  onLoadResolved: () => void;
}) => {
  useEffect(() => {
    if (!shouldMountSpine || isLoaded) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onLoadResolved();
    }, LOAD_GUARD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoaded, onLoadResolved, shouldMountSpine]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      alignContent={"center"}
      width={["50%", "25%"]}
      height={"30vh"}
      onClick={() => {
        onSelect(boxId);
      }}
      cursor="pointer"
      position="relative"
    >
      {shouldMountSpine && (
        <Box
          width="100%"
          height="100%"
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.2s ease"
        >
          <LootBox
            boxId={boxId}
            onLoadSuccess={onLoadResolved}
            onLoadError={onLoadResolved}
          />
        </Box>
      )}
      {!isLoaded && (
        <Flex
          position="absolute"
          inset={0}
          justifyContent="center"
          alignItems="center"
          pointerEvents="none"
        >
          <Spinner color="white" thickness="3px" speed="0.7s" size="lg" />
        </Flex>
      )}
    </Flex>
  );
};

export const DocsBoxesRow = () => {
  const boxes = Object.keys(BOXES_RARITY).map(Number);
  const { highlightItem: highlightCard } = useCardHighlight();
  const [activeIndex, setActiveIndex] = useState(0);
  const [resolvedIndexes, setResolvedIndexes] = useState<number[]>([]);

  useEffect(() => {
    setActiveIndex(0);
    setResolvedIndexes([]);
  }, []);

  const resolveIndex = (index: number) => {
    setResolvedIndexes((currentResolvedIndexes) => {
      if (currentResolvedIndexes.includes(index)) {
        return currentResolvedIndexes;
      }

      return [...currentResolvedIndexes, index];
    });

    setActiveIndex((currentActiveIndex) =>
      currentActiveIndex === index
        ? Math.min(index + 1, boxes.length - 1)
        : currentActiveIndex
    );
  };

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
        {boxes.map((box, index) => (
          <DocsBoxCard
            key={box}
            boxId={box}
            shouldMountSpine={index <= activeIndex}
            isLoaded={resolvedIndexes.includes(index)}
            onSelect={(selectedBoxId) => {
              highlightCard({
                card_id: selectedBoxId,
                id: "",
                idx: 0,
                img: "",
              });
            }}
            onLoadResolved={() => {
              resolveIndex(index);
            }}
          />
        ))}
      </Flex>
    </DelayedLoading>
  );
};
