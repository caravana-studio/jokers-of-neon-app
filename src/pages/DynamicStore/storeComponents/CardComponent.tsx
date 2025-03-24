import { Flex } from "@chakra-ui/react";
import useResizeObserver from "@react-hook/resize-observer";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "../../../components/TiltCard";
import { useStore } from "../../../providers/StoreProvider";
import { getCardUniqueId } from "../../../utils/getCardUniqueId";
import { RerollingAnimation } from "../../store/StoreElements/RerollingAnimation";

interface CardComponentProps {
  id: "traditionals" | "modifiers" | "specials";
  doubleRow?: boolean;
}

export const CardComponent = ({
  id,
  doubleRow = false,
}: CardComponentProps) => {
  const { commonCards, modifierCards, specialCards } = useStore();
  const flexRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

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

  return (
    <RerollingAnimation>
      <Flex
        ref={flexRef}
        h="100%"
        w="100%"
        justifyContent={{ base: "center", sm: "space-between" }}
        alignItems="center"
        gap={{ base: 3, sm: 4 }}
        flexWrap={doubleRow ? "wrap" : "nowrap"}
      >
        {cards.map((card) => (
          <TiltCard
            key={getCardUniqueId(card)}
            card={card}
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
                  : height > maxCardHeight
                    ? maxCardHeight
                    : height * 0.92
                : undefined
            }
            sx={{
              flex: doubleRow ? "1 1 calc(50% - 12px)" : undefined,
              maxWidth: doubleRow ? "calc(50% - 12px)" : undefined,
            }}
          />
        ))}
      </Flex>
    </RerollingAnimation>
  );
};
