import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import "../../ExternalPack/CardStack/Stack.css";

export enum Intensity {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  MAX = 3,
}

export type CardData = {
  id: number | string;
  cardId: number;
  skinId?: number;
  img: string;
  intensity?: Intensity;
};

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableTilt: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableTilt }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_event: any, info: { offset: { x: number; y: number } }) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX: disableTilt ? 0 : rotateX, rotateY: disableTilt ? 0 : rotateY }}
      drag
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
  onCardChange?: (cardId: number) => void;
  onAllSeen?: () => void;
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
}: StackProps) {
  const [cards, setCards] = useState<CardData[]>(cardsData);
  const prefersReducedMotion = useReducedMotion();
  const disableTilt = prefersReducedMotion ?? false;
  const randomRotationCache = useRef<Map<CardData["id"], number>>(new Map());
  const seenCardIds = useRef<Set<CardData["id"]>>(new Set());
  const lastAdvanceAtRef = useRef(0);
  const onAllSeenCalledRef = useRef(false);

  const getGlowClassName = (intensity?: Intensity) => {
    switch (intensity) {
      case Intensity.MAX: return "card-top-glow--max";
      case Intensity.HIGH: return "card-top-glow--high";
      case Intensity.MEDIUM: return "card-top-glow--medium";
      default: return "card-top-glow--low";
    }
  };

  useEffect(() => {
    if (!randomRotation) { randomRotationCache.current.clear(); return; }
    cardsData.forEach((card) => {
      if (!randomRotationCache.current.has(card.id)) {
        randomRotationCache.current.set(card.id, Math.random() * 10 - 5);
      }
    });
  }, [cardsData, randomRotation]);

  useEffect(() => {
    setCards(cardsData);
    seenCardIds.current = new Set();
    onAllSeenCalledRef.current = false;
    const topCard = cardsData[cardsData.length - 1];
    if (topCard) onCardChange?.(topCard.cardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsData]);

  const sendToBack = (id: CardData["id"]) => {
    const now = Date.now();
    if (now - lastAdvanceAtRef.current < 100) return;
    lastAdvanceAtRef.current = now;

    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      if (index === -1) return prev;
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      onCardChange?.(newCards[newCards.length - 1].cardId);
      return newCards;
    });

    seenCardIds.current.add(id);
    if (!onAllSeenCalledRef.current && seenCardIds.current.size >= cardsData.length) {
      onAllSeenCalledRef.current = true;
      onAllSeen?.();
    }
  };

  return (
    <div
      className="stack-container"
      style={{ width: cardDimensions.width, height: cardDimensions.height, perspective: 600 }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation ? (randomRotationCache.current.get(card.id) ?? 0) : 0;
        const isTopCard = index === cards.length - 1;
        const glowClass = isTopCard
          ? `card-top-glow ${getGlowClassName(card.intensity)}${prefersReducedMotion ? " card-top-glow--static" : ""}`
          : "";

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableTilt={disableTilt}
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
              transition={{ type: "spring", stiffness: animationConfig.stiffness, damping: animationConfig.damping }}
            >
              <img src={card.img} alt={`card-${card.id}`} className="card-image" />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
