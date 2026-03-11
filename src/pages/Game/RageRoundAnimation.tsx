import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animated, useSpring } from "@react-spring/web";
import { useTranslation } from "react-i18next";
import { CardImage3D } from "../../components/CardImage3D";
import CachedImage from "../../components/CachedImage";
import { AUTO_SKIP_RAGE_ROUND_SCREEN } from "../../constants/localStorage";
import { CARD_HEIGHT, CARD_WIDTH } from "../../constants/visualProps";
import { useCardData } from "../../providers/CardDataProvider";
import { useAnimationStore } from "../../state/useAnimationStore";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { Card } from "../../types/Card";
import { useGameStore } from "../../state/useGameStore";

const AUTO_SKIP_DELAY_MS = 2000;
const EXIT_ANIMATION_MS = 400;
const TITLE_DELAY_MS = 0;
const CARDS_DELAY_MS = 260;
const DESCRIPTION_DELAY_MS = 520;
const FOOTER_DELAY_MS = 780;
const CARD_ASPECT_RATIO = CARD_WIDTH / CARD_HEIGHT;

export const RageRoundAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 390
  );
  const { t } = useTranslation("game");
  const { isSmallScreen } = useResponsiveValues();

  const { showRages, showSpecials } = useGameStore();

  const { destroyedSpecialCardId, setDestroyedSpecialCardId } =
    useAnimationStore();

  const { isRageRound, rageCards } = useGameStore();
  const descriptionsContainerRef = useRef<HTMLDivElement | null>(null);
  const descriptionItemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { getCardData } = useCardData();

  const rageCardsInfo = useMemo(
    () =>
      rageCards
        .map((card, index) => {
          const cardId = card.card_id;
          if (!cardId) {
            return undefined;
          }
          const cardData = getCardData(cardId);
          return {
            key: `${cardId}-${index}`,
            cardId,
            name: cardData.name,
            description: cardData.description,
            card,
          };
        })
        .filter(
          (
            card
          ): card is {
            key: string;
            cardId: number;
            name: string;
            description: string;
            card: Card;
          } => card !== undefined
        ),
    [getCardData, rageCards]
  );

  const rageCardsLayout = useMemo(() => {
    const cardsCount = Math.max(rageCardsInfo.length, 1);
    const rowMaxWidthPx = isSmallScreen
      ? Math.max(viewportWidth - 32, 260)
      : Math.max(Math.min(viewportWidth * 0.8, 980), 640);
    const cardHeightPx = isSmallScreen ? 138 : 218;
    const estimatedCardWidthPx = Math.round(cardHeightPx * CARD_ASPECT_RATIO);
    const baseGapPx = isSmallScreen ? 10 : 14;
    const rawRowWidthPx =
      cardsCount * estimatedCardWidthPx + (cardsCount - 1) * baseGapPx;
    const overflowPx = Math.max(rawRowWidthPx - rowMaxWidthPx, 0);
    const overlapPx =
      cardsCount > 1
        ? Math.min(
            estimatedCardWidthPx * 0.88,
            overflowPx / (cardsCount - 1)
          )
        : 0;

    return {
      cardHeightPx,
      cardWidthPx: estimatedCardWidthPx,
      overlapPx,
      stepPx: baseGapPx - overlapPx,
    };
  }, [isSmallScreen, rageCardsInfo.length, viewportWidth]);

  const activeHoveredCardKey = useMemo(() => {
    if (!hoveredCardKey) {
      return null;
    }

    return rageCardsInfo.some((card) => card.key === hoveredCardKey)
      ? hoveredCardKey
      : null;
  }, [hoveredCardKey, rageCardsInfo]);

  const titleSpring = useSpring({
    x: showTitle ? (isClosing ? 240 : 0) : -240,
    opacity: showTitle ? (isClosing ? 0 : 1) : 0,
    config: { tension: 240, friction: 22 },
  });

  const cardsSpring = useSpring({
    x: showCards ? (isClosing ? 240 : 0) : -240,
    opacity: showCards ? (isClosing ? 0 : 1) : 0,
    config: { tension: 240, friction: 22 },
  });

  const descriptionsSpring = useSpring({
    x: showDescriptions ? (isClosing ? 240 : 0) : -240,
    opacity: showDescriptions ? (isClosing ? 0 : 1) : 0,
    config: { tension: 240, friction: 22 },
  });

  const footerSpring = useSpring({
    x: showFooter ? (isClosing ? 240 : 0) : -240,
    opacity: showFooter ? (isClosing ? 0 : 1) : 0,
    config: { tension: 240, friction: 22 },
  });

  const resetSequence = useCallback(() => {
    setShowTitle(false);
    setShowCards(false);
    setShowDescriptions(false);
    setShowFooter(false);
    setHoveredCardKey(null);
  }, []);

  const closeAnimation = useCallback(() => {
    if (!isVisible || isClosing) {
      return;
    }

    setIsClosing(true);
    window.setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      resetSequence();
      showSpecials();
      setDestroyedSpecialCardId(undefined);
    }, EXIT_ANIMATION_MS);
  }, [isClosing, isVisible, resetSequence, setDestroyedSpecialCardId, showSpecials]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const shouldAutoSkip =
          window.localStorage.getItem(AUTO_SKIP_RAGE_ROUND_SCREEN) === "true";
        setAutoSkip(shouldAutoSkip);
      }
    } catch (error) {
      console.warn(
        "[RageRoundAnimation] Failed to load auto-skip preference",
        error
      );
    }
  }, []);

  useEffect(() => {
    if (isRageRound) {
      showRages();
      setIsVisible(true);
      setIsClosing(false);
      return;
    }

    setIsVisible(false);
    setIsClosing(false);
    resetSequence();
    showSpecials();
  }, [isRageRound, resetSequence, showRages, showSpecials]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    resetSequence();
    const titleTimer = window.setTimeout(() => {
      setShowTitle(true);
    }, TITLE_DELAY_MS);
    const cardsTimer = window.setTimeout(() => {
      setShowCards(true);
    }, CARDS_DELAY_MS);
    const descriptionsTimer = window.setTimeout(() => {
      setShowDescriptions(true);
    }, DESCRIPTION_DELAY_MS);
    const footerTimer = window.setTimeout(() => {
      setShowFooter(true);
    }, FOOTER_DELAY_MS);

    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(cardsTimer);
      window.clearTimeout(descriptionsTimer);
      window.clearTimeout(footerTimer);
    };
  }, [isVisible, resetSequence]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const scrollDescriptionIntoView = useCallback((cardKey: string) => {
    const tryScroll = () => {
      const container = descriptionsContainerRef.current;
      const target = descriptionItemRefs.current[cardKey];
      if (!container || !target) {
        return false;
      }

      const margin = 10;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      let nextScrollTop = container.scrollTop;

      const isAbove = targetRect.top < containerRect.top + margin;
      const isBelow = targetRect.bottom > containerRect.bottom - margin;

      if (isAbove) {
        const deltaUp = targetRect.top - containerRect.top - margin;
        nextScrollTop = Math.max(0, container.scrollTop + deltaUp);
      } else if (isBelow) {
        const deltaDown = targetRect.bottom - containerRect.bottom + margin;
        nextScrollTop = Math.min(maxScrollTop, container.scrollTop + deltaDown);
      } else {
        return true;
      }

      container.scrollTo({
        top: nextScrollTop,
        behavior: "smooth",
      });
      return true;
    };

    if (!tryScroll()) {
      requestAnimationFrame(() => {
        tryScroll();
      });
    }
  }, []);

  useEffect(() => {
    if (!isVisible || isClosing || !autoSkip) {
      return;
    }

    const timer = window.setTimeout(() => {
      closeAnimation();
    }, AUTO_SKIP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [autoSkip, closeAnimation, isClosing, isVisible]);

  const handleAutoSkipChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const checked = event.target.checked;
    setAutoSkip(checked);
    try {
      window.localStorage.setItem(AUTO_SKIP_RAGE_ROUND_SCREEN, `${checked}`);
    } catch (error) {
      console.warn(
        "[RageRoundAnimation] Failed to save auto-skip preference",
        error
      );
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Flex
      onClick={closeAnimation}
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={1000}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      backdropFilter="blur(5px)"
      backgroundColor="rgba(0, 0, 0, 0.82)"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
      overflow="hidden"
    >
      <Flex
        width="100%"
        maxW="980px"
        flexDirection="column"
        alignItems="center"
        gap={{ base: 4, md: 5 }}
      >
        <animated.div style={{ ...titleSpring, width: "100%" }}>
          <Heading
            fontSize={{ base: "2rem", sm: "2.8rem", md: "3.4rem" }}
            textAlign="center"
          >
            {t("rage-round-animation.title")}
          </Heading>
        </animated.div>

        <animated.div style={{ ...cardsSpring, width: "100%" }}>
          {rageCardsInfo.length > 0 && (
            <Flex
              width="100%"
              maxW={{ base: "100%", md: "80%" }}
              mx="auto"
              justifyContent="center"
              alignItems="flex-end"
              wrap="nowrap"
              overflow="visible"
              pt={rageCardsLayout.overlapPx > 0 ? 3 : 0}
              onMouseLeave={() => setHoveredCardKey(null)}
            >
              {rageCardsInfo.map((card, index) => {
                const cardIsHovered = activeHoveredCardKey === card.key;
                const dimmed = !!activeHoveredCardKey && !cardIsHovered;
                const defaultShadow = isSmallScreen
                  ? "0px 0px 8px 1px rgba(255, 0, 0, 0.28)"
                  : "0px 0px 14px 2px rgba(255, 0, 0, 0.38)";
                const hoverShadow = isSmallScreen
                  ? "0px 0px 14px 3px rgba(255, 0, 0, 0.52)"
                  : "0px 0px 28px 8px rgba(255, 0, 0, 0.85)";

                return (
                  <Flex
                    key={card.key}
                    flexDirection="column"
                    alignItems="center"
                    ml={index === 0 ? 0 : `${rageCardsLayout.stepPx}px`}
                    opacity={dimmed ? 0.35 : 1}
                    transition="all 0.18s ease"
                    zIndex={cardIsHovered ? 100 : index + 1}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (isSmallScreen) {
                        setHoveredCardKey((current) => {
                          const next = current === card.key ? null : card.key;
                          if (next) {
                            scrollDescriptionIntoView(next);
                          }
                          return next;
                        });
                      }
                    }}
                    onMouseEnter={() => {
                      if (!isSmallScreen) {
                        setHoveredCardKey(card.key);
                        scrollDescriptionIntoView(card.key);
                      }
                    }}
                    onMouseLeave={() => !isSmallScreen && setHoveredCardKey(null)}
                  >
                    <Box
                      borderRadius="10px"
                      overflow="visible"
                      display="inline-flex"
                      boxShadow={
                        dimmed ? "none" : cardIsHovered ? hoverShadow : defaultShadow
                      }
                      transition="box-shadow 0.2s ease, opacity 0.2s ease"
                    >
                      <CardImage3D
                        card={card.card}
                        hideTooltip
                        small
                        height={`${rageCardsLayout.cardHeightPx}px`}
                        width={`${rageCardsLayout.cardWidthPx}px`}
                      />
                    </Box>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </animated.div>

        <animated.div style={{ ...descriptionsSpring, width: "100%" }}>
          <Flex
            ref={descriptionsContainerRef}
            width="100%"
            maxW="860px"
            mx="auto"
            flexDirection="column"
            gap={3}
            mb={destroyedSpecialCardId ? 0 : 2}
            maxH={{ base: "32vh", md: "40vh" }}
            overflowY="scroll"
            px={2}
            py={2}
            minH={0}
            alignSelf="center"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
            onMouseLeave={() => setHoveredCardKey(null)}
            sx={{
              touchAction: "auto",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              scrollPaddingBlock: "10px",
            }}
          >
            {rageCardsInfo.length > 0 ? (
              rageCardsInfo.map((card) => {
                const cardIsHovered = activeHoveredCardKey === card.key;
                const dimmed = !!activeHoveredCardKey && !cardIsHovered;

                return (
                  <Box
                    key={`${card.key}-description`}
                    ref={(node) => {
                      descriptionItemRefs.current[card.key] = node;
                    }}
                    border={
                      cardIsHovered
                        ? "1px solid rgba(255, 95, 95, 0.95)"
                        : "1px solid rgba(255, 255, 255, 0.18)"
                    }
                    borderRadius="12px"
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2, md: 3 }}
                    backgroundColor="rgba(20, 20, 20, 0.6)"
                    opacity={dimmed ? 0.35 : 1}
                    boxShadow={
                      cardIsHovered
                        ? "0px 0px 18px 2px rgba(255, 78, 78, 0.7)"
                        : "none"
                    }
                    transition="all 0.2s ease"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (isSmallScreen) {
                        setHoveredCardKey((current) =>
                          current === card.key ? null : card.key
                        );
                      }
                    }}
                    onMouseEnter={() =>
                      !isSmallScreen && setHoveredCardKey(card.key)
                    }
                    onMouseLeave={() => !isSmallScreen && setHoveredCardKey(null)}
                  >
                    <Text fontWeight="700" mb={1}>
                      {card.name}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {card.description}
                    </Text>
                  </Box>
                );
              })
            ) : (
              <Text textAlign="center">{t("rage-cards.no-cards")}</Text>
            )}
          </Flex>
        </animated.div>

        {destroyedSpecialCardId && (
          <animated.div style={{ ...descriptionsSpring, width: "100%" }}>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap={3}
            >
              <Heading size="md" variant="italic" textAlign="center">
                {t("rage-round-animation.sacrificed-card")}
              </Heading>
              <Box boxShadow="0px 0px 20px 7px red" borderRadius="20px">
                <CachedImage
                  src={`/Cards/${destroyedSpecialCardId}.png`}
                  alt={t("rage-round-animation.sacrificed-card")}
                  maxH={{ base: "120px", md: "180px" }}
                />
              </Box>
            </Flex>
          </animated.div>
        )}

        <animated.div style={{ ...footerSpring, width: "100%" }}>
          <Text
            textAlign="center"
            fontSize={{ base: "sm", md: "md" }}
            textTransform="uppercase"
            letterSpacing="0.07em"
            opacity={0.85}
          >
            {t("rage-round-animation.click-anywhere")}
          </Text>
        </animated.div>
      </Flex>

      <animated.div
        style={{
          ...footerSpring,
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <Checkbox
          size="lg"
          isChecked={autoSkip}
          onClick={(e) => e.stopPropagation()}
          onChange={handleAutoSkipChange}
        >
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="600">
            {t("rage-round-animation.auto-skip")}
          </Text>
        </Checkbox>
      </animated.div>
    </Flex>
  );
};
