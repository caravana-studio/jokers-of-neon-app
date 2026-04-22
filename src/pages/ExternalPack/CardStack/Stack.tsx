import { useReducedMotion } from "framer-motion";
import { motion, useMotionValue, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlowBadge } from "../../../components/GlowBadge";
import { cardDragSfx, looseSfx } from "../../../constants/sfx";
import { useAudio } from "../../../hooks/useAudio";
import { useSettings } from "../../../providers/SettingsProvider";
import { VIOLET } from "../../../theme/colors";
import { Intensity } from "../../../types/intensity";
import { isLegacyAndroid } from "../../../utils/capacitorUtils";
import "./Stack.css";

// Types
export type CardData = {
  id: number | string;
  cardId: number;
  skinId?: number;
  img: string;
  intensity?: Intensity;
  [key: string]: any;
};

export type HighlightedCardData = {
  cardId: number;
  skinId: number;
};

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableTilt: boolean;
  disableDrag: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableTilt,
  disableDrag,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(
    _event: any,
    info: { offset: { x: number; y: number } },
  ) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="card-rotate"
      style={{
        x,
        y,
        rotateX: disableTilt ? 0 : rotateX,
        rotateY: disableTilt ? 0 : rotateY,
      }}
      drag={disableDrag ? false : true}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  cardsData: CardData[];
  animationConfig?: { stiffness: number; damping: number };
  sendToBackOnClick?: boolean;
  onCardChange?: (card: HighlightedCardData) => void;
  onAllSeen?: () => void;
  ownedCardIds?: Set<string>;
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData,
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  onCardChange,
  onAllSeen,
  ownedCardIds,
}: StackProps) {
  const [cards, setCards] = useState<CardData[]>(cardsData);
  const [seenCards, setSeenCards] = useState<Set<number | string>>(new Set());
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });
  const { sfxVolume } = useSettings();
  const { play: playCardDrag } = useAudio(cardDragSfx, sfxVolume);
  const { play: playLooseSfx } = useAudio(looseSfx, sfxVolume);
  const [isLegacyAndroidDevice, setIsLegacyAndroidDevice] = useState(false);
  const disableTilt = prefersReducedMotion || isLegacyAndroidDevice;
  const disableDrag = isLegacyAndroidDevice;
  const randomRotationCache = useRef<Map<CardData["id"], number>>(new Map());
  const seenTopCardIds = useRef<Set<CardData["id"]>>(new Set());
  const lastAdvanceAtRef = useRef(0);

  const toHighlightedCardData = (card: CardData): HighlightedCardData => ({
    cardId: card.cardId,
    skinId: card.skinId ?? 0,
  });

  const getGlowClassName = (intensity?: Intensity) => {
    switch (intensity) {
      case Intensity.MAX:
        return "card-top-glow--max";
      case Intensity.HIGH:
        return "card-top-glow--high";
      case Intensity.MEDIUM:
        return "card-top-glow--medium";
      default:
        return "card-top-glow--low";
    }
  };

  useEffect(() => {
    let cancelled = false;
    console.log("calling isLegacyAndroid");
    isLegacyAndroid()
      .then((result) => {
        console.log("isLegacyAndroid result", result);
        if (!cancelled) {
          setIsLegacyAndroidDevice(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLegacyAndroidDevice(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!randomRotation) {
      randomRotationCache.current.clear();
      return;
    }

    cardsData.forEach((card) => {
      if (!randomRotationCache.current.has(card.id)) {
        randomRotationCache.current.set(card.id, Math.random() * 10 - 5);
      }
    });
  }, [cardsData, randomRotation]);

  // Keep local state in sync with incoming cards and notify the consumer of the current top card.
  useEffect(() => {
    setCards(cardsData);
    setSeenCards(new Set());
    seenTopCardIds.current = new Set();

    const topCard = cardsData[cardsData.length - 1];
    if (topCard) {
      seenTopCardIds.current.add(topCard.id);
      if (onCardChange) {
        onCardChange(toHighlightedCardData(topCard));
      }
    }
  }, [cardsData]);

  const sendToBack = (id: CardData["id"]) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      if (index === -1) return prev;
      const now = Date.now();
      if (now - lastAdvanceAtRef.current < 100) {
        return prev;
      }
      lastAdvanceAtRef.current = now;
      const previousTopId = prev[prev.length - 1]?.id;
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      const nextTopCard = newCards[newCards.length - 1];
      const nextTopId = nextTopCard?.id;
      if (nextTopId !== previousTopId) {
        playCardDrag();
        if (nextTopId !== undefined) {
          const hasSeenTopCard = seenTopCardIds.current.has(nextTopId);
          if (
            !hasSeenTopCard &&
            nextTopCard?.intensity !== undefined &&
            nextTopCard.intensity >= Intensity.HIGH
          ) {
            playLooseSfx();
          }
          seenTopCardIds.current.add(nextTopId);
        }
      }
      // The top card is always the last element rendered; notify with its full identity.
      onCardChange?.(toHighlightedCardData(nextTopCard));

      // Track seen cards
      setSeenCards((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);

        // Check if all cards have been seen
        if (newSet.size === cardsData.length && onAllSeen) {
          onAllSeen();
        }

        return newSet;
      });

      return newCards;
    });
  };

  return (
    <div
      className="stack-container"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}
    >
      {cards.map((card: CardData, index: number) => {
        const randomRotate = randomRotation
          ? randomRotationCache.current.get(card.id) ?? 0
          : 0;

        const isTopCard = index === cards.length - 1;
        const ownedKey = `${card.cardId}_${card.skinId ?? 0}`;
        const glowClass = isTopCard
          ? `card-top-glow ${getGlowClassName(card.intensity)}${
              prefersReducedMotion ? " card-top-glow--static" : ""
            }`
          : "";

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableTilt={disableTilt}
            disableDrag={disableDrag}
          >
            <motion.div
              className={`card ${glowClass}`.trim()}
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 1 + randomRotate,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
              /*               style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
              }} */
            >
              <img
                src={card.img}
                alt={`card-${card.id}`}
                className="card-image"
              />
              {isTopCard && ownedCardIds && !ownedCardIds.has(ownedKey) && (
                <GlowBadge
                  label={t("new")}
                  background={VIOLET}
                  glowColor={VIOLET}
                  intensity="medium"
                  reduceMotion={prefersReducedMotion ?? false}
                  style={{ position: "absolute", top: -28, left: 8 }}
                />
              )}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
