import {
  Box,
  Flex,
  SystemStyleObject,
  Text,
  Tooltip,
  useTheme,
} from "@chakra-ui/react";
import { Card } from "../../../types/Card";

import { useTranslation } from "react-i18next";
import CachedImage from "../../../components/CachedImage";
import { LockedSlot } from "../../../components/LockedSlot/LockedSlot";
import { TemporalBadge } from "../../../components/TemporalBadge";
import { UnlockedSlot } from "../../../components/UnlockedSlot";
import { CARD_HEIGHT, CARD_WIDTH } from "../../../constants/visualProps";
import { useCardData } from "../../../providers/CardDataProvider";
import { useGameContext } from "../../../providers/GameProvider";
import { useGameStore } from "../../../state/useGameStore";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { getTooltip } from "../../../utils/getTooltip";
import { FullScreenCardContainer } from "../../FullScreenCardContainer";

interface SpecialCardsProps {
  containerSx?: SystemStyleObject;
  discardedCards: Card[];
  preselectedCard?: Card;
  onCardClick: (card: Card) => void;
}

export const SpecialCards: React.FC<SpecialCardsProps> = ({
  containerSx = {},
  discardedCards,
  preselectedCard,
  onCardClick,
}) => {
  const { colors } = useTheme();

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  const { getCardData } = useCardData();
  const { specialSlots, specialCards, maxSpecialCards } = useGameStore();

  const freeUnlockedSlots = specialSlots - specialCards.length;
  const lockedSlots =
    specialSlots === maxSpecialCards ? 0 : Math.max(1, 5 - specialSlots);

  const { isSmallScreen, cardScale } = useResponsiveValues();

  const desktopScaleMultiplier = specialCards.length > 5 ? 1.4 : 1.2;
  const scale = isSmallScreen
    ? cardScale * 1.2
    : cardScale * desktopScaleMultiplier;

  return (
    <Flex
      height={"100%"}
      w="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={4}
      px={6}
      sx={{ ...containerSx, zIndex: 1 }}
    >
      <Flex gap={4} flexDirection="column">
        {!isSmallScreen && (
          <Text mx={2} size="l">
            {t("title")}
          </Text>
        )}
        <FullScreenCardContainer>
          {specialCards.map((card) => {
            const isDiscarded = discardedCards
              .map((card) => card.card_id)
              .includes(card.card_id!);

            const { name, description } = getCardData(card.card_id ?? 0);

            return (
              card &&
              !isDiscarded && (
                <Box
                  key={card.id}
                  mx={{ base: 0, sm: 1 }}
                  p={1}
                  sx={{
                    borderRadius: { base: "10px", sm: "17px" },
                    border:
                      preselectedCard?.card_id === card.card_id
                        ? `2px solid ${colors.blueLight}`
                        : "2px solid transparent",
                    boxShadow:
                      preselectedCard?.card_id === card.card_id
                        ? `0px 0px 15px 12px ${colors.blue}`
                        : "none",
                  }}
                >
                  <Tooltip label={getTooltip(name, description)}>
                    <Box
                      position="relative"
                      w={`${CARD_WIDTH * scale}px`}
                      h={`${CARD_HEIGHT * scale}px`}
                      cursor={"pointer"}
                      onClick={() => onCardClick(card)}
                    >
                      <CachedImage
                        borderRadius={{ base: "5px", sm: "8px" }}
                        src={`/Cards/${card.img}`}
                        alt={card.img}
                        w="100%"
                        height="100%"
                      />
                      {card.temporary && (
                        <TemporalBadge remaining={card.remaining ?? 1} />
                      )}
                    </Box>
                  </Tooltip>
                </Box>
              )
            );
          })}
          {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
            <Box mx={1.5} p={1}>
              <UnlockedSlot scale={scale} key={`unlocked-${index}`} />
            </Box>
          ))}
          {Array.from({ length: lockedSlots }).map((_, index) => (
            <Box mx={1.5} p={1}>
              <LockedSlot
                scale={scale}
                showPrice={index === 0}
                key={`locked-${index}`}
              />
            </Box>
          ))}
        </FullScreenCardContainer>
      </Flex>
    </Flex>
  );
};
