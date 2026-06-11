import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { LootBox } from "../../components/LootBox";
import { BOXES_RARITY } from "../../data/lootBoxes";
import { useCardHighlight } from "../../providers/HighlightProvider/CardHighlightProvider";

const LOAD_GUARD_TIMEOUT_MS = 4000;
const VIEWPORT_ROOT_MARGIN = "200px 0px";

const DocsBoxCard = ({
  boxId,
  shouldMountSpine,
  isVisible,
  isLoaded,
  onSelect,
  onVisibilityChange,
  onLoadSuccess,
  onLoadTimeout,
  onLoadError,
}: {
  boxId: number;
  shouldMountSpine: boolean;
  isVisible: boolean;
  isLoaded: boolean;
  onSelect: (boxId: number) => void;
  onVisibilityChange: (isVisible: boolean) => void;
  onLoadSuccess: () => void;
  onLoadTimeout: () => void;
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

  useEffect(() => {
    if (!shouldMountSpine || isLoaded || !isVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onLoadTimeout();
    }, LOAD_GUARD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLoaded, isVisible, onLoadTimeout, shouldMountSpine]);

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
      {isVisible && !isLoaded && (
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
  const [blockedIndexes, setBlockedIndexes] = useState<number[]>([]);
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
      syncIndexState(index, setBlockedIndexes, false);

      setLoadingIndex((currentLoadingIndex) =>
        currentLoadingIndex === index ? null : currentLoadingIndex
      );
    }
  };

  const handleLoadSuccess = (index: number) => {
    syncIndexState(index, setLoadedIndexes, true);
    syncIndexState(index, setBlockedIndexes, false);
    setLoadingIndex((currentLoadingIndex) =>
      currentLoadingIndex === index ? null : currentLoadingIndex
    );
  };

  const handleLoadBlocked = (index: number) => {
    syncIndexState(index, setBlockedIndexes, true);
    setLoadingIndex((currentLoadingIndex) =>
      currentLoadingIndex === index ? null : currentLoadingIndex
    );
  };

  useEffect(() => {
    if (loadingIndex !== null) {
      const isLoadingIndexVisible = visibleIndexes.includes(loadingIndex);
      const isLoadingIndexLoaded = loadedIndexes.includes(loadingIndex);

      if (!isLoadingIndexVisible || isLoadingIndexLoaded) {
        setLoadingIndex(null);
      }
      return;
    }

    const nextIndexToLoad = visibleIndexes.find(
      (index) =>
        !loadedIndexes.includes(index) && !blockedIndexes.includes(index)
    );

    if (nextIndexToLoad !== undefined) {
      setLoadingIndex(nextIndexToLoad);
    }
  }, [blockedIndexes, loadedIndexes, loadingIndex, visibleIndexes]);

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
            onLoadTimeout={() => {
              handleLoadBlocked(index);
            }}
            onLoadError={() => {
              handleLoadBlocked(index);
            }}
          />
        ))}
      </Flex>
    </DelayedLoading>
  );
};
