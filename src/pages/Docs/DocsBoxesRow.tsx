import { Flex, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBox } from "../../components/LootBox";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { isNativeAndroid } from "../../utils/capacitorUtils";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

const ANDROID_SPINE_STAGGER_MS = 120;

const DocsBoxCard = ({
  boxId,
  index,
  onSelect,
}: {
  boxId: number;
  index: number;
  onSelect: (boxId: number) => void;
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(!isNativeAndroid);
  const [shouldRenderSpine, setShouldRenderSpine] = useState(!isNativeAndroid);
  const fallbackImageUrl = `/spine-animations/loot_box_${boxId}.png`;

  useEffect(() => {
    if (!isNativeAndroid || !cardRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.05,
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isNativeAndroid) {
      return;
    }

    if (!isNearViewport) {
      setShouldRenderSpine(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldRenderSpine(true);
    }, index * ANDROID_SPINE_STAGGER_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [index, isNearViewport]);

  return (
    <Flex
      ref={cardRef}
      justifyContent={"center"}
      alignItems={"center"}
      alignContent={"center"}
      width={["50%", "25%"]}
      height={"30vh"}
      onClick={() => {
        onSelect(boxId);
      }}
      cursor="pointer"
    >
      {shouldRenderSpine ? (
        <LootBox boxId={boxId} fallbackImageUrl={fallbackImageUrl} />
      ) : (
        <Image
          src={fallbackImageUrl}
          alt={`Loot box ${boxId}`}
          width={"100%"}
          height={"100%"}
          objectFit={"contain"}
          loading="lazy"
          pointerEvents="none"
        />
      )}
    </Flex>
  );
};

export const DocsBoxesRow = () => {
  const boxes = Object.keys(BOXES_RARITY).map(Number);
  const { highlightItem: highlightCard } = useCardHighlight();

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
            index={index}
            onSelect={(selectedBoxId) => {
              highlightCard({
                card_id: selectedBoxId,
                id: "",
                idx: 0,
                img: "",
              });
            }}
          />
        ))}
      </Flex>
    </DelayedLoading>
  );
};
