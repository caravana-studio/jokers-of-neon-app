import { useReducedMotion } from "framer-motion";
import { motion, useMotionValue, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { isLegacyAndroid } from "../../../utils/capacitorUtils";
import "./Stack.css";
import { VIOLET, VIOLET_RGBA } from "../../../theme/colors";

// Types
export type CardData = {
  id: number | string;
  cardId: number;
  skinId?: number;
  img: string;
  [key: string]: any;
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
    info: { offset: { x: number; y: number } }
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

type NewBadgeProps = {
  reduceMotion?: boolean;
};

function NewBadge({ reduceMotion = false }: NewBadgeProps) {
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "external-pack",
  });
  const label = t("new");
  const baseShadow = `0 0px 10px 7px ${VIOLET_RGBA(1)}`;
  const pulseShadow = `0 0px 5px 2px ${VIOLET_RGBA(0.4)}`;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: -28,
        left: 8,
        padding: "4px 12px",
        background: VIOLET,
        color: "#ffffff",
        fontSize: 12,
        letterSpacing: 0.6,
        fontWeight: 700,
        textTransform: "capitalize",
        borderRadius: 999,
        boxShadow: baseShadow,
        pointerEvents: "none",
        fontFamily: "'Sonara', sans-serif",
        lineHeight: 1.2,
      }}
      animate={
        reduceMotion
          ? undefined
          : {
              boxShadow: [baseShadow, pulseShadow, baseShadow],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      {label}
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
  onCardChange?: (cardId: number) => void;
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
  const [isLegacyAndroidDevice, setIsLegacyAndroidDevice] = useState(false);
  const disableTilt = prefersReducedMotion || isLegacyAndroidDevice;
  const disableDrag = isLegacyAndroidDevice;
  const randomRotationCache = useRef<Map<CardData["id"], number>>(new Map());

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

    const topCardId = cardsData[cardsData.length - 1]?.cardId;
    if (topCardId !== undefined && onCardChange) {
      onCardChange(topCardId);
    }
    // Depend only on cardsData so navigation interactions (click/drag) are not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsData]);

  const sendToBack = (id: CardData["id"]) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      if (index === -1) return prev;
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      // The top card is always the last element rendered; notify with that card's id.
      onCardChange?.(newCards[newCards.length - 1].cardId);

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

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableTilt={disableTilt}
            disableDrag={disableDrag}
          >
            <motion.div
              className="card"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 4 + randomRotate,
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
                <NewBadge reduceMotion={prefersReducedMotion ?? false} />
              )}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
