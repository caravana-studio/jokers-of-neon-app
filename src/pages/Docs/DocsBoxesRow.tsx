import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBox } from "../../components/LootBox";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

const VIEWPORT_ROOT_MARGIN = "200px 0px";

const DocsBoxCard = ({
  boxId,
  shouldMountSpine,
  isVisible,
  isLoaded,
  hasFailed,
  onSelect,
  onVisibilityChange,
  onLoadSuccess,
  onLoadError,
}: {
  boxId: number;
  shouldMountSpine: boolean;
  isVisible: boolean;
  isLoaded: boolean;
  hasFailed: boolean;
  onSelect: (boxId: number) => void;
  onVisibilityChange: (isVisible: boolean) => void;
  onLoadSuccess: () => void;
  onLoadError: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onVisibilityChange(entry.isIntersecting);
      },
      {
        rootMargin: VIEWPORT_ROOT_MARGIN,
        threshold: 0.05,
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onVisibilityChange]);

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
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
          />
        </Box>
      )}
      {isVisible && !isLoaded && !hasFailed && (
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
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const [loadedIndexes, setLoadedIndexes] = useState<number[]>([]);
  const [failedIndexes, setFailedIndexes] = useState<number[]>([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const syncIndexState = (
    index: number,
    updater: React.Dispatch<React.SetStateAction<number[]>>,
    shouldInclude: boolean
  ) => {
    updater((currentIndexes) => {
      const hasIndex = currentIndexes.includes(index);
      if (shouldInclude && !hasIndex) {
        return [...currentIndexes, index].sort((left, right) => left - right);
      }
      if (!shouldInclude && hasIndex) {
        return currentIndexes.filter((currentIndex) => currentIndex !== index);
      }
      return currentIndexes;
    });
  };

  const handleVisibilityChange = (index: number, isVisible: boolean) => {
    syncIndexState(index, setVisibleIndexes, isVisible);

    if (!isVisible) {
      syncIndexState(index, setLoadedIndexes, false);
      syncIndexState(index, setFailedIndexes, false);

      setLoadingIndex((currentLoadingIndex) =>
        currentLoadingIndex === index ? null : currentLoadingIndex
      );
    }
  };

  const handleLoadSuccess = (index: number) => {
    syncIndexState(index, setLoadedIndexes, true);
    syncIndexState(index, setFailedIndexes, false);
    setLoadingIndex((currentLoadingIndex) =>
      currentLoadingIndex === index ? null : currentLoadingIndex
    );
  };

  const handleLoadError = (index: number) => {
    syncIndexState(index, setFailedIndexes, true);
    setLoadingIndex((currentLoadingIndex) =>
      currentLoadingIndex === index ? null : currentLoadingIndex
    );
  };

  useEffect(() => {
    if (loadingIndex !== null) {
      const isLoadingIndexVisible = visibleIndexes.includes(loadingIndex);
      const isLoadingIndexLoaded = loadedIndexes.includes(loadingIndex);
      const isLoadingIndexFailed = failedIndexes.includes(loadingIndex);

      if (!isLoadingIndexVisible || isLoadingIndexLoaded || isLoadingIndexFailed) {
        setLoadingIndex(null);
      }
      return;
    }

    const nextIndexToLoad = visibleIndexes.find(
      (index) =>
        !loadedIndexes.includes(index) && !failedIndexes.includes(index)
    );

    if (nextIndexToLoad !== undefined) {
      setLoadingIndex(nextIndexToLoad);
    }
  }, [failedIndexes, loadedIndexes, loadingIndex, visibleIndexes]);

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
            shouldMountSpine={
              visibleIndexes.includes(index) &&
              (loadedIndexes.includes(index) || loadingIndex === index)
            }
            isVisible={visibleIndexes.includes(index)}
            isLoaded={loadedIndexes.includes(index)}
            hasFailed={failedIndexes.includes(index)}
            onSelect={(selectedBoxId) => {
              highlightCard({
                card_id: selectedBoxId,
                id: "",
                idx: 0,
                img: "",
              });
            }}
            onVisibilityChange={(isVisible) => {
              handleVisibilityChange(index, isVisible);
            }}
            onLoadSuccess={() => {
              handleLoadSuccess(index);
            }}
            onLoadError={() => {
              handleLoadError(index);
            }}
          />
        ))}
      </Flex>
    </DelayedLoading>
  );
};
