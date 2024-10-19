import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { Background } from "../components/Background";
import { Card } from "../types/Card";

import { useTranslation } from "react-i18next";
import CachedImage from "../components/CachedImage";
import { PositionedDiscordLink } from "../components/DiscordLink";
import { PositionedGameMenu } from "../components/GameMenu";
import { LockedSlot } from "../components/LockedSlot";
import { UnlockedSlot } from "../components/UnlockedSlot";
import { MAX_SPECIAL_CARDS } from "../constants/config";
import { CARD_HEIGHT, CARD_WIDTH } from "../constants/visualProps";
import { useGame } from "../dojo/queries/useGame";
import { useGameContext } from "../providers/GameProvider";
import { FullScreenCardContainer } from "./FullScreenCardContainer";

export const SpecialCardsPage = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "special-cards",
  });

  const { specialCards } = useGameContext();

  const [discardedCards, setDiscardedCards] = useState<Card[]>([]);

  const [preselectedCard, setPreselectedCard] = useState<Card | undefined>();

  const game = useGame();

  const unlockedSpecialSlots = game?.len_max_current_special_cards ?? 1;

  const freeUnlockedSlots = unlockedSpecialSlots - specialCards.length;
  const lockedSlots =
    unlockedSpecialSlots === MAX_SPECIAL_CARDS
      ? 0
      : Math.max(1, 5 - unlockedSpecialSlots);

  const scale = isMobile ? 1 : 1.4;

  return (
    <Background type="home" dark bgDecoration>
      <PositionedGameMenu decoratedPage />

      <Flex
        height={"100%"}
        justifyContent="center"
        flexDirection="column"
        gap={4}
      >
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          mx={4}
        >
          <Text size="l">{t("title")}</Text>
        </Flex>
        <FullScreenCardContainer>
          {specialCards.map((card) => {
            const isDiscarded = discardedCards
              .map((card) => card.card_id)
              .includes(card.card_id!);

            return (
              card &&
              !isDiscarded && (
                <Box
                  key={card.id}
                  mx={{base: 0, sm: 1}}
                  mb={3}
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
                  <Box
                    position="relative"
                    w={`${CARD_WIDTH * scale}px`}
                    h={`${CARD_HEIGHT * scale}px`}
                    cursor={"pointer"}
                  >
                    <CachedImage
                      borderRadius={{ base: "5px", sm: "8px" }}
                      src={`Cards/${card.img}`}
                      alt={card.img}
                      w="100%"
                      height="100%"
                      onClick={() => {
                        setPreselectedCard((prev) =>
                          prev === card ? undefined : card
                        );
                      }}
                    />
                  </Box>
                </Box>
              )
            );
          })}
          {Array.from({ length: freeUnlockedSlots }).map((_, index) => (
            <Box mx={1.5} mb={3} p={1}>
              <UnlockedSlot scale={scale} key={`unlocked-${index}`} />
            </Box>
          ))}
          {Array.from({ length: lockedSlots }).map((_, index) => (
            <Box mx={1.5} mb={3} p={1}>
              <LockedSlot scale={scale} key={`locked-${index}`} />
            </Box>
          ))}
        </FullScreenCardContainer>
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          mt={4}
          gap={4}
          mx={4}
        >
          <Button
            fontSize={12}
            onClick={() => {
              navigate(-1);
            }}
          >
            {t("go-back")}
          </Button>
          <Button
            isDisabled={!preselectedCard}
            variant={!preselectedCard ? "defaultOutline" : "secondarySolid"}
            fontSize={12}
            onClick={() => {}}
          >
            {t("remove")}
          </Button>
        </Flex>
      </Flex>

      {!isMobile && <PositionedDiscordLink />}
    </Background>
  );
};
