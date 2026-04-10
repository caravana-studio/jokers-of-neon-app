import { Flex } from "@chakra-ui/react";
import useResizeObserver from "@react-hook/resize-observer";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "../../../components/TiltCard";
import { useGameStore } from "../../../state/useGameStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { getCardUniqueId } from "../../../utils/getCardUniqueId";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";
import { useShopStore } from "../../../state/useShopStore";

interface CardComponentProps {
  id: "traditionals" | "modifiers" | "specials";
  doubleRow?: boolean;
}

export const CardComponent = ({
  id,
  doubleRow = false,
}: CardComponentProps) => {
  const { commonCards, modifierCards, specialCards } = useShopStore();
  const { specialSlots, specialCards: playerSpecialCards } = useGameStore();
  const flexRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();

  const cards =
    id === "traditionals"
      ? commonCards
      : id === "modifiers"
        ? modifierCards
        : specialCards;

  useResizeObserver(flexRef, (entry) => {
    setHeight(entry.contentRect.height);
    setWidth(entry.contentRect.width);
  });

  const cardLength = cards?.length ?? 0;
  const maxCardWidth = width ? (width - cardLength * 12) / cardLength : 0;
  const maxCardHeight = maxCardWidth * 1.52;
  const noAvailableSpecialSlots = playerSpecialCards.length >= specialSlots;
  const dimSpecialCards = id === "specials" && noAvailableSpecialSlots;

  return (
    <RerollingAnimation>
      <Flex
        ref={flexRef}
        h="100%"
        w="100%"
        justifyContent="space-around"
        alignItems="center"
        gap={{ base: 3, sm: 4 }}
        flexWrap={doubleRow ? "wrap" : "nowrap"}
      >
        {cards.map((card) => (
          <Flex
            key={getCardUniqueId(card)}
            opacity={dimSpecialCards ? 0.5 : 1}
            transition="opacity 0.2s ease-in-out"
          >
            <TiltCard
              card={card}
              cursor="pointer"
              onClick={() => {
                if (!card.purchased) {
                  navigate("/preview/card", {
                    state: { card: card },
                  });
                }
              }}
              height={
                height
                  ? doubleRow
                    ? (height / 2) * 0.92
                    : height * (isSmallScreen ? 0.82 : 0.92) > maxCardHeight
                      ? maxCardHeight
                      : height * (isSmallScreen ? 0.82 : 0.92)
                  : undefined
              }
              sx={{
                flex: doubleRow ? "1 1 calc(50% - 12px)" : undefined,
                maxWidth: doubleRow ? "calc(50% - 12px)" : undefined,
              }}
            />
          </Flex>
        ))}
      </Flex>
    </RerollingAnimation>
  );
};
